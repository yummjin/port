---
title: "memo, useMemo, useCallback 을 통해 성능 최적화하기"
date: "2025-11-08"
description: "memo, useMemo, useCallback으로 리렌더링 비용을 줄여보자."
tags: ["React"]
---

## 들어가며

[이전 글](https://velog.io/@yummjin/%EB%A6%AC%EC%95%A1%ED%8A%B8-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8%EA%B0%80-%EB%A0%8C%EB%8D%94%EB%A7%81%EB%90%98%EB%8A%94-%EA%B3%BC%EC%A0%95)을 통해 렌더링 시 React가 어떻게 동작하는지 살펴봤다. 

이때 상태 변경으로 트리거된 리렌더링 시 React는 리렌더링 시 이전 렌더링과 상태 변경 이후 렌더링의 차이점을 계산한다는 것을 알 수 있었다.

따라서 성능 최적화가 필요한 이유는, React가 리렌더링 시에 **상태 변경에 영향을 받지 않는 부분임에도 불구하고 불필요하게 차이점을 계산**하기 때문이다. 

이번 글에서는 공식 문서를 참고하여 `memo`, `useMemo`, 그리고 `useCallback` 을 통해 어떻게 성능을 최적화할 수 있는지 알아본다.

## memo

`memo` 는 컴포넌트의 `props` 가 변경되지 않았을 경우 리렌더링을 건너뛰도록 해 주는 함수이다.


`memo(Component, arePropsEqual?)`

### 매개변수

`memo` 는 두 가지 매개변수로 이루어져 있다.

1. 첫 번째 매개변수는 메모이제이션 하고자 하는 컴포넌트이다.
2. 두 번째 매개변수는 optional하게 넘겨줄 수 있는 `arePropsEqual` 이다. 이 매개변수는 컴포넌트의 이전 props와 새로운 props를 받는 함수이다. 이전 props를 토대로 렌더링한 결과와 새로운 props를 토대로 렌더링한 결과가 동일할 경우 `true` 를 반환하게 된다. 다만 보통 이 함수를 지정하지 않는 경우가 많다! ~~사용하며 한 번도 지정한 경우가 없는 것 같다.. 요거 작성하면서 처음 알았다~~

### 반환값

이런 `memo` 의 반환값은 새로운 React 컴포넌트이다. 첫 번째 매개변수로 제공한 컴포넌트와 동일하게 동작하지만, 부모가 리렌더링되더라도 props가 변경되지 않으면 이 컴포넌트는 리렌더링되지 않는다.

### 사용법

props가 이전과 동일할 때 리렌더링을 방지하기 위해서는, 다음과 같이 컴포넌트를 `memo` 로 감싸고 반환된 값을 사용하면 된다.

```
const Greeting = memo(function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
});

export default Greeting;
```

이제 다음과 같은 컴포넌트에서, `Greeting` 컴포넌트의 props인 `name` 이 변경되지 않을 때 `Greeting` 컴포넌트는 리렌더링 되지 않는다.

```
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

다만, 컴포넌트가 `memo` 를 통해 메모이제이션 되었더라도 **그 컴포넌트 내부의 상태(컴포넌트 자체의 상태)**가 변경되면 리렌더링될 수 있다. 결국 메모이제이션은 **부모에서 컴포넌트로 전달되는 props에만 적용**된다.

```
const Greeting = memo(function Greeting({ name }) {
  console.log('Greeting was rendered at', new Date().toLocaleTimeString());
  const [greeting, setGreeting] = useState('Hello');
  return (
    <>
      <h3>{greeting}{name && ', '}{name}!</h3>
      <GreetingSelector value={greeting} onChange={setGreeting} />
    </>
  );
});
```

위의 새로운 `Greeting` 컴포넌트에서는 컴포넌트 내부의 상태인 `greeting` 이 변경될 때마다 컴포넌트가 리렌더링된다.

또한 마찬가지로 사용 중인 `context` 가 변경될 때에도 컴포넌트는 리렌더링된다.

### 최대한 활용하기

`memo` 를 최대한 활용해서 최적화하기 위해서는, props가 변경되는 횟수를 최소화해야 한다. 결국 props의 변경사항을 바탕으로 리렌더링 여부를 결정하기 때문이다.

이때 `memo`는 [Object.is](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/is)의 [얕은 비교](https://velog.io/@neighborkim/%EC%96%95%EC%9D%80-%EB%B9%84%EA%B5%90Shallow-Compare-%EC%99%80-%EA%B9%8A%EC%9D%80-%EB%B9%84%EA%B5%90Deep-Compare)를 사용해서 props를 비교한다. 따라서 **배열이나 객체, 함수와 같은 props는 렌더링마다 새로 만들어져 얕은 비교로 인해 propsEqual이 false가 되고, 리렌더링**된다. 따라서 `useMemo`, `useCallback` 의 사용을 통해 객체나 배열이 다시 만들어지는 것을 방지해야 한다. 아니면 객체 형식의 props일 경우에는 객체를 넘겨주는 대신 값을 넘겨주어 자식 컴포넌트에서 객체로 만들어 사용하는 방법도 있다.

### arePropsEqual 직접 정의해서 사용하기

`useMemo` 와 `useCallback` 을 살펴보기 전에, 아까 언급했던 `arePropsEqual` 함수를 직접 정의해서 직접 객체형 props의 값을 비교하도록 설정하는 방법에 대해서도 살펴보자.

```
const Chart = memo(function Chart({ dataPoints }) {
  // ...
}, arePropsEqual);

function arePropsEqual(oldProps, newProps) {
  return (
    oldProps.dataPoints.length === newProps.dataPoints.length &&
    oldProps.dataPoints.every((oldPoint, index) => {
      const newPoint = newProps.dataPoints[index];
      return oldPoint.x === newPoint.x && oldPoint.y === newPoint.y;
    })
  );
}
```

위는 공식 문서에서 제공하는 예시 코드이다. 이렇게 이전 props와 새로운 props를 인자로 받아 이들의 값을 직접 비교해 결과를 반환하는 함수를 만들어 두 번째 매개변수로 넘겨줄 수 있다.

## useMemo

이제 `useMemo` 에 대해 살펴보자. `useMemo` 는 리렌더링 사이 계산 결과를 캐싱할 수 있도록 도와주는 Hook이다.

`useMemo(calculateValue, dependencies)`

```
import { useMemo } from 'react';

function TodoList({ todos, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  // ...
}
```

### 매개변수

`useMemo` 도 두 가지 매개변수를 받는다.

1. 첫 번째 매개변수는 `calculateValue` 라는 함수이다. 이 함수는 캐싱하고자 하는 값을 계산하는 함수이다. **인자를 받지 않는** 함수여야 한다. **React는 초기 렌더링 중에 이 함수를 호출해 값을 확인한다.** 이후 React는 마지막 렌더링 이후 `dependencies` (두 번째 매개변수이자 의존성) 가 변경되지 않았다면 동일한 값을 다시 반환하게 된다. 만약 의존성이 변경되었다면 다시 이 함수를 호출해 결과를 확인하고, 다시 캐싱한다.
2. 두 번째 매개변수는 `dependencies`, 말 그대로 의존성이다. `calculateValue` 함수에서 참조된 모든 "반응형 값" 들의 목록인데, 이 반응형 값에는 props, state 그리고 컴포넌트 내부에서 직접 선언된 모든 변수와 함수가 포함될 수 있다. `[dep1, dep2]` 와 같이 배열 형태로 작성되어야 한다. 그리고 `memo` 때와 마찬가지로 Object.is의 얕은 비교를 통해 의존성들을 이전 값과 비교한다.

### 반환값

위에서 언급한 것처럼, 초기 렌더링에서는 `calculateValue` 를 **호출한 결과**를 반환한다.

그리고 다음 렌더링에서는, 의존성의 변경 여부에 따라 마지막 렌더링에서 저장된 값을 반환하거나 `calculateValue`를 다시 **호출하고 반환한 뒤** 값을 저장한다.

> 여기서 호출한 결과에 강조 처리한 이유는 이 부분이 `useCallback` 과의 차이점이기 때문이다!! 중요중요

### 사용법 - 불필요한 재계산 및 리렌더링 방지하기

문서에서 설명하는 유용한 예시를 통해 살펴보자. 
아래와 같은 컴포넌트에서, 
```
function TodoList({ todos, tab, theme }) {
  const visibleTodos = filterTodos(todos, tab);
  // ...
}
```
`TodoList` 컴포넌트 내부 상태가 업데이트되거나 부모로부터 새로운 props를 받게 되면 `filterTodos` 함수가 다시 실행되게 된다.

하지만 `filterTodos` 의 동작에 영향을 끼치지 않는 다른 상태나 props(위 코드에서는 아마 `theme` 이 될 수 있을 것 같다) 가 변경되었을 때에도 함수가 다시 실행되는 것은 비효율적이다. 

```
import { useMemo } from 'react';

function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```
따라서 이렇게 `useMemo` 를 사용해 불필요한 재계산을 방지할 수 있다.

이렇게 `useMemo` 를 통해 값의 재계산을 방지할 수 있기 때문에, props의 변경이 없으면 리렌더링을 건너뛰는 `memo` 함수와 함께 쓰일 때 좋은 효과를 보여준다.

`List` 라는 컴포넌트가 있다고 할 때, 아래와 같이 
```
import { memo } from 'react';

const List = memo(function List({ items }) {
  // ...
});
```
`memo` 로 감싸주고, 배열 형태로 전달되는 props를 `useMemo` 로 감싸주면 된다.

```
export default function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]);
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

### 사용법 - Effect의 과도한 실행 방지하기

여기서 말하는 Effect란 우리가 익히 알고 있는 `useEffect` 를 통해 실행하는, 컴포넌트 마운트 후에 실행되는 동작들을 의미한다.

`useEffect` 또한 의존성을 두 번째 인자에 넘겨줄 수 있다. React는 항상 얕은 비교를 수행하기 때문에, 이 의존성이 만약 배열이나 객체라면 같은 값을 가지더라도 React가 동일하지 않다고 판단해 다시 실행될 수 있다.

```
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: 'https://localhost:1234',
    roomId: roomId
  }

 useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);
```
위 코드가 정확히 그런 상황이다. `message` 와 같은 Effect와 관계 없는 상태 변경으로 인해 리렌더링 될 때 option 객체도 새로 생성되어 Effect 내부 로직이 불필요하게 계속 실행된다.

이런 상황에서 의존성에 `useMemo` 를 사용하면 된다.

```
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = useMemo(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]);

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);
  // ...
```

다만 공식 문서에서는 React가 특정한 상황에서 캐시된 값을 버리는 상황이 발생할 수 있으므로, 아예 Effect 로직 내부에서 객체를 생성하는 등의 작업을 수행하고, 의존성으로는 얕은 비교를 통해 원활하게 비교할 수 있는 값(배열, 객체, 함수가 아닌 값들)을 넣는 것을 권장하고 있다.

```
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = { 
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    }

    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  // ...
```
이렇게 Effect의 종속성에 `useMemo` 를 적용한 것처럼, 다른 hook의 종속성에도 이를 동일하게 적용할 수 있다. 공식 문서에는 이에 대해서도 자세히 다루고 있지만 동일한 맥락의 내용이라 생각되어 요 부분은 [링크](https://ko-react-exy5xcwjj-fbopensource.vercel.app/reference/react/useMemo#memoizing-a-dependency-of-another-hook)로 대신한다.

### useMemo로는 JSX 노드를 메모이제이션 할 수 없을까?

![](https://velog.velcdn.com/images/yummjin/post/cc4b21fa-7310-4a7b-8539-16625050ccdd/image.png)

메모이제이션 가능하다!

```
export default function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  const children = useMemo(() => <List items={visibleTodos} />, [visibleTodos]);
  return (
    <div className={theme}>
      {children}
    </div>
  );
}
```

하지만 `useMemo` 는 Hook 이기 때문에 보통 `memo` 를 사용한다고 한다.

### 사용법 - 함수 메모이제이션하기

뒤에서 살펴볼 `useCallback` 이 함수를 메모이제이션하기 위한 hook이다. 그런데 `useMemo` 를 통해서도 함수를 메모이제이션할 수 있다. 방식은 같다.

```
  const handleSubmit = useMemo(() => {
    return (orderDetails) => {
      post('/product/' + productId + '/buy', {
        referrer,
        orderDetails
      });
    };
  }, [productId, referrer]);
  ```
  
  동일한 함수를 `useCallback` 을 사용해 메모이제이션하면 다음과 같다.
  
  ```
   const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }, [productId, referrer]);
  ```
  상당히 비슷하지만 `useMemo` 는 `Calculator` (첫 번째 매개변수) 함수에 인자를 허용하지 않아 중첩 함수를 작성해야 한다. 따라서 함수를 메모이제이션 할 때에는 `useCallback` 을 사용하는 것이 더 유리하다 할 수 있다.
  
  ## useCallback
  
  이제 마지막으로 `useCallback` 을 살펴보자. 위에서 살짝 맛봤듯이 함수를 메모이제이션하는 hook이 `useCallback` 이다.
  
  `const cachedFn = useCallback(fn, dependencies)`
  
### 매개변수
  
  1. 첫 번째 매개변수는 역시 메모이제이션을 하고자 하는 함수 `fn` 이다. **`useMemo` 와의 차이점은 이 첫 번째 매개변수를 실행하지 않고 그대로 저장 또는 반환한다는 것이다. (`useMemo` 의 경우 실행한 값을 저장하기 때문에 인자가 필요하지 않은 함수를 첫 번째 매개변수로 받는 것이며 함수를 메모이제이션 하고자 할 때 함수를 반환하는 중첩 함수를 작성해야 하는 것이다!!)**
  2. 두 번째 매개변수는 역시나 의존성이다. 이 또한 배열 형식으로 `[dep1, dep2]` 와 같이 작성되며 React는 얕은 비교를 통해 의존성을 비교하게 된다.
  
### 반환값
  
  `dependencies` 의 비교 결과를 바탕으로 `fn` 함수를 그대로 반환하거나 변경된 `fn` 함수를 반환한다.

### 사용법

이제는 익숙하다. 의존성으로 넘겨지는 함수의 재생성을 막기 위해 `useCallback` 을 사용하겠지..

![](https://velog.velcdn.com/images/yummjin/post/a048c5e7-2e22-45ac-82a5-b3bc272d8e96/image.png)

```
function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

정답이다. `theme` 이라는 무관한 props가 변경되더라도 `handleSubmit` 함수는 변하지 않으므로 `ShippingForm` 의 리렌더링은 일어나지 않을 것이다. Effect의 의존성, hook의 의존성 모두 동일한 맥락이다.

### 최대한 활용하기

메모이제이션 된 함수는 **가능한 한 적은 의존성을 가지는 것**이 좋다고 한다.

```
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos([...todos, newTodo]);
  }, [todos]);
  // ...
  ```
이 함수는 항상 같은 todo 추가라는 동작을 수행하는 함수이다. 하지만 현재는 state를 함수 내부에서 직접 조작하고 있기 때문에, `todos` 가 변경될 때마다 함수가 새로 생성되고 있다.

```
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos(todos => [...todos, newTodo]);
  }, []);
  // ...
```
이때 이렇게 상태를 직접 조작하지 않고 update 함수를 넘겨줌으로써 의존성을 최소화하고, 함수의 재생성을 막아줄 수 있다.

## 효율적으로 성능 최적화하기

이렇게 `memo`, `useMemo`, `useCallback` 에 대해 자세히 살펴봤다. 하지만 더 중요한 것은 이들을 적재적소에 사용하는 것이다.

`useMemo` 를 언제 사용해야 하는가? 에 대해서 [Pavel Pogosov 씨는 다음과 같이 이야기하고 있다](https://javascript.plainenglish.io/stop-using-usememo-now-e5d07d2bbf70#5aca).

1. 최적화하고자 하는 연산이 복잡하지 않을 때 (리소스를 많이 소모하지 않는 cheap한 연산일 때) 에는 사용하지 말아라.
2. 긴가민가 할 때에는 사용하지 말아라. (부적절한 최적화는 결국 문제를 일으킬 가능성이 높다)
3. 최적화하고자 하는 값이 자식 컴포넌트로 넘겨지지 않을 때에는 사용하지 말아라. (맞는 말이다. `useMemo` 는 자식 컴포넌트의 리렌더링을 방지하기 위해 사용된다. 자식 컴포넌트에게 넘겨주지 않는데 변경되어야 할 상황이 생긴다면 그건 정말 변경되어야 할 상황이고 성능에는 영향을 미치지 않을 가능성이 높다.)
4. 의존성이 너무 빈번하게 변경될 경우에는 사용하지 말아라. (이 경우에는 의존성 변경으로 인해 계속 재계산을 수행할 것이기 때문에 `useMemo` 사용의 장점이 사라진다)

결국 최적화도 중요하지만 과한 최적화, 필요하지 않은 최적화는 코드를 더욱 복잡하게만 만들 뿐이라는 점..

### 실습 (코드 분석)

이전에 다른 팀원이 작성한 코드를 보며 `useMemo` 가 잘못 사용된 경우를 분석해 보자.

```
import { useMemo } from 'react';

import { usePagination } from '@hooks/common/usePagination';

import { useSupports } from './useSupports';

export const useSupportListQuery = (showAll: boolean) => {
  const { page, size, handlePageChange } = usePagination({
    defaultSize: showAll ? 10 : 5,
    sectionName: 'support',
  });

  const { data, isLoading, error } = useSupports({
    page: showAll ? page : 0,
    size: showAll ? size : 10,
  });

  const supportData = useMemo(() => data?.items ?? [], [data]);

  const sortedData = useMemo(() => {
    return [...supportData].sort((a, b) => b.id - a.id);
  }, [supportData]);

  const displayData = useMemo(() => {
    return showAll ? sortedData : sortedData.slice(0, 5);
  }, [sortedData, showAll]);
  
    return {
    data,
    isLoading,
    error,
    displayData,
    page,
    size,
    handlePageChange,
  };
};
```

위 코드는 support list에 대한 정보를 다루는 custom hook이다. 

일단 현재 코드를 바로 보면 알 수 있듯이 너무 따로따로 `useMemo` 가 적용되어 있다. 메모이제이션 된 값들이 이후 값의 의존성이 되고 있다. 이는 의미가 없는 것이 결국 `supportData` 의 의존성인 `data` 가 변경되면 `sortedData`, `displayData` 모두가 변경된다. 의존성이 이렇게 연결되어 있는 것이다. 

`data → supportData → sortedData → displayData`

따라서 하나의 `useMemo` 를 사용하는 것이 적절해 보인다.

의존성을 짚어 올라가면 `page`, `size`, `showAll` 이라는 변수의 변화에 따라서 최종으로 반환하는 `displayData` 가 바뀌는 것을 확인할 수 있다.

```
  const displayData = useMemo(() => {
  	const supportData = data?.items ?? [];
	const sortedData = [...supportData].sort((a, b) => b.id - a.id);
    return showAll ? sortedData : sortedData.slice(0, 5);
  }, [page, size, showAll]);
```
그래서 나였다면 이렇게 작성했을 것 같다.

하지만 이것도 `page`, `size`, `showAll` 이 자주 변경된다거나 이 친구들 말고는 변경될 상태가 없다거나 하면 불필요한 메모이제이션이 될 것이다. 현재로서는 부모 컴포넌트 구조가 기억이 안 나서 모르겠지만..

## 네 줄 요약

1. `memo` 는 props가 변경되지 않은 컴포넌트에 대한 리렌더링을 방지하는 함수이다.
2. `useMemo` 는 의존성이 변경되지 않았을 때 함수를 재실행하지 않는 함수 실행값에 대한 캐싱이다.
3. `useCallback` 은 의존성이 변경되지 않았을 때 함수를 재생성하지 않는 함수에 대한 캐싱이다.
4. 적절하게 사용하자. 과한 최적화, 필요하지 않은 최적화는 코드를 더욱 복잡하게 만든다.

## 참고

[리액트 공식 문서 - memo](https://ko-react-exy5xcwjj-fbopensource.vercel.app/reference/react/memo)

[리액트 공식 문서 - useMemo](https://ko-react-exy5xcwjj-fbopensource.vercel.app/reference/react/useMemo)

[리액트 공식 문서 - useCallback](https://ko-react-exy5xcwjj-fbopensource.vercel.app/reference/react/useCallback)

[Medium - Stop Using useMemo Now! by Pavel Pogosov](https://javascript.plainenglish.io/stop-using-usememo-now-e5d07d2bbf70#5aca)
