---
title: "Next.js의 캐시를 활용해 사용자 경험 개선하기 (2)"
date: "2025-10-16"
description: "Next.js 캐시로 페이지 반응 속도와 FCP를 개선해보자."
tags: ["Next.js"]
---

## 들어가며

캐시를 통해 해결하고자 했던 것은 다름 아닌 빠른 페이지 반응 속도와 빠른 FCP(First Content Paint), 그리고 적은 백엔드 API 요청이었다.

공식 문서를 얼추 확인하여 **Data Cache**를 통해 가능한 한 적은 데이터 요청을 할 수 있는 방법을 알게 되었고, 그를 적용해 빠르고 백엔드에게 필요 없는 요청을 하지 않도록 설정할 수 있었다.

하지만 문제가 있었다. 바로 **Tab Navigation의 속도가 눈에 띄게 느려서** 사용자가 여러 번 버튼을 누르는 등의 행동을 하게끔 만들었다. 결국 사용자 경험에 큰 악영향을 주었다. 이 글에서는 이전 글에서 다룬 캐시에 관련한 내용을 바탕으로 해당 현상을 처리하는 과정을 다룬다.

## 초기 구현 방식 & 느린 속도의 원인

초기에는 단순히 “상태의 사용을 줄이고 모두 Server Component로 만들자” 는 생각으로 구조를 짰다. 상태(React의 state 사용)를 줄이되 한 페이지 내에서 다양한 옵션 선택에 따른 화면을 보여주기 위해 searchParam을 선택했다. 

하지만 searchParam의 선택은 state의 사용보다 못한 성능을 보여줬다.

### Static과 Dynamic 렌더링 방식

빌드 결과를 보면 Static과 Dynamic 두 가지 형태로 빌드가 완료된 것을 확인할 수 있다. 이는 Next에 존재하는 두 가지 렌더링 방식으로,

[더 자세한 내용은 이전 글에서 다루었다!](https://velog.io/@yummjin/Next.js%EC%9D%98-%EC%BA%90%EC%8B%9C%EB%A5%BC-%ED%99%9C%EC%9A%A9%ED%95%B4-%EC%82%AC%EC%9A%A9%EC%9E%90-%EA%B2%BD%ED%97%98-%EA%B0%9C%EC%84%A0%ED%95%98%EA%B8%B0-1#full-route-cache)

- Static Route 의 경우에는 온전히 정적인 서버 컴포넌트로만 이루어져 있는 부분 (Pages 라우터의 SSG와 비슷하다, 빌드 시점에서 앞으로 사이트가 동작하며 변하지 않을 요소들로만 구성되어 있어야 한다)

![](https://velog.velcdn.com/images/yummjin/post/0218b669-6a02-4885-980f-96fb36bae8d8/image.png)

Static Route는 빌드 타임에 사전 렌더링이 이루어지고 Full Route Cache에 RSC 페이로드가 저장된다.

- Dynamic Route 의 경우에는 빌드 후 사용자가 페이지를 요청하는 시점마다 변경되는 무언가에 따라 맞춤형 데이터를 서빙해주어야 하는 부분이 포함되어 있다.

![](https://velog.velcdn.com/images/yummjin/post/501c0950-0407-4a8d-b1b0-d2ff69268a9f/image.png)

따라서 Dynamic Route는 무조건 빌드 타임 이후에 사전 렌더링이 이루어진다.

searchParam은 요청 시점에 변경될 여지가 있는 무언가였기에, 요청할 때마다 서버에서 렌더링이 진행되는 Dynamic Route가 되었다. 아래 빌드 결과를 확인해 보면 모두 `f`, 즉 Dynamic 라우트로 빌드되어 있음을 확인할 수 있다.

![](https://velog.velcdn.com/images/yummjin/post/24c45da9-d391-4d4e-a870-0892d3c5db33/image.png)


결국 초반에는 렌더링 관련 캐시를 하나도 사용하지 않고 Data Cache만 사용한 상태였기에, 사용자가 **요청할 때마다 렌더링(데이터 패칭은 캐시가 제대로 적용되어 있었다)**이 이루어졌고 이에 더해 메뉴를 분리하는 내부 서버 로직까지 추가되어 느린 네비게이션 속도를 보여줬던 것이다.

## 클라이언트 컴포넌트로 전환?

이런 문제점을 해결하기 위해 처음에는 서버 로직이 많은 것이 문제인 것 같아 서버 로직을 줄이고 클라이언트 컴포넌트로 감싸 로직 실행 시간을 줄여줬다. 이 방법은 확실히 효과가 있었다. SPA 같은 탭 전환 반응이었다.

그런데 생각해 보니 우리 페이지는 메뉴가 변경될 일이 거의 없는 메뉴 페이지이기에 Next의 장점을 더욱 살릴 수 있을 것 같았다. searchParam의 사용을 없애 Static한 페이지를 만들어 빌드 시점에서 정적으로 생성하면, Full Route Cache를 통해 더욱 빠른 화면 전환을 보여줌과 동시에 차후에 도입할 공유 기능을 위한 MetaData 설정에도 좋을 것 같다는 생각이 들었다.


## Static Route로 변경

이렇게 Full Route Cache를 공부하고 나서는 모든 컴포넌트를 Static Route가 적용될 수 있도록 변경했다.

slug를 통해 레스토랑의 카테고리를 구분하고, 기숙사의 경우 `[day]` slug를 통해 요일을 구분할 수 있도록 했다. 그리고 `generateStaticParams` 를 통해 모든 slug에 대해 정적 페이지를 생성했다.

### `generateStaticParams` 사용

이때 `generateStaticParams` 함수는 dynamic 한 라우트 slug에 들어갈 수 있는 값들을 미리 제공하여 해당하는 페이지들을 정적으로 빌드 타임에 생성할 수 있도록 하는 함수이다. (이 함수를 적용하지 않으면 요청 시마다 페이지가 렌더링되게 된다, 고로 static route로 전환하는 데에 해당 함수를 통해 가능한 slug 목록을 전달하는 것이 매우 중요하다)

```plain text
campus/
└── [foodCourtId]/
    └── [restaurantId]/
        └── [categoryKey]
```

우리 페이지는 다음과 같은 구조를 가졌기에 각 slug 아래의 `page.tsx` 에서 `generateStaticParams` 를 통해 


```javascript
// campus/[foodCourtId]/page.tsx

export function generateStaticParams() {
  const locales = ['ko', 'en'];
  const foodCourtIds = CAMPUS_FOOD_COURTS.map(fc => FOOD_COURT_ID[fc]);

  return locales.flatMap(locale =>
    foodCourtIds.map(foodCourtId => ({
      locale,
      foodCourtId,
    })),
  );
}

```

이렇게 가능한 slug 조합을 배열로 내려줌으로써 정적 페이지를 생성할 수 있었다. `generateStaticParams` 에 대해서는 다음 글에서 자세히 살펴보자.

그렇게 정적 페이지를 생성하고 빌드하면 다음과 같이 정적 생성된 라우트들이 `SSG` 라고 속이 찬 동그라미와 함께 표시된다.

![](https://velog.velcdn.com/images/yummjin/post/8d52b460-5978-4e97-b54b-89bec3060a7f/image.png)

### 하지만..

하지만 이상한 점을 발견했다. 분명히 모두 Static Route로 신경 써서 만들어 빌드 시 정적으로 모든 페이지의 데이터를 아래처럼 생성하는데도, 심지어 prerendered as static HTML인데도!

페이지의 전환 속도가 느렸다.

## Full Route Cache는 서버 캐시

모든 페이지에 Full Route Cache가 적용되면, 정적으로 페이지를 생성해버리면 아예 **RSC 페이로드를 불러오기만 하면 끝이니까 탭 간 전환 시 SPA처럼 끊김없는 동작을 보여줄 것**이라고 생각했다. 하지만 아니었다.

그런데 왜 아닐까?

![](https://velog.velcdn.com/images/yummjin/post/0218b669-6a02-4885-980f-96fb36bae8d8/image.png)

정답은 위 사진을 보면 알 수 있다. 사진을 자세히 보면 Full Route Cache 위에 Next 서버라고 쓰여 있다. 위에서도 강조했지만, **서버 캐시** 인 것이다. 따라서 사용자가 **요청을 하면 서버에서 이 서버 캐시를 받아와야** 한다. 

SPA는 정적 페이지일 경우 서버에 요청을 하지 않고 상태 등으로 화면을 관리하기 때문에 매우 빠른 응답을 보여준다. 

![](https://velog.velcdn.com/images/yummjin/post/e9e1d8da-1d70-4436-a0f2-1796f98ea0ce/image.gif)

위처럼 React로 만든 구버전 기룡이에서는 탭 전환 시 별도의 네트워크 요청 없이 매우 빠른 응답을 보여주고 있다.

반면 Next.js App Router의 경우, Full Route Cache가 완벽하게 정적 페이지로 생성되어 있다고 해도 **해당 라우트에 대해 생성된 데이터가 없다면** 사용자가 **페이지에 접속하는 시점에 서버에서 Full Route Cache를 내려달라는 요청이 발생**하게 된다. 따라서 이 요청에 대한 시간이 걸렸고, 여기서 Delay가 발생했다. 

![](https://velog.velcdn.com/images/yummjin/post/49312d64-7fe1-46a6-846e-f1549043c14e/image.gif)


인터넷이 느릴 수도 있는 학교 환경을 감안해 throttle을 걸자 지연 시간이 2초까지 늘어나는 것을 확인할 수 있었다.

![](https://velog.velcdn.com/images/yummjin/post/ebef27f0-c59f-4eb1-8ad0-59d02ff2a8a5/image.png)

![](https://velog.velcdn.com/images/yummjin/post/bd89e994-5dc5-410d-8fe5-402b34e06c43/image.png)

(순서대로 4G throttle 걸었을 때 1.41초, 3G throttle 시 2.10초)

결국 느린 탭 전환이라는 문제가 해결되지 않았던 것이다.

## Prefetch 적용

그래서 이렇게 정적 생성된 페이지들에 대한 Full Route Cache 결과물을 미리 Router Cache로 불러와두고 요청 시점에는 바로 응답할 수 있도록 prefetch를 적용했다. 

![](https://velog.velcdn.com/images/yummjin/post/0dcb2d2d-bac5-458a-9117-5173c29c264e/image.png)

1번 페이지에 접속했을 때 네트워크 탭을 통해 나머지 es, sb, 2, 3, 4, 5번 페이지에 대한 Full Route Cache를 받아오도록 변경되었다.

네트워크 페이로드가 어떻게 설정되어 있어도 이제 다른 라우트에 대한 데이터를 미리 불러오기 때문에 

![](https://velog.velcdn.com/images/yummjin/post/a627e911-a635-4c29-a297-174717528237/image.gif)

추가 요청 없이 즉각적인 페이지 변경이 이루어진다는 것을 확인할 수 있다!


## 결론

- **Dynamic -> Static Route** 변경을 통해 **Full Route Cache** 적용

- Full Route Cache를 클라이언트에서 미리 불러와(prefetch) **Router Cache로 저장** 후 요청이 들어올 때 즉각 응답!!

3G 환경에서 2.1s였던 페이지 전환 딜레이 시간을 0s에 수렴하도록 개선하였다!
