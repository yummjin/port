---
title: "Next.js의 캐시를 활용해 사용자 경험 개선하기 (1)"
date: "2025-10-14"
description: "Next.js의 4가지 캐시를 자세히 알아보자."
tags: ["Next.js"]
---

## 들어가며
작년 초기 개발 이후 계속 개선하고 있는 교내 식당 정보 서비스인 "기룡아 밥먹자"는 정적인 메뉴 응답을 반환하는 API 두 가지와, 동적으로 로드되어야 하는 리뷰 데이터 API 그리고 그에 대한 CRUD 기능으로 이루어져 있다. 

정적인 메뉴 응답을 반환하는 API 두 가지 중 한 가지(교내식당 메뉴 API)의 경우 백엔드 측에서 알려주지 않으면 정보의 변화가 없다. 그리고 나머지 하나의 경우 매주 월요일마다 그 주 메뉴를 반환하기 위해서 정보가 변경된다.

두 가지 메뉴 API는 모두 데이터 변경의 횟수가 적어, 요청을 여러 번 보내지 않아도 된다. 그리고 이 점을 바탕으로 캐시를 활용하면 백엔드에 요청을 보내는 횟수를 줄이고, 같은 데이터를 재사용하며 페이지 속도를 높여 사용자 경험을 개선할 수 있지 않을까 생각했다.

## Next.js의 캐시
![](https://velog.velcdn.com/images/yummjin/post/51e5e9a8-a5c7-4de5-82da-e9438206aa7e/image.png)
Next에는 공식문서에서 위와 같이 명시한 것처럼 4가지 매커니즘의 캐시가 존재한다. 이 중 Request Memoization, Data Cache, Full Route Cache는 서버 쪽의 캐시이고, Router Cache는 클라이언트 쪽의 캐시인데, 전체적으로 보았을 때 다음 사진과 같이 동작하게 된다.

![](https://velog.velcdn.com/images/yummjin/post/d5741878-54f6-4397-ba7d-5d1e157d4d63/image.png)

네 가지 개념에 대해 자세히 알아보고 이를 바탕으로 우리 서비스의 성능을 개선한 내용도 같이 적어보고자 한다.

### Request Memoization
먼저 리퀘스트 메모이제이션은 한 페이지 내부의 여러 컴포넌트에서 같은 엔드포인트로 같은 형태의 요청을 여러 번 보내는 상황이 발생할 경우에 사용된다. Next 서버는 이런 같은 요청의 반복을 감지하여 한 번의 요청을 통해 여러 사용처에서 이를 사용할 수 있도록 **요청 함수의 결과값을 캐싱**하는데, 이것이 리퀘스트 메모이제이션이다.

쉽게 말해서 데이터 캐싱인데, **API 요청 시점에서만 작동하는 캐싱**이다. 'API 요청 시점에서만 작동한다' 라는 것은, 이 메모이제이션은 넥스트 서버가 서버 컴포넌트를 렌더링하는 시점(빌드 시점)에서만 이루어지기 때문이다. 렌더링이 끝나면 리퀘스트 메모이제이션으로 캐싱된 데이터(함수 결과값)는 사라진다.

### Data Cache
데이터 캐시 또한 서버 쪽의 캐시인데, 리퀘스트 메모이제이션보다는 더 서버 쪽에 가깝게 존재하는 캐시이다. 서버 요청과 배포를 통해 들어오는 데이터 패칭의 결과를 **유지**시키는 Next 서버의 빌트인 캐시이다. "유지" 에 강조 표시를 해둔 이유는 리퀘스트 메모이제이션과의 차이점이 바로 **캐시가 유지되는 점**이기 때문이다. 앞서 언급했듯 리퀘스트 메모이제이션은 캐시가 렌더링 과정 도중에만 유효하고 렌더링이 끝나면 사라진다. 하지만 데이터 캐시는 데이터 소스에서 받아온 데이터가 사용자가 설정한 캐싱 옵션에 따라 계속 유지되거나 Page Router의 ISR처럼 작동하기도 한다.

이것이 가능한 이유는 Next가 **native fetch API를 상속**해서 사용하기 때문이라고 공식 문서에 기재되어 있는데, "fetch API를 상속해서 사용한다" 라는 말의 의미는 이렇다. Next는 Node.js의 **기본 메서드인 `fetch()`를 재정의**한 것이다. 그래서 단순히 네트워크 요청을 보내는 함수가 아니라, Next의 빌드, 캐싱, 서버 컴포넌트 시스템과 연결된 fetch로 바뀐다. 따라서 서버 컴포넌트 내부에서 fetch 함수를 통해 데이터를 받아온다면, 그냥 브라우저 fetch 처럼 작동하는 것이 아니라 Next의 **내부 캐시 계층**을 거치고, Vercel 캐시나 빌드 타임 캐시까지 관여하게 된다는 것이다. (이래서 Next의 복잡한 캐시 매커니즘이 작동하는 것!) 그리고 이때 요청마다 각자의 캐싱 옵션(force-cache, no-store, revalidate 등)을 지정하고 그 옵션은 서버 캐시 계층에 영구 반영된다.

데이터 캐시는 다음 사진처럼 작동한다.

![](https://velog.velcdn.com/images/yummjin/post/ce1184ca-b3ee-423b-b1fb-88c13a1bb82a/image.png)

**렌더링** 중 fetch 요청이 force-cache 옵션과 함께 들어오면, Next는 데이터 캐시에 해당 요청에 대한 캐시된 데이터가 있는지 먼저 확인한다. 캐시된 응답이 있다면 즉시 반환한 후 리퀘스트 메모이제이션에 세팅한다. 이를 통해 렌더링 과정에서 같은 페이지에서 발생하는 중복 요청을 단일 요청만으로도 처리할 수 있게 되는 것!

fetch 요청이 no-store 옵션과 함께 들어오면(아무것도 명시하지 않으면 기본값이 no-store로 설정되는 점 주의하자) 요청에 대한 응답값은 항상 data source(백엔드 서버 등)에서 패칭되고 리퀘스트 메모이제이션에 세팅된다. (여기서 알 수 있듯 리퀘스트 메모이제이션은 항상 Next가 알아서 세팅한다!)

![](https://velog.velcdn.com/images/yummjin/post/a9cb3a8b-8f8d-4b2a-9fe0-3d91b42dad5d/image.png)
이때 여기서 말하는 렌더링은 위 사진처럼 유저가 접속 요청을 보냈을 때 Next 서버가 자바스크립트 코드를 HTML로(최신 버전에서는 rsc로)변환하는 과정을 뜻한다! (이때 만약 SSG로 정적 생성된 페이지라면 이 과정은 빌드 타임에 이루어지게 된다)

### Data Cache의 캐싱 옵션
데이터 캐시는 다양한 캐싱 옵션을 통해 간단한 Time-based Revalidation부터 기존 Page Router에서 번거롭게 설정했던 On-demand Revalidation까지 간단하게 수행할 수 있도록 도와준다. (거의 SWR이나 Tanstack Query 사용하는 것처럼 간단하다!!)

> **1. Time-based Revalidation**

Time-based Revalidation은 `fetch(url, { next: { revalidate: 60 } })` next - revalidate 옵션을 통해 활성화할 수 있다. 작동 방식은 다음과 같은데, 여기서 중요하고 ~~interesting한~~ 점은 Data가 Stale(Revalidate 옵션을 통해 설정한 시간이 지나서 데이터의 유통기한이 지난 상태) 상태일 때에도 새 데이터를 받아오는 동안 Stale한 데이터를 보여줌으로써 사용자가 빈 데이터를 볼 틈이 없도록 해준다는 것이다. 

![](https://velog.velcdn.com/images/yummjin/post/f780e27e-b902-478c-b98f-3c3efb5d44c9/image.png)

Revalidation을 통해 신선한 새 데이터가 받아와지면 Next는 데이터 캐시를 새 데이터로 갈아끼우게 되는데, 만약 Revalidation이 실패하더라도 기존 데이터 캐시에 있는 상한 데이터를 없애지 않기 때문에 실패한 상황에서도 사용자가 볼 데이터는 남아있게 된다..! 🥹


> **2. On-demand Revalidation**

이 부분이 앞서 클라이언트 데이터 패칭 상태관리 패키지를 사용하는 것처럼 편리하다고 언급했었다. On-demand Revalidation이 어떻게 작동하는지 사진으로 먼저 확인하면 금방 이해할 수 있을 것이다!

![](https://velog.velcdn.com/images/yummjin/post/921efe58-2f5e-4b2c-8256-64e6f210596b/image.png)

보면 Tag를 통해서 특정 데이터의 Stale 상태를 다룰 수 있다는 것을 알 수 있다. 이는 기존 우리가 Tanstack Router나 SWR에서 Key를 사용하던 형태와 매우 비슷하다!

On-demand에서 데이터를 Revalidate하는 방법은 경로(`revalidatePath`)에 따라 Revalidate하거나 위의 태그(`revalidateTag`)를 사용하는 방법 두 가지가 있으니 용도에 맞게 잘 사용하면 된다.

> **3. Opting out**

_옵팅 아웃은 공식 문서에 있는 제목을 그대로 가져왔는데 '참여하지 않다'? 라는 뜻을 가지고 있다고 한다!_
캐시를 아예 사용하지 않으려면 
`let data = await fetch('https://api.vercel.app/blog', { cache: 'no-store' })` 
no store 옵션 사용해주기!

### Full Route Cache

대망의 Full Route Cache이다. 이 부분이 가장 이해하기 어려울 수 있다. 클라이언트 쪽의 Router 캐시와도 다른 개념이며, 데이터 관련 캐싱을 앞단에서 모두 다뤘는데 또 캐시가 필요하다고? 싶을 것이다. 하나하나 살펴보자.

Next에서는 **빌드 타임**(Vercel에서 배포할 때 아래와 같은 화면에서 Building이라는 텍스트를 볼 수 있는데 바로 그때 일어나는 과정을 말한다! 배포 과정에서 빌드가 일어난다) 에 자동으로 렌더링을 진행하고 라우트를 캐싱하곤 한다.
![](https://velog.velcdn.com/images/yummjin/post/ce2efb73-4df2-48e0-b913-2ddc8e6c651b/image.png)

이는 우리가 익히 알고 있는 Next만의 최적화 방식인데, 라우트에 대한 요청이 들어올 때마다 서버에서 렌더링을 진행하는 대신 캐싱된 라우트를 제공해서 더 빠르게 페이지를 로드할 수 있게 하는 작업이다.

이때 Full Route Cache가 어떻게 작동하는지 명확하게 이해하기 위해서는 먼저 리액트가 어떻게 렌더링을 다루고, Next가 이를 어떻게 캐싱하는지 명확하게 알아야 한다.

> **1. React Rendering on the Server**

서버 단에서 렌더링을 진행할 때 Next는 React API를 사용하게 된다. 이런 렌더링 작업은 조각으로 나뉘어서 진행되게 되는데, 각각의 라우트 세그먼트와 `Suspense` 바운더리로 나뉘게 된다.

각각의 조각(Chunk) 들은 두 가지 절차를 통해 렌더링되게 되는데
- 먼저 리액트는 서버 컴포넌트들을 React Server Component Payload, 즉 RSC 페이로드라는 스트리밍에 최적화된 특별한 데이터 포맷으로 렌더링한다(RSC 페이로드는 서버 컴포넌트 트리가 렌더링된 이진 데이터이다).
- Next는 이후 이런 RSC 페이로드 데이터와 클라이언트 컴포넌트의 JS를 통해 서버에서 HTML을 렌더링한다.

이는 곧 우리가 모든 렌더링이 완료될 때까지 기다린 뒤에야 캐싱하거나 요청을 보낼 필요가 없고, 렌더링 작업이 **완료되는 대로 부분적으로 응답을 스트리밍**할 수 있다는 것이다. 

쉽게 말하면 완료된 부분을 부분적으로 서버가 클라이언트에게 전송하기 때문에, 사용자가 빨리 처리되는 부분들을 먼저 접할 수 있다는 뜻인 것 같다.

> **2. Next.js Caching on the Server (Full Route Cache)**

Full Route Cache는 이렇게 위에서 살펴봤던 렌더링 데이터에 대한 캐시이다. Next는 RSC 페이로드와 HTML로 렌더링된 특정 라우트의 결과물을 기본적으로 서버에 캐싱해둔다. 이는 빌드 타임에, 또는 Revalidation을 통해 정적으로 렌더링된 라우트에 적용된다.

![](https://velog.velcdn.com/images/yummjin/post/63f097e5-a3c3-497a-a213-3a27bdca79d2/image.png)

이게 바로 위에서 언급했던 “서버에서 렌더링된 결과물에 대한 **서버 캐시**” 이다.

> 그럼 이때, Full Route Cache가 적용되면 무조건 페이지를 불러오는 것이 빠를까?

정답은 **아니다**. 

하지만 나는 이것이 html을 불러오는 것처럼 빠를 것이라고 생각했고, 결국 중요한 사실을 깨닫게 된다. (다음 글에서 나의 오해와 개선 방법을 풀어볼 예정이다.)

> **3. React Hydration and Reconcilation on the Client**

그럼 요청 시간에 클라이언트에서는 어떤 일이 발생할까?
- HTML은 상호 작용이 불가한 클라이언트 + 서버 컴포넌트의 UI 프리뷰를 즉시 제공한다.
- RSC 페이로드는 클라이언트 사이드에서 렌더링된 서버 컴포넌트 트리를 조합하고, DOM을 업데이트한다.
- 이후 자바스크립트 명령들 (어떤 부분에 JavaScript를 주입해 상호작용 가능하게 만들어야 하는지에 대한 정보가 담겨있다) 은 클라이언트 컴포넌트를 hydration해서 서비스가 상호작용 가능하도록 한다.

> **4. Next.js caching on the client (Router Cache)**

드디어 Router Cache! 위에서 본 네 가지 캐시 중 유일하게 혼자 Client 캐시였던 친구다. 이 친구가 사용자 경험에 아주 중요한 영향을 미친다.

Router Cache는 클라이언트 사이드에서 미리 특정 라우트에 대한 Full Route Cache(RSC 페이로드) 또는 서버 더 깊은 곳에서 렌더링된 RSC 페이로드를 받아와 클라이언트 캐시로 둔 것을 뜻한다. 참고로 Router Cache가 해당 라우트에 방문하기 전에 생성되도록 하는 것이 Prefetching이다.


> **5. Subsequent Navigations**

Next는 Subsequent Navigation 또는 위에서 언급한 Prefetching 을 수행하면서 Router Cache에 RSC 페이로드 캐시 데이터가 존재하는지 확인한다. 만약 존재한다면 서버에게 요청을 보내지 않게 된다.

따라서 네비게이션 시 **정적 서버 컴포넌트로만 이루어진 사이트**라면 서버 통신이 전혀 일어나지 않고, RSC 페이로드가 즉시 DOM 요소를 그리기 때문에 마치 SPA 같은 화면 전환을 제공하게 된다.

다만 이때 **정적 서버 컴포넌트로만 이루어진 사이트** 일 경우에만 이렇게 동작한다. 그럼 다른 방식으로 이루어진 사이트는 어떻게 동작하는지, 총 몇 가지의 방식이 있는지를 알아야 한다. App Router에서는 이것을 Static and Dynamic Rendering이라고 특정 기준을 통해 분류한다. 참고로 방금 언급한 **정적 서버 컴포넌트**로만 이루어진 사이트는 Static Rendering에 속한다.

> **Static and Dynamic Rendering**

![](https://velog.velcdn.com/images/yummjin/post/9cc9c6b6-7340-4a2a-a954-1abe6f075279/image.png)

사진을 통해 알 수 있듯 Static Route와 Dynamic Route의 차이는 Full Route Cache의 유무이다. Static Route는 기본적으로 Full Route Cache로 캐싱되고 Dynamic Route는 요청 시점에 동적으로 서버를 통해 렌더링된다. (Full Route Cache로 캐싱되는 Static Route가 일반적으로 더 빠른 응답을 주기에, Next에서도 대부분의 라우트를 Static Route로 구성하는 것을 권장하고 있다고 한다!)

Static Route는 위에서 강조한 것처럼 **정적 서버 컴포넌트** 로 이루어져야 한다. **요청 시점에 변경되는 무언가**에 따라 **맞춤형 데이터**를 서빙해주어야 하는 경우에는 무조건 Dynamic Route가 된다. 공식 문서에서는 다음과 같은 API를 사용하면 무조건 Dynamic Route가 된다고 명시하고 있다.

![](https://velog.velcdn.com/images/yummjin/post/ceca4bae-bfe4-44e1-aa6c-2c79468900db/image.png)

그럼 이런 Dynamic Route는 그럼 아예 Full Route Cache를 사용할 수 없을까? 아마 Dynamic Route 내부에서도 일부분은 정적으로 렌더링될 수 있는 부분이 존재할 수도 있는데, 아예 모든 부분을 요청 시점에 렌더링하는 것은 매우 비효율적이라는 생각이 들 수밖에 없다. 이런 상황을 위해서 Partial Prerendering이 존재한다.

![](https://velog.velcdn.com/images/yummjin/post/69a61047-cb3f-4a25-a52d-4d3bba16bef9/image.png)

Dynamic Route에서 Partial Prerendering을 사용하기 위해서는 요청 시점에서 변경될 수 있는 데이터에 관한 부분을 `Suspense` 바운더리로 묶어서 “이 부분은 런타임에 변경될 수 있는 컴포넌트입니다” 라는 것을 나타내주면 된다. `Suspense` 를 통해 Dynamic 바운더리를 표시해줄 수 있는 것이다. 

Suspense와 Partial Prerendering에 관한 부분은 내용이 많기 때문에 따로 다루어 보도록 하고, 모쪼록 이런 것이 Full Route Cache의 생성에 영향을 미친다는 점만 알아두고 가면 될 것 같다.

### Full Route Cache의 지속성 및 Revalidation

일단 지속성 같은 경우, Full Route Cache는 기본적으로 영구적이라고 한다! 

그럼 어떻게 이 캐시를 만료시킬까? 방법은 두 가지가 있다.
- 데이터를 Revalidate 하기 -> 데이터 캐시의 데이터를 Revalidate하면, 화면을 전환해야 하기 때문에 서버에서 리렌더링이 일어나고, 이렇게 일어난 리렌더링의 결과값을 새롭게 캐싱하게 된다.
- 재배포하기 -> Data Cache는 배포 전역적으로 지속성을 유지하는 반면 Full Route Cache는 새 배포마다 지워지고 다시 생성된다. (어떻게 보면 당연한게 빌드 타임에 서버컴포넌트를 렌더링한 결과값이 저장되기 때문에 다시 생성될 수밖에 없는 것 같다.)

> Opting Out (Full Route Cache 안 쓰려면)

- 위에서 Dynamic Route는 F.R.C가 생성되지 않는다 했다. 따라서 쓰고 싶지 않다면 역으로 동적 함수를 사용하여 Dynamic으로 만들면 된다. 
- Route Segment Config Option을 사용할 수도 있다. 파일 상단에 옵션을 명시해 주면 된다.
- Data Cache를 쓰지 않으면 된다. (데이터를 계속 새로 받아와야 하기에 F.R.C가 생성될 수 없다)

### Client-side Router Cache

대망의 마지막 캐시이자 유일한 클라이언트 캐시! 이 친구는 위에서도 잠깐 살펴봤듯 사용자 경험에 막대한 영향을 미치는 아이이다. 정확하게 공식문서에서는 다음과 같이 정의하고 있다.

> Router Cache는 route 세그먼트, 레이아웃, 로딩 상태, 그리고 페이지들의 RSC 페이로드를 저장하고 있는 클라이언트 사이드 인 메모리 캐시이다!

Router Cache는 네비게이션 시 재사용되는 레이아웃을 기본적으로 캐싱한다. 그리고 `loading.js` 와 같은 Instant한 로딩 상태 또한 기본적으로 캐싱하고 다시 사용한다. 페이지들과 같은 경우 기본적으로 캐싱하지는 않지만, 브라우저 뒤로가기 및 앞으로 가기 네비게이션 시에 재사용된다고 한다. 

페이지 세그먼트에 대한 Router Cache를 직접 설정을 통해 활성화하는 방법은 `staleTimes` config 옵션을 사용하는 것이다.

### Router Cache의 지속 시간

Router Cache는 브라우저의 일시적인 메모리에 저장되어 있기 때문에 세션과 자동 Invalidation 기간에 따라 그 지속 시간이 결정된다고 한다. 

- **세션** 같은 경우 새로고침을 해서 새로운 세션을 시작하는 경우 Router Cache가 사라지기에 지속시간과 밀접한 관계를 맺고 있는 것이다.
- 그리고 자동 Invalidation 기간(공식 문서에는 Automatic Invalidation Period라 써잇음) 같은 경우 Next 자체에서 지정해둔 Router Cache의 유효기간인 것 같다. 기본 프리패칭의 경우(prefetching 옵션이 존재하지 않는 경우) Dynamic Page는 캐싱하지 않고, 정적 페이지는 5분간 캐싱한다고 한다. prefetch 옵션을 true로 설정해둔 경우 Dynamic/Static 모두 유효기간이 5분으로 설정된다고 한다.

### Router Cache는 기본적으로 Opted Out!
Next 15 버전에서 모든 프리패칭은 기본적으로 false로 설정되어 있어 사용해야 한다면 직접 지정해 주어야 한다.

### 캐싱과 관련된 API들

[공식 문서](https://nextjs.org/docs/app/guides/caching#apis)를 확인하자! 개발 시 알게 되는 것들이 대부분인데 혹시나 이런 기능이 있을까? 싶을 때 찾아보면 좋을 것 같다.

## 마무리하며

원래는 이 글에서 모두 작성하려 했는데 개념만 공부해도 길어져서 실제 개선기는 다음 글에 작성하는 것으로~!!
