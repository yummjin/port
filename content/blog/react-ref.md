---
title: "ref 톺아보기"
date: "2026-01-09"
description: "ref에 대해 자세히 알아보자."
tags: ["React"]
---

## 들어가며

프로젝트를 하다 보면 Ref를 종종 사용하게 된다. 
그리고 다양한 라이브러리들의 구현을 살펴보면 Ref를 사용하는 경우가 많이 보인다. 
나는 이 Ref를 여러 번 접했지만 아직 잘 알고 있지 않은 것 같다. 
모호하게만 알고 제대로 알고 사용하고 있다는 느낌이 들지 않았다. 
오늘 한번 각 잡고 제대로 살펴보자!

## `Ref`는 왜 필요할까?

Ref가 왜 필요한지 알아보기 위해서는 먼저 React의 기본 철학부터 다시 짚어야 한다.

### React의 기본 철학, 상태

React는 기본적으로
- 선언적 UI
  ```jsx
  <SearchInput value={value} onChange={...} />
  ```
 선언적 UI는 선언적 프로그래밍과도 관련이 있는데, 요소를 어떻게 렌더링할지가 아닌 무엇을 보여줄지에 집중하는 방식을 가지고 있다.
 위 코드에서 `SearchInput` 은 `value` 의 상태를 보여준다는 의미를 선언하고 있으며, DOM을 직접 건드리는 등의 명령적인 행위는 하고 있지 않다.

- 단방향 데이터 흐름
  ```plain text
    state -> render -> UI
  ```
  상태가 변하면 렌더링을 수행하고 UI가 변화(DOM을 갱신)한다. 결국 개발자는 상태만 관리하는 것이다.

이 두 가지를 추구하는 라이브러리이다. 즉 React는 **상태를 통해서만 UI를 변경**하고 싶어하며, UI를 **상태의 함수**로 만들고 싶어한다는 것이다.

상태-UI 관계를 유지해야만이 UI가 예측 가능하고 테스트도 가능하다고 한다.. 그래서 React는 DOM을 직접 수정하는 행위를 기본 경로에서는 **전부 차단**하고 있다.

### 상태로 제어 불가능한 UI

하지만 모든 UI의 동작이 상태로 표현 가능한 것은 아니다.

이른바 상태로 표현 불가능한 UI 동작 중 대표적인 예시는 DOM API인데, `focus()` `scrollTo()` `play()` 같은 것들이다.

React에서 **상태는 UI의 모양을 결정하는 데이터**로, 상태가 변경되면 UI가 다시 계산(렌더링)되어 그 결과가 DOM에 반영된다. 하지만 상태로 표현 불가능한 UI 동작, 즉 행위는 UI를 변경하지 않고 **이미 존재하는 DOM에 물리적 동작을 시키는 것**이다. 쉽게 말해 UI의 모양이 아니라 이미 존재하는 DOM에 무언가를 하라고 시키는 명령이다.

이러한 동작들을 상태로 표현하면 아까 언급했던 React의 기본 철학과 맞지 않는, **UI 모양과는 무관하게 플래그의 역할만 하는 상태 코드**가 만들어지게 된다.

```javascript
const [shouldFocus, setShouldFocus] = useState(false);

useEffect(() => {
  if (shouldFocus) inputRef.current.focus();
}, [shouldFocus]);
```
이렇게 "상태" 의 의미가 UI의 모양을 결정하는 데이터에서 **명령을 트리거하는 요소**로 퇴색된다.

### `ref` 를 통해 DOM에 접근하자

그래서 ref가 필요해진다. **ref는 React가 관리하는 DOM에 접근할 수 있는 유일하게 허용된 포인터**이며, 선언적인 React 세계에서 명령형 세계로 내려가기 위한 통제된 인터페이스라고 할 수 있다.

UI는 상태와 렌더링을 통해 선언적으로 관리하고,
선언적으로 표현할 수 없는 동작만을 ref를 통해 명시적으로 분리하며 예측 가능성과 현실성을 유지한다.

정리하면 React의 구조는 다음과 같이 분리된다.
- 상태(state): UI의 모양과 구조를 결정하는 선언적 데이터
- ref: 이미 존재하는 DOM에 명령형 동작을 수행하기 위한 통로

이 분리를 통해 React는 "UI는 선언적으로 관리한다" 는 원칙을 유지하면서도, 브라우저라는 본질적으로 명령형인 환경과 안전하게 상호작용할 수 있게 되는 것이다.

## `ref`의 기본 개념

그럼 이제 React에서 ref를 어떻게 다루는지 알아보자.

### `ref` 란?

> ref는 렌더링 결과물에 대한 **참조를 보관하는 객체**이다.

여기서 렌더링 결과물이란 React가 생성한 DOM 노드, 컴포넌트, 또는 임의의 데이터 값이 될 수도 있다.

### `ref` 생성하기

`useRef` 훅을 통해 `ref` 를 생성할 수 있다.
```javascript
import { useRef } from 'react';

const ref = useRef(0);
```
위와 같이 작성했을 때, `useRef`는 인자로 받은 초깃값을 `current` 속성으로 가지는 객체를 반환한다.

따라서 `ref` 변수에 할당된 것은 `current` 속성에 초깃값을 가지는 객체이다.
```javascript
{
  current: 0
}
```
### `ref` 접근하기

`ref` 는 위에서 언급한 바와 같이 `current` 속성을 가지고 있다. `current` 값은 읽거나 쓰는 것이 모두 가능하다.

```jsx
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```
위 예제에서는 버튼의 `onClick` 핸들러 함수에서 `ref.current` 값을 조작하고 있다.

### `ref` 와 `state` 의 차이

React 공식 문서에서는`ref` 와 `state` 의 차이점을 이렇게 정리하고 있다.

| 기준         | ref                                           | state                                    |
|------------|-----------------------------------------------|------------------------------------------|
| 생성        | `useRef(initial) → { current: initial }`      | `useState(initial) → [value, setValue]`  |
| 재렌더링     | 값 변경해도 리렌더 트리거 X                    | 값 변경하면 리렌더 트리거 O               |
| 변경 가능성   | mutable — 렌더 중이 아니어도 변경 가능          | immutable — `setState`로만 변경           |
| 렌더링 중 접근 | 권장 X                                        | 언제든지 읽기 가능                         |

주목할 만한 부분은 `ref` 는 리렌더링을 유발하지 않는다는 점과 렌더링 중이 아니더라도 변경 가능하다는 점이다. 확실히 `state` 와는 용도부터가 다르기에 이런 차이점들이 존재한다.

### 사용 예시

React 공식 문서 아래에 있는 챌린지 코드이다.
```jsx
import { useState } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  let timeoutID = null;

  function handleSend() {
    setIsSending(true);
    timeoutID = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutID);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Undo
        </button>
      }
    </>
  );
}

```
`input` 에 텍스트를 입력한 뒤 Send 버튼을 누르면 3초 동안 버튼의 텍스트가 Undo로 바뀐다. 이때 Undo 버튼을 누르면 `handleSend` 에 있는 `setTimeout` 이 초기화되고 버튼의 텍스트가 다시 Send로 돌아오게끔 하는 것이 의도이다.

하지만 위 코드는 정상적으로 작동하지 않는데, 그 이유는 **버튼을 눌렀을 때의 state 변경으로 인해 리렌더링이 발생하며 지역 변수인 `timeoutID` 가 매 렌더마다 초기화되기** 때문이다.

이렇게 UI의 렌더 결과와는 무관하지만 렌더 사이에 유지되어야 하는 값을 관리할 때 `ref` 를 사용하는 것이다. `useRef` 로 생성한 객체는 렌더링 사이에서도 동일한 객체를 유지하며, `current` 프로퍼티를 통해 값을 자유롭게 변경할 수 있지만 리렌더링을 유발하지는 않는다.
```jsx
const timeoutRef = useRef(null);

function handleSend() {
    setIsSending(true);
    timeoutRef.current = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  }

function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutRef.current);
  }
```
그래서 이렇게 `useRef` 를 사용해 저장해야 한다. `handleSend` 에서 설정한 `setTimeout` 의 타이머 ID가 다음 렌더에서도 유지되고 `handleUndo` 에서 동일한 ID를 참조해 정확하게 `clearTimeout` 을 호출하게 됨으로써 의도한 대로 동작하게 된다.

## `ref` 의 두 가지 타입

`ref` 는 Object Ref와 Callback Ref로 나뉜다.


| 구분                 | Object Ref                           | Callback Ref                  |
|--------------------|--------------------------------------|------------------------------|
| 형태                 | `{ current: ... }` 객체               | `(node) => void` 함수         |
| 생성 방법             | `useRef()`                           | 인라인 함수                   |
| 값 접근              | `ref.current`                        | 함수 인자로 전달              |
| 마운트/언마운트 시점 감지 | ❌                                   | ✅                            |
| 일반적인 용도          | DOM 접근, imperative handle          | 생명주기 훅처럼 사용           |

대부분의 경우 `useRef` 를 통해 생성하는 Object Ref 를 사용하는데, DOM의 생성 및 제거 시점에 로직이 필요하다면 생명주기 훅처럼 사용하는 Callback Ref도 사용할 수 있다고 한다.

### Callback Ref 예제

Object Ref는 사용되는 것을 많이 봐왔고 지금 이 글 안에서도 사용하고 있기에 예제 코드는 생략한다. 다소 생소한 Callback Ref에 대한 예제 코드를 가져와봤다.
```jsx
import { useState } from "react";

export default function BoxWithMeasuredHeight() {
  const [height, setHeight] = useState<number | null>(null);

  return (
    <div>
      <div
        ref={(node) => {
          if (node) {
            const { height } = node.getBoundingClientRect();
            setHeight(height);
          }
        }}
        style={{
          padding: 24,
          background: "#f3f4f6",
          borderRadius: 8,
          fontSize: 18,
        }}
      >
        이 박스의 실제 높이를 측정합니다.
      </div>

      <p style={{ marginTop: 12 }}>
        측정된 높이: {height ? `${Math.round(height)}px` : "측정 중..."}
      </p>
    </div>
  );
}
```
`BoxWithMeasuredHeight` 는 DOM요소의 높이를 측정하고 렌더링하는 컴포넌트인데, `ref` 를 통해 DOM이 마운트되는 순간 호출되는 함수를 전달하여 렌더링 이후에만 가능한 높이 측정 작업을 수행하는 모습이다.

### Callback Ref와 `useEffect` 의 차이점

그런데 `useEffect` 로도 같은 작업을 수행할 수 있지 않을까? 하는 생각이 든다. 실제로 `useEffect` 를 사용하면 렌더 이후에 DOM에 접근할 수 있으니, 높이를 측정하는 작업 자체는 충분히 Object Ref + `useEffect` 로도 구현 가능하다.

```javascript
const ref = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (!ref.current) return;
  const { height } = ref.current.getBoundingClientRect();
  setHeight(height);
}, []);
```
이런 형태가 될 것이다.. 겉보기에는 거의 같은 일을 하는 것처럼 보인다. 둘 다 렌더 이후 DOM에 접근하고 있기 때문이다.

하지만 이 둘은 실행 타이밍과 의도 자체가 다른데, Callback Ref는 노드가 할당되는 순간 바로 호출된다. DOM이 생성되고 `ref` 가 연결되는 그 시점에 바로 실행되는 것이다. 하지만 이에 반해 `useEffect` 는 렌더가 끝난 다음.. 이른바 사후 처리 단계에서 실행된다.

그리고 관심사 자체가 다른 부분이라고 할 수 있다. Callback Ref는 DOM 노드 그 자체에, `useEffect` 는 상태와 props 그리고 자체 의존성 등에 의존한다.

그렇기 때문에 `useEffect` 를 사용하면 DOM이 실제로 바뀌지 않았는데도 상태 변화로 인해 `useEffect` 가 다시 실행되어 불필요한 DOM 측정이 반복될 수도 있다.

따라서 DOM 노드 그 자체에 집중하고자 하는 위 예제와 같은 상황이 발생한다면 Callback Ref를 사용하는 것이! 더 React스럽고.. 설계에도 부합하는 것 같다.



## `React.forwardRef`

결론부터 말하자면 `forwardRef` 는 이제 deprecated 된다고 한다. 이 친구가 궁금해서 시작한 포스팅이었으므로 알아보고 지나가보자. 그리고 이 친구가 어떤 방식으로 대체되었는지도!

### `forwardRef` 는 왜 필요했을까?

과거 버전에서 React의 함수형 컴포넌트는 `ref` 를 전달받지 못했다.

`ref` 는 원래 React의 클래스 컴포넌트의 인스턴스를 참조하기 위한 용도였기 때문이다. 함수형 컴포넌트는 자체 인스턴스가 없었기 때문에 ref를 받을 수 없었다.

#### 클래스 컴포넌트의 인스턴스는 뭔데?

클래스 컴포넌트는 JavaScript의 Class로 이루어져 있었으며 렌더링할 때 React는 내부적으로 이 클래스의 인스턴스를 만들었다.

```javascript
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  increment() {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return <div>{this.state.count}</div>;
  }
}
```
가령 이런 컴포넌트가 있다면 렌더링 시에 
``` javascript
const instance = new MyComponent(props);
```
이렇게 내부적으로 인스턴스가 만들어진다.
그리고 이런 인스턴스 객체 안에는
```javascript
{
  props: { ... },          // 전달받은 props
  state: { count: 0 },     // 내부 상태
  setState: f(),           // 상태 변경 메서드
  increment: f(),          // 사용자가 정의한 메서드
  render: f(),             // 렌더 함수
  __reactInternalFiber: …  // React 내부용 필드
}
  ```
  이런 속성값들이 들어 있었다. `state`, 그리고 사용자가 정의한 메서드 등등.. 
  
  그래서 기존의 `ref` 는 이런 인스턴스 객체 자체에 접근해서 `ref.current.increment` 와 같이 인스턴스의 메서드를 직접 호출하는 용도로 쓰였다.
  ```jsx
const instance = new MyComponent(props);
const ref = React.createRef();
<MyComponent ref={ref} />;
ref.current === instance; // true
```

#### 함수형 컴포넌트에 `ref`를 주입하자

그럼 이제 다시 돌아와보자.

함수형 컴포넌트는 인스턴스를 생성하는 것이 아니라 그냥 함수를 호출함으로써 동작한다. 가령 이전 클래스 컴포넌트의 내부 동작이 개념적으로
```javascript
const instance = new MyComponent(props);
```
였다면 함수형 컴포넌트는
```javascript
const result = MyComponent(props)
```
처럼 호출되어 JSX를 반환하는 구조이다. 즉 함수형 컴포넌트에는 유지되는 객체 인스턴스가 존재하지 않는다. 따라서 ref가 가리킬 수 있는 “컴포넌트 자체”라는 대상이 존재하지 않으며, 이 때문에 과거에는 함수형 컴포넌트가 ref를 직접 전달받을 수 없었다.

따라서 만들어진 것이 **`forwardRef`**이다.

### `forwardRef` 란?

함수형 컴포넌트에서, 인스턴스 대신 내부의 특정 대상에 대한 참조를 부모 컴포넌트에게 의도적으로 노출하기 위해 사용하는 API이다.

`Form` 이라는 부모 컴포넌트 내부에 들어가는 자식 컴포넌트 `MyInput` 을 구현하는 예시 코드이다. 이때 `forwardRef` 를 사용해서 부모로부터 전달받은 `ref` 를 내부 DOM 요소인 `input` 에 연결하고 있다.
```jsx
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});
```
그럼 부모 컴포넌트에서는
```jsx
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```
`MyInput` 컴포넌트에 `ref` 를 전달할 수 있고, 이 `ref.current` 는 의도한 대로 `MyInput` 내부의 `input` DOM 을 가리키게 된다. 이렇게 부모 컴포넌트는 이 `ref` 를 통해 `<input>` 에 직접 접근하여 `focus()` 와 같은 명령형 동작을 수행할 수 있다.

이 구조에서 중요한 점은 부모가 `MyInput` 컴포넌트가 `forwardRef` API를 사용해 **의도적으로 노출한 DOM 노드**만을 참조한다는 점이다. **컴포넌트 전체의 내부 구현을 열어두는 것이 아니라, 외부와 상호작용해도 되는 최소한의 인터페이스만 열어두는 방식**이다.

### 주의할 점

다만 예제 코드를 훝어보면서도 느꼈지만, 이렇게 내부 DOM 노드를 외부에 노출하게 되면 컴포넌트의 캡슐화가 약해지고 내부 구현 변경이 어려워진다는 단점이 있다. 

나중에 `<input>` 의 구조가 바뀌거나 래핑 구조를 수정하고 싶을 때, 이를 참조하고 있는 부모 컴포넌트들이 함께 영향을 받게 된다.

따라서 **정말 필요한 경우에만 제한적으로 사용하는 것**이 바람직하다고 한다..

### `fowardRef` 의 대체

![](https://velog.velcdn.com/images/yummjin/post/961e5452-4563-46f7-bdb2-1680fccdef77/image.png)

React 팀은 이렇게 `forwardRef` 를 통해 `ref` 를 전달하는 구조가 불필요한 보일러플레이트 코드를 만든다고 판단한 듯하다. 따라서 React 19 버전부터는 함수형 컴포넌트도 `ref` prop 을 직접 받을 수 있도록 변경했다.

이제는..
```jsx
function MyButton({ ref, ...props }) {
  return <button ref={ref} {...props} />;
}
```
이렇게 `props` 로 받아서 간단하게 넘겨줄 수 있다!

#### 관련 타입

그럼 타입 정의는 어떻게 해야 하는지 덩달아 궁금해진다!
```typescript
type MyInputProps = {
  ref?: React.Ref<HTMLInputElement>;
} & React.ComponentPropsWithoutRef<'input'>;
```
직접 명시적으로 정의해줄 때에는 이렇게 React에서 제공하는 `Ref` 에 제네릭으로 요소의 타입을 넘겨준 뒤 `ComponentPropsWithoutRef` 타입을 사용한다.

추가로 `ComponentProps` 와 `ComponentPropsWithoutRef` 는 제네릭으로 전달한 타입의 JSX intrinsic element가 받을 수 있는 모든 props 타입 / 그리고 거기서 `Ref` 만 제외한 타입이다~

## `useImperativeHandle` 알아보기

![](https://velog.velcdn.com/images/yummjin/post/4584b251-fc38-41df-ae21-0b830ee524e6/image.png)

피할 수 없는 handle이라..

### `useImperativeHandle` 이란?

`ref` 로 노출되는 handle을 개발자가 직접 커스텀할 수 있도록 해주는 React Hook이다.

즉 부모가 `ref` 를 통해 접근할 수 있는 값 또는 메서드를 개발자가 정의할 수 있도록 해주는 것인데..

어차피 `ref` 을 props로 받으면 개발자가 알아서 노출하고 싶은 DOM 노드에 넣어주지 않나? 라고 생각이 들 것이다. (나는 그렇게 생각이 들엇다)

### `useImperativeHandle` 예제

사용 방법, 언제 쓰는지까지 한번에 살펴보자.
```jsx
import { useRef, useImperativeHandle } from 'react';

function MyInput({ ref }) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input ref={inputRef} />;
};
```
이렇게 사용했을 경우 `MyInput` 컴포넌트가 부모로부터 전달받은 `ref` 는 `<input/>` 에 대한 모든 ref가 아니라 `useImperativeHandle` 을 통해 반환한 내부의 메서드에만 접근할 수 있게 된다.
```jsx
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput placeholder="Enter your name" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```
![](https://velog.velcdn.com/images/yummjin/post/aca71159-c91a-4b3d-952d-038fe6d90c4a/image.png)
따라서 `focus` 메서드는 잘 작동하지만, `style` 조작은 작동하지 않는다.

```jsx
  useImperativeHandle(ref, () => {
    return {
      scrollAndFocusAddComment() {
        commentsRef.current.scrollToBottom();
        addCommentRef.current.focus();
      }
    };
  }, []);
``` 
이렇게 사용자 정의 메서드를 노출시킬 수도 있다.

그래서 결론적으로 아까 위에 스스로 던졌던 질문에 답하자면,
>어차피 `ref` 을 props로 받으면 개발자가 알아서 노출하고 싶은 DOM 노드에 넣어주지 않나? 라고 생각이 들 것이다.
>-> `useImperativeHandle` 을 사용하면 DOM 전체 API를 노출하지 않음으로써 캡슐화를 유지할 수 있다! 

이제 뭔가 무서워 보이는 `useImperativeHandle` 을 발견하면 겁먹지 말자.

## 마무리하며

`ref` 가 이런 개념이었구나를 확실하게 알게 된 것 같다. 모르고 쓰는 것보단 확실히 알고 쓰는 것이 좋고.. 특히 Callback Ref는 처음이다. 작성하면서 Callback Ref를 쓰는 것이 더 적절했겠구나 하는 코드들이 몇 줄 스쳐 지나갔다.. 앞으로 보이면 리팩토링도 해주고 구현할 일이 있다면 적극 사용하며 React 팀의 설계 철학에 알맞게 제대로 React를 사용하는 개발자가 되어주겠다~

## 참고

[React 공식 문서_ Ref로 값 참조하기](https://ko.react.dev/learn/referencing-values-with-refs)
[React 공식 문서_ Ref로 DOM 조작하기](https://ko.react.dev/learn/manipulating-the-dom-with-refs)
[React 공식 문서_ useImperativeHandle](https://ko.react.dev/reference/react/useImperativeHandle)
[yeony.dev_ [DIP] ref as a prop](https://yeony.dev/blog/2025-04-13-DIP-ref-as-a-prop)
