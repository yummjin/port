---
title: "Promise 객체 톺아보기"
date: "2025-11-17"
description: "비동기 처리를 위한 Promise 객체를 자세히 알아보자."
tags: ["JavaScript"]
---

## 들어가며

자바스크립트에서 비동기 작업을 처리하는 여러가지 방식 중 가장 전통적인 방식은 콜백 함수를 사용한 방식이다. 콜백 함수는 간단하게 비동기 작업이 완료되면 호출되는 함수로, 보통 비동기 작업을 수행하는 함수의 인자로 전달된다.

비동기 작업이 완료되면 해당 함수에서 콜백 함수를 호출하고, 필요한 데이터를 콜백 함수에 인자로 전달함으로써 비동기 작업의 결과를 콜백 함수에서 처리할 수 있다.

이런 콜백 함수를 사용했을 때의 비동기 처리 방식과 단점, 그리고 `Promise` 객체에 대해 자세히 살펴보자.

## 비동기 처리 방식 간단하게 짚어보기

아래 예시는 비동기 작업을 수행하는 코드이다.

```javascript
const get = url => {
	const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send();
    
    xhr.onload = () => {
    	if (xhr.status === 200) {
        	console.log(JSON.parse(xhr.response));
        } else {
        	console.error(`${xhr.status} ${xhr.statusText}`);
        }
    };
};
```

위 `get` 함수는 `XMLHttpRequest` 를 사용해서 서버에 get 요청을 전송하고 성공하면 그 결과를, 실패하면 상태와 오류를 콘솔에 출력하는 함수이다.

이 함수는 내부에 **비동기로 동작하는 코드를 포함한 비동기 함수**이다. 비동기 함수를 호출하면 함수 내부의 비동기로 동작하는 코드가 완료되지 않았다 해도 기다리지 않고 즉시 종료된다.

> 즉 **비동기 함수 내부의 비동기로 동작하는 코드는 비동기 함수가 종료된 뒤 완료**된다. 

이는 자바스크립트 런타임이 작업을 외부에 맡겨 처리하기 때문이다. (스레드가 하나이기 때문에 비동기적으로 작업을 효율적으로 처리하기 위한 방식임)

따라서 **비동기 함수 내부의 비동기로 동작하는 코드에서 처리한 결과를 외부로 반환하거나 상위 스코프의 변수에 할당하게 되면 기대한 대로 동작하지 않는다.**

```javascript
const response = get('https://tigers.co.kr/post/1');
console.log(response); // undefined
```

그렇기 때문에, 비동기 함수의 처리 결과에 대한 후속 처리는 비동기 함수 내부에서 수행해야 하며 이때 비동기 함수의 책임 분리 및 범용적 사용성을 위해 비동기 함수에 **비동기 처리 결과에 대한 후속 처리를 수행하는 콜백 함수를 인자로 전달** 하는 것이 일반적이다.

```javascript
// 이런 식으로 콜백을 인자로 넘긴 뒤 콜백 함수에 비동기 처리 결과를 인자로 넘겨주는 식이다.
const get = (url, successCallback, failureCallback) => {
  console.log(`요청 보냄: ${url}`);

  setTimeout(() => {
    ...
    if (success) {
      const data = { message: "데이터 로드 성공!", url };
      successCallback(data); // 비동기 결과를 콜백으로 전달
    } else {
      const error = new Error("데이터 로드 실패!");
      failureCallback(error);
    }
  }, 500);
};
```
## 콜백 함수를 사용한 방식의 단점

하지만 콜백 함수를 사용한 비동기 처리 방식에는 여러 단점이 존재한다.

### 에러 처리의 어려움

먼저 에러 처리가 어렵다.

```javascript
try {
  setTimeout(() => {throw new Error('error'); }, 1000);
} catch (e) {
  // 에러를 캐치하지 못한다!
  console.error('에러: ', e);
}
```

이렇게 평소 동기적으로 동작하는 코드에서 사용했던 `try-catch` 문을 통해 에러 탐지가 불가능하다. 

왜일까? 이는 자바스크립트가 비동기 로직을 어떻게 처리하는지와 밀접하게 연관되어 있다. `setTimeout` 이 호출되면 `setTimeout` 함수의 실행 컨텍스트가 생성되어 콜 스택에 푸시되어 실행된다. 그런데 이 함수는 비동기 함수이기 때문에 실행 콘텍스트는 즉시 종료되어 콜 스택에서 제거되고 Web API와 같은 엔진 외부의 비동기 처리 공간으로 이동해서 실행되게 된다. 이후 타이머가 만료되면, `setTimeout` 의 콜백함수는 태스크 큐에서 대기하다 이벤트 루프에 의해 콜 스택으로 푸시되어 실행된다.

이때 이 콜백 함수가 실행될 때, `setTimeout` 함수는 콜 스택에서 제거되어 없어진 상태이다. 여기서 중요한 것은 이것이 **"콜백함수를 호출한 것이 `setTimeout` 함수가 아니다"** 라는 것을 의미한다. 

그리고 자바스크립트에서 **에러는 호출자 방향으로 전파** 된다. 콜 스택에서 아래 -> 위 방향으로 전파된다는 것이다. (스택이기 때문에 아래에 있는 로직이 더 먼저 들어온 로직)

![](https://velog.velcdn.com/images/yummjin/post/d18e5909-5c46-4b9b-a77f-aee9e2e54feb/image.png)

하지만 앞에서 언급했듯 `setTimeout` 함수는 콜 스택에 존재하지 않고, 결국 콜백함수의 호출자가 `setTimeout` 이 아니기에 콜백함수가 발생시킨 에러는 catch 블록에서 캐치되지 않는 것이다!~


```javascript
setTimeout(() => {
  try {
    throw new Error('error');
  } catch (e) {
    console.error('에러: ', e);
  }
}, 1000);
```

그래서 이렇게 콜백 함수를 사용해 비동기 작업을 처리하게 되면, 콜백 함수의 실행 시점과 결과 처리를 보장하기 위해 꼭 콜백 함수 안에서 예외 처리를 해 주어야 한다. 여러 가지 비동기 작업을 처리하게 된다면 그에 따라 에러 처리 로직도 늘어나게 된다. 따라서 비동기 처리 중 발생한 에러에 대한 대응이 복잡하다.


### 콜백 헬

또한 콜백 함수가 중첩해 사용되면 코드의 가독성이 저하된다. [콜백 헬](https://wikidocs.net/225110)을 유발할 수 있다.

```javascript
function get(url, success, failure) {
  setTimeout(() => {
    if (Math.random() > 0.25) success({ url, data: "OK" });
    else failure(new Error("네트워크 에러: " + url));
  }, 300);
}

get("/api/user", (user) => {
  console.log("user", user);
  get(`/api/user/${user.data}/posts`, (posts) => {
    console.log("posts", posts);
    get(`/api/posts/${posts.data}/comments`, (comments) => {
      console.log("comments", comments);
      // ... 계속 중첩
    }, (err) => {
      console.error("comments 에러:", err);
    });
  }, (err) => {
    console.error("posts 에러:", err);
  });
}, (err) => {
  console.error("user 에러:", err);
});
```

위 코드는 깊게 중첩된 콜백으로 인해 가독성이 하락하고, 각 단계마다 중복된 에러 처리 코드가 존재하고 있는 예제 코드이다. 흐름 제어가 어려워 보인다.


이런 콜백 함수의 단점을 해결하기 위해 `Promise` 객체와 `async/await` 문법을 사용할 수 있는데, 이번 글에서 다루어 보고자 하는 `Promise` 객체에 대해 알아보자.

## Promise 객체

### 생성하기

`Promise` 객체는 생성할 때 비동기 처리를 수행할 콜백 함수(executer 함수라고도 부른다)를 인수로 전달받는다. 그리고 이 콜백 함수는 `resolve` 와 `reject` 함수를 인수로 전달받는다.

```javascript
const promise = new Promise((resolve, reject) => {});
```

객체를 생성하면서 전달받은 콜백 함수 내에서 비동기 처리를 수행한다.

```javascript
const promise = new Promise((resolve, reject) => {
// 비동기 처리
  	if (/**/) {
      resolve('result');
	} else {
	reject('failure reason');
	}
});
```

그리고 비동기 처리가 성공하면 `resolve` 함수를 호출하고, 비동기 처리가 실패하면 `reject` 함수를 호출한다. 앞에서 살펴본 비동기 함수 `get` 을 프로미스를 사용해 구현하면 다음과 같다.

```javascript
const promiseGet = url => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send();
    
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.response));
      } else {
      reject(new Error(xhr.status));
      }
    } ;
  });
};
```

비동기 함수인 `promiseGet` 은 함수 내부에서 `Promise`를 생성하고 반환한다. 

비동기 처리는 **`Promise` 생성자 함수가 인수로 전달받은 콜백 함수 내부에서 수행**한다. 비동기 처리가 **성공하면 `resolve`** 함수에, **실패하면 `reject`** 함수에 각각 결과 또는 에러를 전달하며 호출한다.


![](https://velog.velcdn.com/images/yummjin/post/b53e496f-9e9c-4ffe-af7a-9d5782647da3/image.png)

> _실패하면 `reject`, 성공하면 `resolve` 아닙니까 . . !_


### Promise의 세 가지 상태

`Promise` 객체는 비동기 처리가 현재 어떻게 진행되고 있는지를 나타내는 세 가지 상태 정보를 가지게 된다.

|상태 정보|의미|상태 변경 조건|
|:---:|:---:|:---:|
|`pending`|비동기 처리가 아직 수행되지 않은 상태|프로미스가 생성된 직후 기본 상태|
|`fulfilled`|비동기 처리가 수행된 상태 (성공)|`resolve` 함수 호출|
|`rejected`|비동기 처리가 수행된 상태 (실패)|`reject` 함수 호출|

위 표로도 확인할 수 있듯 생성된 직후의 `Promise` 는 기본적으로 `pending` 상태이다. 이후 비동기 처리가 수행되면 처리 결과에 따라 상태가 변경된다. 성공 시에는 `resolve` 호출 후 `fulfilled` 상태가 되고, 실패 시에는 `reject` 호출 후 `rejected` 상태가 된다.

이렇게 `resolve` 또는 `reject` 의 호출을 통해 변경되는 상태를 "비동기 처리가 수행된 상태" 로 "settled" 상태라고 한다. `pending` 상태에서 `settled` 상태가 되면 더는 다른 상태로 변화할 수 없다.

![](https://velog.velcdn.com/images/yummjin/post/96293c97-2971-4b4f-b7de-7217a22fc43e/image.png)
![](https://velog.velcdn.com/images/yummjin/post/6048107a-2ef1-4814-abeb-e450cd35eefa/image.png)
![](https://velog.velcdn.com/images/yummjin/post/58350469-82e1-4d63-8803-dc569aa831e1/image.png)

개발자 도구에서 `Promise` 객체를 직접 만들어 출력해 보면 상태와 처리 결과 값을 모두 가지고 있다는 것을 알 수 있다. 

## Promise 상태 후속 처리

따라서 이런 상태에 따라 결과를 적절하게 처리할 수 있어야 하고, 이를 후속 처리라고 한다.

![](https://velog.velcdn.com/images/yummjin/post/f1cca0ba-f459-4a82-80c9-dcfdf2b968d1/image.png)


`Promise` 가 `fulfilled` 상태가 되면 결과를 가지고 무언가를 해야 하고, `rejected` 상태가 되면 처리 결과(에러) 를 가지고 에러 처리를 해야 한다.

`Promise` 는 이런 후속 처리를 위해 `then`, `catch`, `finally` 메서드를 제공한다.

### `Promise.prototype.then`

`then` 메서드는 두 개의 콜백 함수를 인수로 전달받는다.

- 첫 번째 콜백 함수는 `fulfilled` 상태가 되면 호출된다. 그리고 이 콜백 함수의 인자를 통해 프로미스의 비동기 처리 결과를 전달받는다.
- 두 번째 콜백 함수는 `rejected` 상태가 되면 호출된다. 이때 콜백 함수는 인자를 통해 프로미스의 에러를 전달받는다.

```javascript
new Promise(resolve => resolve('fulfilled')).then(v => console.log(v), e => console.error(e));

new Promise((_, reject) => reject(new Error('rejected'))).then(v => console.log(v), e => console.error(e));
```

`then` 메서드는 **언제나 프로미스를 반환**한다. 만약 `then` 메서드의 콜백 함수가 프로미스를 반환하면 그 프로미스를 그대로 반환하고, 콜백 함수가 프로미스가 아닌 값을 반환하면 그 값을 **암묵적으로 `resolve` 또는 `reject` 하여 프로미스를 생성해 반환**한다. (따라서 `then` 메서드에 대한 후속 처리도 무조건 다른 후속 처리 메서드를 통해서 가능하다.)

### `Promise.prototype.catch`

`catch` 메서드는 하나의 콜백 함수만을 인수로 전달받는다.`catch` 메서드의 콜백 함수는 프로미스가 `rejected` 상태일 경우만 호출된다.

그래서 위에서 살펴본 `then` 메서드에서 두 번째 인수만 전달한 것과 동일하게 동작한다.

```javascript
new Promise((_, reject) => reject(new Error('rejected'))).catch(e => console.error(e));

// 같은 동작
new Promise((_, reject) => reject(new Error('rejected'))).then(undefined, e => console.error(e));
```

### `Promise.prototype.finally`

`finally` 메서드는 한 개의 콜백 함수를 인수로 전달받는다. `finally` 메서드의 콜백 함수는 프로미스의 성공 또는 실패 여부와 상관없이 무조건 한 번 실행된다. 

```javascript
new Promise(() => {}).finally(() => console.log('bye!'));
```

## `Promise`의 에러 처리

`Promise` 에서 에러를 처리하는 방법은 두 가지가 있다. 첫 번째는 `then` 메서드에서 두 번째 인자를 사용해 에러를 처리하는 방법이고, 두 번째는 `catch` 메서드를 사용해 에러를 처리하는 방법이다.

### `then` 에서 처리하기

위에서 살펴봤듯 `then` 메서드의 두 번째 인자는 `Promise` 가 `rejected` 되면 호출되는 에러 처리 함수이다.

다만 `then` 의 두 번째 인자는 **첫 번째 인자로 받은 콜백 함수에서 일어나는 에러는 캐치하지 못한다.**

```javascript
new Promise(resolve => resolve('fulfilled')).then(v => console.log(v.result()), e => console.error(e));
```

위와 같은 상황에서 `v` 에는 `result` 라는 메서드가 존재하지 않기 때문에 에러가 발생하는데 두 번째 인자는 에러를 캐치하지 못한다.

### `catch` 로 처리하기

`catch` 메서드를 모든 `then` 메서드를 호출한 이후에 호출하면 비동기 처리에서 발생한 에러 뿐 아니라 `then` 메서드에서 발생한 에러까지 모두 캐치할 수 있다.

또한 `catch` 메서드에서 에러를 처리하는 것이 `then` 메서드의 두 번째 인자를 사용하는 것보다 가독성이 좋고 명확하기 때문에 `catch` 메서드를 사용해 에러를 처리할 것을 권장한다고 한다.

## `Promise` 체이닝

`Promise` 의 후속 처리 메서드인 `then` , `catch` , `finally` 는 모두 `Promise` 를 반환하기 때문에 연속적으로 호출될 수 있다.

이를 프로미스 체이닝이라고 한다.

```javascript
new Promise((resolve) => {
  resolve(1);
})
  .then((n) => {
    console.log("1번:", n); // 1번: 1
    return n + 1;
  })
  .then((n) => {
    console.log("2번:", n); // 2번: 2
    return n + 1; 
  })
  .then((n) => {
    console.log("3번:", n); // 3번: 3
    return n + 1; 
  })
  .then((result) => {
    console.log("최종 결과:", result); // 최종 결과: 4
  });
```
`Promise` 또한 콜백 패턴을 사용하기 때문에 가독성이 매우 좋다 할 수는 없는데, 이것을 해결하기 위해 `async/await` 패턴이 존재한다.

## `Promise` 의 정적 메서드

5가지 정적 메서드를 가지고 있다.

### `Promise.resolve` / `Promise.reject`

> 설명

이 메서드들은 이미 존재하는 값을 매핑하여 프로미스를 생성하기 위해 사용한다.
- `Promise.resolve` 는 인수로 전달받은 값을 `resolve` 하는 프로미스를,
- `Promise.reject` 는 인수로 전달받은 값을 `reject` 하는 프로미스를 생성한다.

> 사용 방법


```javascript
const resolvedPromise = new Promise(resolve => resolve(1));
const resolvedPromise = Promise.resolve(1);

const rejectedPromise = new Promise((_, reject) => reject(false));
const rejectedPromise = Promise.reject(false);
```

> 반환값

`resolve` 또는 `reject` 된 `Promise` 객체

### `Promise.all`

> 설명

`Promise.all` 은 여러 개의 비동개 처리를 병렬로 처리하고자 할 때 사용한다. 직렬로 여러 비동기 요청을 처리하는 것보다 훨씬 적은 시간에 많은 요청을 처리할 수 있게 된다. (병렬이니까 당연하긴 함)

`Promise.all` 메서드는 인수로 전달받은 배열의 모든 프로미스가 모두 fulfilled 상태가 되면 종료한다. 따라서 `Promise.all` 메서드가 종료하는 데 걸리는 시간은 가장 늦게 fulfilled 상태가 되는 프로미스의 처리 시간보다 조금 더 길다고 한다.

> 사용 방법

```javascript
Promise.all([fetchUser(), fetchUserLike(), fetchUserOrder()]).then(v => console.log(v));
```

이런 방식으로 사용할 수 있다.

> 반환값

첫 번째 프로미스가 `resolve` 한 처리 결과부터 차례대로 배열에 저장해 그 배열을 `resolve` 하는 새로운 프로미스를 반환한다. 즉 처리 순서가 보장되며 구조 분해 할당을 사용할 수 있다.

```javascript
 const [likedCount, isAuthenticated, userInfo] = await Promise.all([
    fetchReviewFavCount(type, id),
    AuthService.isAuthenticated(),
    AuthService.getUserInfo(),
  ]);
```

> 유의사항

인수로 전달받은 배열의 프로미스가 하나라도 `reject` 상태가 되면 나머지 프로미스들이 `fulfilled` 상태가 되는 것을 기다리지 않고 즉시 종료하게 된다.

## `Promise.race`

> 설명

이 메서드는 `Promise.all` 메서드와 동일하게 프로미스를 요소로 가지는 배열 드으이 이터러블을 인수로 전달받는다. 하지만 이전에 살펴본 `all` 메서드와 달리 모든 프로미스가 `fulfilled` 상태가 되는 것을 기다리는 것이 아니라 말 그대로 "race", 경주 즉 가장 먼저 `fulfilled` 상태가 된 프로미스의 처리 결과만 `resolve` 하는 새로운 프로미스를 반환한다.

> 사용 방법

```javascript
const delay = (second) => setTimeout(() => resolve(second), second * 1000)
Promise.all([delay(1), delay(2), delay(3)]).then(console.log);
```

위와 같이 사용했을 경우 가장 빨리 처리되는 `delay(1)` 함수의 `resolve` 결과인 1이 콘솔에 찍히게 된다.

> 반환값

가장 먼저 `fulfilled` 상태가 된 프로미스의 처리 결과만 `resolve` 하는 새로운 프로미스가 반환된다. 이때 `all` 과 마찬가지로 하나라도 `rejected` 상태가 되면 에러를 `reject` 하는 새로운 프로미스를 즉시 반환하게 된다.

## `Promise.allSettled`

> 설명

이 메서드는 위 두 가지 메서드와 동일하게 프로미스를 요소로 가지는 배열 등의 이터러블을 인수로 전달받는다. 그리고 전달받은 프로미스가 모두 `settled` 상태 (위에서 살펴봤듯이 성공/실패 여부 상관없이 비동기 처리가 수행된 상태) 가 되면 처리 결과를 배열로 반환한다.

> 사용 방법

```javascript
Promise.allSettled([
  new Promise(resolve => setTimeout(() => resolve('resolved!'), 1000)),
  new Promise((_, reject) => setTimeout(() => reject(new Error('Error')), 2000))
]).then(console.log)

/*
[
  {status: "fulfilled", value: 'resolved!'},
  {status: "rejected", reason: Error: Error! at <anonymous>:3:54}
]
*/
```

> 반환값

성공(`fulfilled`) 또는 실패(`rejected`) 여부와는 상관없이 인수로 전달받은 모든 프로미스들의 처리 결과를 가지는 배열을 반환한다.

이때 상태를 나타내는 객체는
- `fulfilled` : `{status: "", value: ""}`
- `rejected` : `{status: "", reason: ""}`

## 마이크로태스크 큐

![](https://velog.velcdn.com/images/yummjin/post/88be2797-f397-4eea-8997-e534a236442b/image.png)

우리는 여태까지 자바스크립트의 비동기 처리를 이렇게만 이해하고 있었다.

```javascript
setTimeout(() => console.log(1), 0);

Promise.resolve().then(() => console.log(2)).then(() => console.log(3));
```

그래서 우리가 이해하고 있는 바에 따르면 콘솔에는 1 -> 2 -> 3 순으로 출력되어야 한다. 

하지만 프로미스의 후속 처리 메서드는 태스크 큐가 아닌 마이크로태스크 큐에 저장되기 때문에 일반 비동기 로직보다 우선 동작한다고 한다.

그럼 마이크로태스크 큐는 무엇이냐?? 태스크 큐와는 또 다른 별도의 큐라고 한다. 마이크로태스크 큐에는 **오직 "프로미스의 후속 처리 메서드의 콜백 함수" 만 일시 저장**되고, 그 외의 비동기 함수의 콜백 함수, 그리고 이벤트 핸들러는 태스크 큐에 일시 저장된다고 한다.

**마이크로태스크 큐는 태스크 큐보다 우선순위가 높**기 때문에, 이벤트 루프는 콜 스택이 비면 먼저 마이크로태스크 큐에서 대기하고 있는 함수를 가져와 실행한다고 한다. 이후 마이크로태스크 큐가 비면 태스크 큐의 함수를 가져와 실행한다.

![](https://velog.velcdn.com/images/yummjin/post/108f5ebe-2580-4c1b-9e44-7060161c2d57/image.png)

[이미지 출처 https://whales.tistory.com/130](https://whales.tistory.com/130)


## `fetch` 함수와의 사용

`fetch` 함수는 HTTP 요청 전송 기능을 제공하는 클라이언트 사이드 Web API이다. `fetch` 함수는 HTTP 응답을 나타내는 `Response` 객체를 래핑한 프로미스를 반환한다.

![](https://velog.velcdn.com/images/yummjin/post/3cb20552-ad1d-430c-bc4f-88629714aae9/image.png)

콘솔에서 간단하게 `fetch` 메서드를 사용해본 모습이다. [CSP](https://developer.mozilla.org/ko/docs/Web/HTTP/Guides/CSP)에 의해 요청은 정상적으로 실행되지 않았지만, 결과적으로 `Promise` 를 반환하고 있음을 알 수 있다.

`fetch` 요청이 성공하면

![](https://velog.velcdn.com/images/yummjin/post/17922cf0-b30f-4bb6-95a5-ab11383dbc8a/image.png)

위와 같이 `Response` 객체를 반환하게 된다.

하지만 여기서 유의할 점은 바로 `fetch` 함수가 반환하는 프로미스는 `404 not found` 나 `500 internal server error` 와 같은 HTTP 에러가 발생하더라도 프로미스를 reject 하지 않고 불린타입의 ok라는 상태를 `false` 로 설정한 `Response` 객체를 `resolve` 한다는 것이다. 

네트워크 장애나 CORS 에러에 의해 **요청이 완료되지 못한 경우** 에만 `reject` 하고, HTTP 에러가 발생하더라도 **네트워크 요청이 성공하기만 하면** `resolve` 하기 때문에 `fetch` 메서드를 사용해 HTTP 통신을 할 때에는 반드시 `response.json()` 을 통해 `Response` 객체를 역직렬화하고 `response.ok` 와 `response.status` 값을 사용하여 적절한 에러 처리를 하는 것이 중요하다.


## 참고

[자바스크립트 딥다이브 (이웅모)](https://www.yes24.com/product/goods/92742567)

[MDN docs_ `fetch()` 함수](https://developer.mozilla.org/ko/docs/Web/API/Window/fetch)

[MDN docs_ `Promise`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise)

[모던 자바스크립트 가이드_ 마이크로태스크](https://ko.javascript.info/event-loop)
