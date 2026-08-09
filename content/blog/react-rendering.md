---
title: "React 컴포넌트가 렌더링되는 과정"
date: "2025-11-07"
description: "React 컴포넌트는 어떤 과정을 거쳐 렌더링될까?"
tags: ["React"]
---

## 들어가며

리액트 컴포넌트를 자주 사용하기는 했지만, 이 컴포넌트가 도대체 어떤 과정을 거쳐서 화면에 보이게 되는지는 알고 있지 못한 것 같아 알아보고자 한다! 컴포넌트가 어떻게 React에서 렌더링되는지를 공식 문서를 바탕으로 이해해본다.

## UI를 요청하고 제공하는 세 단계

컴포넌트가 우리 눈에 보이게 되기까지의 과정을 공식 문서에서는 세 단계로 나누어 표현하고 있다.

첫 번째 단계는 렌더링 트리거, 두 번째 단계는 컴포넌트 렌더링, 세 번째 단계는 DOM에 커밋이다. 결국 렌더링을 유발하고, 렌더링을 수행한 뒤 DOM에 반영한다고 이해할 수 있다.

또한 공식 문서에서는 이를 식당에서 음식이 고객에게 전달되는 절차에 비유하고 있다. 렌더링 트리거는 손님의 주문을 주방으로 전달하는 과정, 컴포넌트 렌더링은 주방에서 주문을 준비하고 요리하는 과정, 그리고 DOM에 커밋은 테이블에 주문한 요리를 내놓는 과정이다.

![](https://velog.velcdn.com/images/yummjin/post/47245dd4-5d4f-4a11-93b6-3dcfa77ecb7a/image.png)

그럼 각 단계에 대해 자세히 살펴보자.

## 1단계 - 렌더링 트리거

렌더링 트리거란 결국 렌더링을 유발하는 것이다. React에서 렌더링이 트리거되는 이유는 두 가지인데,

첫 번째는 컴포넌트의 **초기 렌더링**,
그리고 두 번째는 컴포넌트의 **state 업데이트** 이다.

### 초기 렌더링

초기 렌더링이란 말 그대로 처음 컴포넌트를 그리는 것을 말한다.
```
import Image from './Image.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Image />);
```
다음과 같이 `document.getElementById`를 통해 DOM 노드를 가져온 뒤 해당 노드와 함께 `createRoot`를 호출하고, 해당 컴포넌트로 `render` 메서드를 호출하고 있음을 볼 수 있다.

### State 업데이트 시 리렌더링

이렇게 초기 렌더링 이후에는 상태 업데이트를 통해 추가적인 렌더링을 트리거할 수 있다. 컴포넌트의 상태를 업데이트하면 자동으로 렌더링 대기열에 추가된다고 한다.

공식 문서에서는 이를 식당에서의 추가 주문에 비유하고 있다.

![](https://velog.velcdn.com/images/yummjin/post/6f569a0d-61fa-4a76-9325-d30f48ed5778/image.png)


## 2단계 - React 컴포넌트 렌더링

위 두 가지 상황을 통해 렌더링이 트리거되면, React는 **컴포넌트를 호출해서 화면에 표시할 내용을 파악**하게 된다. 결국 "렌더링" 은 **React에서 컴포넌트를 호출**하는 것이다.

다만 위 두 가지 상황에서 다른 점은, **초기 렌더링일 경우 루트 컴포넌트**를 호출하고, 이후 렌더링에서는 **렌더링을 트리거한 컴포넌트**를 호출한다는 점이다.

여기서 만약 호출한 컴포넌트가 다른 컴포넌트를 반환한다면(다른 컴포넌트로 구성되어 있다면) React는 다음으로 이 다른 컴포넌트를 렌더링하고, 그 다른 컴포넌트도 또 다른 컴포넌트를 반환하면 그 컴포넌트 또한 다음에 렌더링하는 식으로 동작한다. 컴포넌트 **트리를 타고 내려가듯 더 이상 중첩된 컴포넌트가 없을 때까지 렌더링을 수행**한다.

![](https://velog.velcdn.com/images/yummjin/post/7b6ecbaf-78c5-46ad-a591-6e9264e90eb0/image.png)

이때 다음과 같은 예시 컴포넌트가 있다면
```
// Gallery.js

export default function Gallery() {
  return (
    <section>
      <h1>Inspiring Sculptures</h1>
      <Image />
      <Image />
      <Image />
    </section>
  );
}

function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```

```
//index.js

import Gallery from './Gallery.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Gallery />);

```
초기 렌더링 동안 React는 section, h1, 그리고 img태그에 대한 DOM 노드를 생성하게 된다. 

그리고 만약 상태 변경으로 트리거된 리렌더링이라면, React는 **이전 렌더링 이후 변경된 속성들을 계산만 한다.** 그리고 다음 단계인 커밋 단계 전까지는 아무런 작업도 수행하지 않는다. (이미 초기 렌더링을 통해 DOM 노드들이 생성되어 있는 상태이기 때문이다)

## 3단계 - DOM에 변경사항 커밋

이렇게 2단계에서 컴포넌트를 호출하여 렌더링을 완료한 후에는 DOM을 수정하는(DOM에 커밋하는) 단계를 거치게 된다.

이때 초기 렌더링일 경우 React는 `appendChild()` 라는 DOM API를 사용해 생성한 모든 DOM 노드들을 화면에 표시하고, 리렌더링일 경우 **이전 단계에서 계산한 변경된 속성**만을 적용하여 DOM이 최신 렌더링 출력과 일치하도록 한다.

React는 **렌더링 간에 차이가 있는 경우에만** DOM 노드를 변경한다. 예를 들어 다음과 같이 하나의 컴포넌트 내부에 매초 부모로부터 전달된 다른 props로 다시 렌더링하는 컴포넌트와 다른 컴포넌트가 존재할 때,
![](https://velog.velcdn.com/images/yummjin/post/89472da3-e659-4a8c-8c43-be16d3cf7daa/image.png)

`<input>` 에 입력한 텍스트는 "초의 변경" 으로 인해 리렌더링될 때 변경되지 않고 유지된다. 마찬가지로 텍스트가 변경되더라도 초는 유지된다.

이는 React가 **렌더링 간 차이가 있는 경우, 즉 변경된 상태에 따라 영향을 받은 요소**만 업데이트하기 때문이다.

## 그럼 성능 최적화는?

위에서 2단계(컴포넌트 렌더링) 과정에서, 상태 변경으로 인해 트리거된 렌더링의 경우, 컴포넌트를 실행시켜 화면에 어떤 내용을 표시할지 알아보고 DOM 노드를 생성하는 것이 아니라, **이전 렌더링 이후 변경된 속성을 계산하는 작업을 수행**한다고 언급했다.

이때 성능 최적화는 React가 변경사항을 조금 더 수월하게 계산할 수 있도록 도와주는 것이다. "특정 의존성이 변경되지 않았으니까, 이 친구들은 이전 렌더링과 변경된 것이 없어!" 라고 React에게 알려주어 리액트의 불필요한 연산을 줄이고, 더욱 더 빠르게 변경 사항을 파악해 반영할 수 있도록 도와주는 것이다.

그래서 다음 글에서는 React의 성능 최적화에 대해 자세히 알아보고자 한다!

## 참고

[리액트 공식 문서 - 렌더링과 커밋
](https://ko.react.dev/learn/render-and-commit)

[리액트 공식 문서 - 트리로서의 UI 이해하기](https://ko.react.dev/learn/understanding-your-ui-as-a-tree)
