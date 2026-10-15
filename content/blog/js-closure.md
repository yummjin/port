---
title: "대망의 클로저 이해하기"
date: "2025-12-22"
description: "JavaScript의 클로저를 이해해보자."
tags: ["JavaScript"]
---

## 들어가며

클로저란 무엇인가.. [프로게이머 클로저](https://namu.wiki/w/%EC%9D%B4%EC%A3%BC%ED%98%84(%ED%94%84%EB%A1%9C%EA%B2%8C%EC%9D%B4%EB%A8%B8)) 씨, 2017년에 즐겨 듣던 노래 [클로저](https://www.youtube.com/watch?v=0zGcUoRlhmw)까지 매우매우 익숙한 워딩이다. 다만 JavaScript의 클로저라니.. (스펠링도 다르다 Closure) 저와 인사 나눠 보시죠 ^^

![](https://velog.velcdn.com/images/yummjin/post/4b4225b9-7e37-4f7a-b3c8-274342ae8fc7/image.png)

클로저는 폐쇄라는 뜻이다. 이름에서 알 수 있듯이, 변수와 같은 값을 외부에 노출시키지 않기 위해 만들어진 듯하다.

## 클로저란?

클로저의 정의는 **함수와 그 함수가 선언된 렉시컬 환경의 조합**이다.

조금 더 풀어서 설명하면, 클로저는 외부 함수와 내부에 중첩 함수가 있을 때, 실행이 종료되어 **실행 컨텍스트 스택에 존재하지 않는 외부 함수의 변수를 참조할 수 있도록** 하는 현상이다.

### 자바스크립트의 렉시컬 환경

[이전 글](https://velog.io/@yummjin/JavaScript-%EC%8B%A4%ED%96%89-%EC%BB%A8%ED%85%8D%EC%8A%A4%ED%8A%B8-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0#%EC%8B%A4%ED%96%89-%EC%BB%A8%ED%85%8D%EC%8A%A4%ED%8A%B8%EC%9D%98-%EA%B5%AC%EC%A1%B0)을 통해서 자바스크립트의 렉시컬 환경은 코드의 실행 전 코드의 평가 시점에 생성된다는 것을 알아보았다.

![](https://velog.velcdn.com/images/yummjin/post/edbcbfa7-26b7-4c9d-8e5b-24b1484a1080/image.png)

자바스크립트의 소스 코드는 위와 같은 순서로 진행되기 때문이다.

따라서 자바스크립트에서 **상위 스코프**는 **함수를 어디서 정의했는지**에 따라 결정된다. (JS 엔진이 정의된 코드를 평가하며 렉시컬 환경이 생성되고 그때 상위 스코프 또한 결정되기 때문이다)

> 자바스크립트의 상위 스코프는 함수 코드 평가 시점에 결정된다.
-> **함수를 어디에 정의했는지에 따라 결정**된다.

```javascript
const x = 1;

function outerFunc() {
    const x = 10;
    innerFunc();
}
    
function innerFunc() {
    console.log(x);
}

outerFunc();
```

이 코드의 실행 결과는 무엇일까?
정답은 1이다.

`console.log` 가 실행되는 `innerFunc` 의 정의 위치에 따라 `innerFunc` 의 상위 스코프는 전역이기 때문이다. 실행은 `outerFunc` 내부에서 했지만, **정의는 전역 스코프 아래에** 되어 있기 때문이다.

이렇게 함수가 정의된 위치와 호출되는 위치는 서로 다를 수 있다. 그럼 어떻게 함수는 **자신이 정의된 환경**을 기억할까? 함수는 자신의 **내부 슬롯 `[[Environment]]`**에 자신이 정의된 환경, 즉 상위 스코프의 참조를 저장한다.

### 클로저와 렉시컬 환경

그럼 내부 함수가 외부 함수를 상위 스코프로 두게 하려면 무조건 **외부 함수 내부에 내부 함수가 정의**되어 있어야 한다는 뜻이다.

```javascript
const x = 1;

function outerFunc() {
    const x = 3;
    
    function innerFunc() {
        console.log(x);
    }
    
    innerFunc();
}

outerFunc();
```

그럼 이렇게 작성하면 될까? 이렇게 작성했을 경우 `outerFunc` 가 `innerFunc` 의 상위 스코프가 되는 것은 당연해 보인다. 하지만 이것은 **클로저가 아니다.**

클로저는 **중첩 함수가 외부 함수보다 실행 컨텍스트 스택에 오래 생존해 있어야**한다. 하지만 위 코드에서는 중첩 함수가 외부 함수보다 먼저 동작을 마치고 소멸된다.

![](https://velog.velcdn.com/images/yummjin/post/049351e3-663d-43ec-8e8a-9e1422fa9a2c/image.png)

```javascript
const x = 1;

function outer() {
    const x = 10;
    const inner = function() { console.log(x) };
    return inner;
}

const innerFunc = outer();
innerFunc()
```

그럼 이 코드는 어떨까?

```javascript
const innerFunc = outer();
```

여기에서 `outer` 함수를 호출하면 `outer` 함수는 중첩 함수인 `inner` 를 반환하고 생명 주기를 마감하며 실행 컨텍스트 스택에서 pop된다. 그러면서 반환된 `inner` 함수가 `innerFunc` 변수에 바인딩된다. **이렇게 중첩 함수가 외부 함수보다 오래 살아있을 수 있다.**

```javascript
innerFunc()
```

`innerFunc` 변수에 바인딩된 함수를 실행하면 이미 종료되어 실행 컨텍스트 스택에서 사라진 `outer` 함수의 중첩 함수인 `inner` 함수를 실행한다. 이렇게 이미 사라진 외부 함수의 지역 변수를 참조할 수 있게 된다.

![](https://velog.velcdn.com/images/yummjin/post/2366ae95-af8b-49c0-a5a0-5ed1a32ce8be/image.png)

실행 컨텍스트 스택은 이런 식으로 바뀔 것이다.

> 또한 중첩 함수가 외부 함수의 식별자를 참조하지 않을 때에는 가비지 컬렉터가 상위 스코프를 기억하지 않는다.

## 클로저의 활용

클로저는 상태를 안전하게 변경하고 유지하기 위해 사용된다. 보통 상태는 변수에 할당되는데, 은닉하지 않은 상태로 상태를 관리할 경우 상태가 의도하지 않은 값으로 변경되거나 삭제될 위험이 있다.

```javascript
let count = 0;

const increase = function () {
  return ++count;
};

console.log(increase()); // 1
console.log(increase()); // 2
console.log(increase()); // 3
```

위 코드의 경우 동작에는 문제가 없지만 `count` 변수가 외부에 노출되어 있어 값의 변경이나 삭제가 쉽다. 임의로 상태가 변경될 여지가 있다.

```javascript
const increase = function () {
  let count = 0;
  return ++count;
};

console.log(increase()); // 1
console.log(increase()); // 1
```

이번에는 함수의 지역 변수로 상태를 선언하여 함수 외부에서는 상태에 접근할 수 없도록 했다. 하지만 위와 같은 방식을 사용할 경우 함수의 호출 시마다 상태값이 초기화되어 이전 상태를 유지할 수 없다.

```javascript
const increase = (function () {
  let count = 0;
  return function () { return ++count };
}())
```

그래서 이렇게 클로저를 사용한다. [즉시 실행 함수 IIFE](https://developer.mozilla.org/ko/docs/Glossary/IIFE)를 사용해서 구현해준 것을 확인할 수 있다. `increase` 변수에 바인딩된 함수를 실행하면 `count` 값이 원하는 방식으로 조작될 수 있으며 외부에서 `count` 변수에 직접 접근하는 것은 불가능하다.

### 클로저와 생성자 함수

위 예제에서는 간단하게 상태값을 더할 수 있는 기능만 구현했다. 빼기와 상태 조회 기능까지 갖추도록 구현해보면 다음과 같다.

```javascript
const counter = (function () {
  let count = 0;
  
  return {
    increase() { return ++count; }
    decrease() { return count > 0 ? --count : 0; }
    getValue() { return count; }
  }
}())
```
여러 기능을 갖추기 위해 즉시 실행 함수 내부에 객체 리터럴이 반환되도록 변경되었다. 이때 이 즉시 실행 함수가 반환하는 객체 리터럴은 <즉시 실행 함수의 실행> 단계에서 평가되어 객체가 되고 이때 객체의 메서드도 함수 객체로 생성된다.

객체 구조를 띠기에 생성자 함수를 통해서도 비슷하게 구현해 줄 수 있겠다는 생각이 들지 않는지?!
```javascript
const Counter = (function () {
    let count = 0;
    
    function Counter() {}
    
    Counter.prototype.increase = function () {
        return ++count;
    };
    
    Counter.prototype.decrease = function () {
        return count > 0 ? --count : 0;
    };
    
    Counter.prototype.getValue = function () {
        return count;
    };
    
    return Counter;
}());

const counter = new Counter();

console.log(counter.increase());
console.log(counter.increase());
console.log(counter.increase());
console.log(counter.getValue());
```

`Counter` 객체의 프로퍼티가 되면 속성값이 노출되므로, 즉시 실행 함수의 지역 변수로 두고 즉시 실행 함수 내부에서 프로토타입을 정의해준다. 즉시 실행 함수 내부에서 정의한 프로토타입의 상위 스코프는 즉시 실행 함수이므로 즉시 실행 함수의 내부 지역 변수인 `counter` 에 접근할 수 있으며 외부에서는 `count` 변수의 값을 임의로 조작하는 것이 불가능하다.

### 함수형 프로그래밍 사용 예제

함수형 프로그래밍에서는 보조 작업을 수행하는 함수를 인자로 받아서 클로저를 구현하기도 한다.

```javascript
const counter = (function makeCounter() {
  let counter = 0;
  return function (aux) {
    counter = aux(counter);
    return counter;
  }
}())


function increase(n) {
  return ++n;
}

function decrease(n) {
  return --n;
}

function getValue(n) {
  return console.log(n);
}

counter(increase)
counter(increase)
counter(getValue) // 2
```
무조건 즉시 실행 함수로 감싸주어야만 같은 실행 컨텍스트를 공유해 상태가 유지된다.

## 마무리하며

즉시 실행 함수가 이렇게 클로저와 밀접한 연관을 가지는 개념인지는 처음 알았다. 함수의 정의 위치에 따라 상위 스코프가 결정된다는 사실을 이렇게 이용해서 값을 은닉하는 데에 사용할 수 있다는 것이 신기할 따름이다!

클로저와 좀 친해진 것 같다 ㅎㅎ

## 참고

[JavaScript Deep Dive_ 이웅모](https://ebook-product.kyobobook.co.kr/dig/epd/ebook/E000002928532)

[MDN Web Docs_ Closure](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Closures)
