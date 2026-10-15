---
title: "이터러블 톺아보기!"
date: "2025-11-22"
description: "이터러블은 무엇이고 왜 필요할까?"
tags: ["JavaScript"]
---

## 들어가며

이전에 `Symbol` 을 통해 사용자 정의 이터러블을 만드는 방법을 알아보았었는데 이런 이터러블은 정확히 무엇이고 왜 필요하며 어떻게 사용될지 알아보자!!

## 이터레이션 프로토콜

이터러블 프로토콜은 순회 가능한 데이터 컬렉션 (자료구조) 을 만들기 위해 ECMAScript 사양에 정의하여 미리 약속한 규칙이다. 

ES6 이전의 **순회 가능한 데이터 컬렉션** -> 배열, 문자열, 유사 배열 객체, DOM 컬렉션 등등은 통일된 규칙 없이 각자의 구조를 가지고 `for` 문, `for ... in` 문, `forEach` 메서드 등 다양한 방법으로 순회할 수 있었는데, ES6부터는 이런 순회 가능한 데이터 컬렉션은 "이터러블" 이라는 이름으로 통일해 일원화된다.

이터레이션 프로토콜에는 **이터러블 프로토콜** 과 **이터레이터 프로토콜** 이 있다.

### 이터러블 프로토콜

Well-known Symbol 인 `Symbol.iterator` 를 프로퍼티 키로 가지는 **이터레이터 메서드** 를 가져야 한다는 것이 이터러블 프로토콜이다. 

이터레이터 메서드를 가지는 방법은 두 가지로 나눠 볼 수 있는데,

- 사용자가 `Symbol.iterator` 를 프로퍼티 키로 사용한 메서드를 직접 구현
- [프로토타입 체인](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain)을 통한 상속

이러한 프로토콜을 준수한 객체가 이터러블이 된다.

### 이터레이터 프로토콜

위에서 언급한 **이터레이터 메서드** 가 만족해야 하는 프로토콜이다. 이터레이터는 `next` 메서드를 소유해야 하고 이 `next` 메서드를 호출하면 이터러블을 순회하며 `value` 와 `done` 프로퍼티를 가지는 **이터레이터 Result 객체**를 반환한다.

이터레이터는 이터러블의 요소를 탐색하기 위한 포인터 역할을 하게 된다.

## 이터러블

**iterable 은 반복 가능한 값** 이라는 뜻으로, 순회하며 값에 접근할 수 있는 값을 말한다.

위에서 언급한 이터러블 프로토콜을 준수한 객체가 이터러블이 된다. 이터러블은 `for ... of` 문을 통해 순회가 가능하고, 스프레드 문법과 배열 디스트럭처링 할당의 대상으로 사용할 수 있다.

역으로 이터러블 프로토콜을 만족하는지 검사함으로써 인자로 받은 객체가 이터러블인지 확인하는 함수를 다음과 같이 구현할 수 있다.

```javascript
const isIterable = v => v !== null && typeof v[Symbol.iterator] === 'function';
```

## 이터레이터

이터러블의 `Symbol.iterator` 메서드를 호출하면 이터레이터 프로토콜을 준수한 이터레이터를 반환하게 된다.

```javascript
const array = [1, 2, 3];
// 배열은 이터러블 프로토콜을 준수한 이터러블이다.

const iterator = array[Symbol.iterator]();

console.log('next' in iterator); // true
```

이렇게 이터러블인 "배열" 에서 `Symbol.iterator` 프로퍼티에 해당하는 메서드를 호출해 `next` 메서드가 존재함을 확인할 수 있다.

이터레이터의 `next` 메서드는 이터러블의 각 요소를 순회하기 위한 포인터의 역할을 한다. `next` 메서드를 호출하면 이터러블을 순차적으로 한 단계씩 순회하며 순회 결과를 나타내는 이터레이터 Result 객체를 반환한다.

```javascript
const array = [1, 2, 3];

const iterator = array[Symbol.iterator]();

console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { value: undefined, done: true }

```

이렇게 이터레이터의 `next` 메서드가 반환하는 이터레이터 Result 객체의 `value` 프로퍼티는 현재 순회 중인 이터러블의 값을 나타내고 `done` 프로퍼티는 이터러블의 순회 완료 여부를 나타낸다.

## 빌트인 이터러블

빌트인 이터러블은 자바스크립트가 제공하는 이터레이션 프로토콜을 준수한 객체이다. 다음 객체들이 빌트인 이터러블에 해당한다.

- `Array`
- `String`
- `Map`
- `Set`
- `TypedArray`
- `arguments`
- DOM 컬렉션

## `for ... of` 문

`for ... of` 문은 이터러블을 순회하면서 이터러블의 요소를 변수에 할당하는 구문이다.

`for ... of` 가 시작하자 마자 `for ... of` 는 `Symbol.iterator` 를 호출해 이터레이터를 추출한다.


```javascript
for (const i of array) { ... }
```

이후 이터레이터의 `next` 메서드를 실행하며, `done` 이 `true` 가 되기 전까지 Result 객체의 `value` 를 사용자가 선언한 변수에 넣어 사용자가 작성한 로직에 대입되는 것이다. 

`for ... of` 문의 내부 동작을 `for` 문과 이터레이터 `next` 메서드를 사용해 표현하면 다음과 같다.

```javascript
const iterable = [1, 2, 3];
const iterator = iterable[Symbol.iterator]();

for (;;) {
  const res = iterator.next();
  
  if (res.done) break;
  
  console.log(res.value); // 1 2 3
}
```

## 이터러블과 유사 배열 객체

유사 배열 객체는 배열처럼 인덱스를 통해 프로퍼티 값에 접근할 수 있고 `length` 프로퍼티를 가지는 객체이다. 

```javascript
const arrayLike = {
  0: 1,
  1: 2,
  2: 3,
  length: 3
};

// 유사 배열 객체는 length 프로퍼티를 가지고 인덱스를 나타내는 숫자 형식의 문자열을 프로퍼티 키로 가지고 있어 마치 배열같다.

for (let i = 0; i < arrayLike.length; i++) {
  console.log(arrayLike[i]); // 1 2 3 
}
```

하지만 이 유사 배열 객체는 이터러블 프로토콜을 만족하지 않으므로 **이터러블이 아닌 일반 객체** 이다. 따라서 `for ... of` 문으로 순회할 수 없다.

단, `arguments`, `NodeList`, `HTMLCollection` 의 경우 유사 배열 객체이면서도 이터러블인데 그 이유는 ES6에서 이터러블이 도입되며 유사 배열 객체이던 `arguments`, `NodeList`, `HTMLCollection` 객체에 `Symbol.iterator` 메서드를 구현했기 때문이다.

`Array.from` 메서드를 사용하면 유사 배열 객체 또는 이터러블을 간단하게 배열로 변환할 수 있다.

```javascript
const arr = Array.from(arrayLike);
console.log(arr); // [1, 2, 3]
```

## 이터러블 프로토콜의 필요성

이터러블 프로토콜은 왜 필요할까? 

이터러블 프로토콜은 **다양한 데이터를 공급하는 데이터 공급자들로부터 통일된 순회 방식**을 가짐으로써 데이터 소비자가 **효율적으로 다양한 데이터 공급자를 사용할 수 있도록** 데이터 소비자와 데이터 공급자를 연결하는 인터페이스 역할을 한다.

![](https://velog.velcdn.com/images/yummjin/post/f79dcf4e-5b14-4afa-a294-3c5665f1bb9b/image.png)


쉽게 말해서, **여러 종류의 데이터들을 똑같은 방식으로 순회할 수 있도록** 도와주는 약속이다. 이 이터러블 프로토콜이 있기 때문에 데이터의 형식이 달라도 항상 같은 방식으로 데이터의 집합을 순회할 수 있다.

## 사용자 정의 이터러블을 만들어보자

위에서 언급했던 대로, 일반 객체가 이터레이션 프로토콜을 준수하도록(Symbol.iterator 메서드를 구현하고 Symbol.iterator 메서드가 next 메서드를 갖는 이터레이터를 반환하도록) 구현하면 사용자 정의 이터러블이 된다. 

이터러블은 `for ... of` 문 뿐만 아니라 스프레드 문법, 배열 디스트럭처링 할당에도 사용할 수 있다.

```javascript
const fibonacci = {
  [Symbol.iterator]() {
    let [pre, cur] = [0, 1];
    const max = 10;
    
    return {
      next() {
        [pre, cur] = [cur, pre + cur];
        return { value: cur, done: cur >= max };
      }
    };
  }
};

for (const num of fibonacci) {
  console.log(num);
}

const arr = [...fibonacci];
console.log(arr);

// fibonacci 는 이터러블이므로 배열 디스트럭처링 할당의 대상이 된다.
const [first, second, ...rest] = fibonacci;
console.log(first, second, rest); // 1 2 [3, 5, 8]
```

위에서 살펴본 사용자 정의 이터러블 `fibonacci` 는 내부에 수열의 최대값을 가지고 있어 외부에서 전달한 값으로 변경할 수 없다. 수열의 최대값을 인수로 전달받아 이터러블을 반환하는.. 즉 이터러블을 생성하는 함수를 만들어보자.


```javascript
const fibonacciMaker = (max) => {
  [Symbol.iterator]() {
    let [pre, cur] = [0, 1];
    
    return {
      next() {
        [pre, cur] = [cur, pre + cur];
        return { value: cur, done: cur >= max };
      }
    };
  }
};

for (const num of fibonacci(10)) {
  console.log(num); // 1 2 3 5 8
}
```

### 이터러블이면서 이터레이터를 생성하는 함수

이렇게 앞에서 살펴본 `fibonacciFunc` 함수는 이터러블을 반환한다. 이터레이터를 생성하기 위해서는 이터러블의 `Symbol.iterator` 메서드를 호출해야 한다.

```javascript
const iterable = fibonacciMaker(5);
const iterator = iterable[Symbol.iterator]();

console.log(iterator.next()) // { value: 1, done: false }
```

그런데 **이터러블이면서 이터레이터** 인 객체는 어떨까? `Symbol.iterator` 메서드를 호출하지 않아도 그 자체가 이터레이터이기에 그 자체에서 `next` 메서드를 호출할 수 있다.

>이터러블**(이터레이터를 반환하는 Symbol.iterator() 메서드 소유)**이면서 이터레이터**(Result 객체를 반환하는 next 메서드 소유)**

```javascript
{
  [Symbol.iterator]() { return this; }, 
    // this를 반환하기 때문에 next 메서드를 가지는 이터레이터를 반환한다.
  next() {
    return { value: any, done: boolean };
  }
}
```
위와 같은 식으로 구현될 수 있을 것이다.

이전에 살펴보았던 `fibonacciMaker` 함수를 이터러블이면서 이터레이터인 객체를 생성해 반환하는 함수로 변경할 수 있다.

```javascript
const fibonacciMaker = (max) => {
  let [pre, cur] = [0, 1];
  
  return {
    [Symbol.iterator]() { return this; }, 
    // 이터러블 프로토콜 만족(next 메서드 가진 this반환)
    next() { // 이터레이터 프로토콜 만족
      [pre, cur] = [cur, pre + cur];
      return { value: cur, done: cur >= max };
    }
  };
};

const iter = fibonacciMaker(10); // 이터러블이면서 이터레이터

for (const num of iter) { // 이터러블이므로 자기 자신이 순회 가능
  console.log(num); // 1 2 3 5 8
}

console.log(iter.next()); // { value: 1, done: false }
// 이터레이터이므로 next 메서드를 호출해 순회 가능
```

뭔가 이해하기 어렵다. 재귀같은 느낌이라고 해야 할까...
하지만 이 **본인이 이터레이터이면서 이터러블** 인 개념은 제너레이터 개념과도 연관되어 있다. 이 부분은 차차 다뤄 보도록 하자..

### 왜 필요한가? - 지연 평가

그냥 배열을 통해 값을 할당하고 정의하면 편리하게 순회할 수 있는 데이터셋을 구현할 수 있는데 복잡하게 사용자 정의 이터러블을 구현해서 값을 할당하는 이유가 무엇일까?

이유는 [지연 평가](https://ko.wikipedia.org/wiki/%EB%8A%90%EA%B8%8B%ED%95%9C_%EA%B3%84%EC%82%B0%EB%B2%95)를 통한 성능 개선에 도움이 되기 때문이다.

지연 평가는 "계산의 결과값이 필요할 때까지 계산을 늦추는 기법" 이라고 한다. 즉 **데이터가 필요한 시점이 되면 그때야 비로소 데이터를 생성**한다. 결과가 필요할 때까지 평가를 늦추는 기법이라고도 할 수 있다.

아래 새로 구현하는 `fibonacciMaker` 함수는 무한 이터러블을 생성하는 함수이다.

```javascript
const fibonacciMaker = () => {
  let [pre, cur] = [0, 1];
  
  return {
    [Symbol.iterator]() { return this; },
    next() {
      [pre, cur] = [cur, pre + cur];
      return { value: cur }; // 무한이므로 done은 생략
    }
  };
};

for (const num of fibonacciMaker()) {
  if (num > 10000) break;
  console.log(num); // 1 2 3 5 8 ... 4181 6765
}

const [f1, f2, f3] = fibonacciMaker();
console.log(f1, f2, f3); // 1 2 3
```

`fibonacciMaker` 는 순회 시 `next` 메서드에서 `done` 값이 생략되었다. 따라서 이는 무한 이터러블을 생성하게 된다. 하지만 이 함수를 정의해주는 것만으로 무한개의 메모리를 차지하는 값 자체가 생성되는 것은 아니다. `for` 문에서 `fibonacciMaker` 를 호출했을 때 그때서야 데이터가 생성된다.

따라서 불필요한 데이터를 미리 생성하지 않고 필요한 순간에 생성하여 실행 속도가 빠르고 불필요한 메모리 또한 소비하지 않게 된다.

두 번째 예시처럼 배열 디스트럭처링 할당을 통해 무한 이터러블에서 3개의 요소만 취득하는 것 또한 가능하다. 이때도 무한개의 이터러블이 모두 생성되지 않는다.

> 배열 디스트럭처링 할당 `const [a, b, c] = iterable` 은
이터러블의 `Symbol.iterator` 를 호출해서 이터레이터를 얻고 next 메서드를 필요한 만큼 자동으로 요청해 값만 순서대로 추출하기 때문이다!!

위에서 구현한 무한 이터러블에서 배열 디스트럭처링 할당이 동작하는 방식을 더 자세히 살펴보면 이렇게 되는 것이다.

- const iter = fibonacciMaker()[Symbol.iterator]()) 이터레이터를 추출한다.
- iter.next().value → 첫 번째 값을 얻어 f1에 대입
- iter.next().value → 두 번째 값을 얻어 f2에 대입
- iter.next().value → 세 번째 값을 얻어 f3에 대입

### 왜 필요할까? - 효율성

한 번만 순회할 데이터 그리고 직접적으로 값을 계속 생성하고 소비해야 하는 구조에서는 이터러블과 이터레이터를 하나의 사용자 정의 객체로 합치는 것이 효율적이라고 한다!

## 참고

[자바스크립트 딥다이브 (이웅모)](https://www.yes24.com/product/goods/92742567)

[JAVASCRIPT_INFO iterable](https://ko.javascript.info/iterable)

[지연 평가를 이용한 성능 개선](https://armadillo-dev.github.io/javascript/whit-is-lazy-evaluation/)
