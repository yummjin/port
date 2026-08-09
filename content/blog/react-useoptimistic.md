---
title: "useOptimistic 톺아보기"
date: "2026-01-12"
description: "useOptimistic에 대해 자세히 알아보자."
tags: ["React"]
---

## 들어가며

`useOptimistic` 은 낙관적으로 UI를 업데이트할 수 있도록 해주는 Hook이다. 

![](https://velog.velcdn.com/images/yummjin/post/6c1fa7d5-1283-42fd-8b77-3dcb89d2b188/image.png)

낙관적인 업데이트라는 것은 어떠한 비동기 요청이 실패할 수도 있는 상황에서 낙관적으로 생각해서 이 요청이 무조건 성공할 것으로 생각하고 업데이트하는 것을 말하는 듯하다. 그럼 한번 살펴보자..

## `useOptimistic` 이란?

`useOptimistic` 은 UI를 낙관적으로 업데이트할 수 있게 해주는 React Hook이라고 공식 문서에 명시되어 있다.

풀어서 설명하자면, 비동기 작업이 완료되기 전까지 기다리지 않고, 작업이 성공했을 때의 결과를 미리 계산해 UI에 보여주는 Hook이다. 이를 통해 사용자는 비동기 작업을 트리거하는 버튼을 눌렀을 때 바로 결과를 확인할 수 있고, 앱은 더 빠르고 반응성이 좋은 것처럼 느껴진다. 이때 **화면에만 반영되는 임시 상태를 낙관적 상태**라고 하며, 실제 서버 응답이 도착했을 때 React가 이 상태를 실제 상태와 맞춰주게 된다.

## 사용 방법

`useOptimistic` 은 두 가지 매개변수를 가진다. 

```javascriptimport { useOptimistic } from 'react';

function AppContainer() {
  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    // updateFn
    (currentState, optimisticValue) => {
      // merge and return new state
      // with optimistic value
    }
  );
}
```

- 첫 번째 매개변수인 `state` 는 작업이 대기 중이지 않을 때 초기에 반환될 값이다.
- 두 번째 매개변수인 `updateFn` 은 현재 상태`currentState` 와 방금 발생한 작업의 상태 입력값`optimisticValue` 를 받아서 해당 작업이 성공했다고 가정했을 때의 상태를 계산해서 반환하는 함수이다.

이 함수는 **낙관적 상태를 어떻게 만들지**에 관한 규칙을 정의하고, React는 작업이 대기 중인 동안 이 `updateFn` 함수를 사용해 화면에 보여줄 상태를 게산한다. 결국 **성공했다고 가정했을 때 상태를 어떻게 바꿀지**를 정의하는 함수이다.

그리고 이런 매개변수를 바탕으로 두 가지 반환값을 가지게 되는데, 약간은 `useState` 와도 닮아있다.

- 첫 번째 반환값인 `optimisticState` 는 낙관적인 상태를 의미한다. 
작업이 대기 중이지 않을 때 (비동기 작업이 수행 중이지 않을 때) 에는 실제 상태인 `state` 와 동일하며, 대기 중 (작업이 수행 중) 일 때에는 `updateFn` 에서 반환된 값인 낙관적 상태와 동일하다.
결국 현재 UI에 보여줄 상태 값이다.

- 두 번째 반환값인 `addOptimistic` 은 낙관적 업데이트를 시작하기 위한 함수이다. 사용자가 어떤 행동을 했을 때 입력값을 전달하면, React는 이 값을 현재 상태와 함께 `updateFn` 에 넘겨 낙관적 상태를 계산하게 된다.

## `useOptimistic` 의 작동 흐름

작동 흐름을 정리해 보면 이렇게 된다.

1) 먼저 기본 상태 `state` 가 존재한다.
2) 사용자가 버튼을 클릭해 `addOptimistic(input)` 을 호출한다.
3) React는 `updateFn(state, input)` 을 실행하고,
4) 그 결과를 `optimisticState` 로 만들어 UI에 반영한다.

## 예제 코드

공식 문서에서 실제로 제공해주는 예제 코드를 중요한 부분만 나누어서 살펴보자.

예제 코드의 목적은 `<form/>` 을 통해 사용자가 보내고자 하는 메시지를 입력받은 후 `action` 을 통해 메시지를 전송하는 것이다. 이때 `useOptimistic` 을 사용해 메시지가 전송되고 있는 동안에도 화면에 업데이트되어 빠른 반응성을 보이는 것처럼 한다.

```jsx
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
```
먼저 살펴볼 쪽은 form에서 메시지들을 표시하고 있는 쪽이다. 여기서 메시지를 표시할 때 `optimisticMessages` , 즉 낙관적 상태를 바탕으로 메시지를 표시하고 있음을 알 수 있다.

```jsx
 const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      {
        text: newMessage,
        sending: true
      },
      ...state,
    ]
  );
```
`optimisticMessages` 는 이 `useOptimistic` 훅의 반환값이다. 첫 번째 인자인 `messages` 는 기존 상태이고, 두 번째 인자는 `state` 와 `newMessage` 를 받아서 낙관적 상태를 반환하도록 정의한 `updateFn` 임을 확인할 수 있다.

```jsx
  function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    formRef.current.reset();
    startTransition(async () => {
      await sendMessageAction(formData);
    });
  }
```

사용자가 form에 메시지를 입력한 후 submit하면 위와 같은 `formAction` 이 실행되게 된다.

이때 `addOptimisticMessage` 를 통해 낙관적 업데이트를 한 뒤 `sendMessageAction` 을 통해 비동기 통신 작업을 수행하고 있음을 확인할 수 있다.

## 마무리하며

생각보다 간단하다. `useState` 에서 `updateFn` 직접 구현이 조금 첨가된 느낌? 사용 방법도 쉬워서 바로 댓글 좋아요 부분에 도입하며 리팩토링 해야겠다는 생각이 들었다.

마지막 부분에 나온 `transition` 관련 부분은 다음 글에서 자세히 알아봐야겟다!

## 참고

[React 공식 문서_ useOptimistic](https://ko.react.dev/reference/react/useOptimistic)
