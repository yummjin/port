---
title: "Symbol 타입 알아보기"
date: "2025-11-20"
description: "Symbol 타입에 대해 알아보자."
tags: ["JavaScript"]
---

## 들어가며

초기 자바스크립트에는 문자열(string), 숫자, boolean, undefined, null, 객체까지 총 6가지 타입만이 존재했다. 이후 ES6에서 `Symbol` 이라는 7번째 데이터 타입이 등장하게 되었다고 한다. 

사실 `Promise` 객체를 살펴본 뒤 `async/await` 를 살펴보려 했는데 제네레이터 -> 이터레이터 -> 심볼로 궁금한 부분이 거슬러 올라가서 심볼부터 파헤쳐 보고자 `Symbol` 을 먼저 알아보게 되었다 ^^

## `Symbol` 은 무엇일까?

![](https://velog.velcdn.com/images/yummjin/post/a223a4e3-b3eb-4b4a-96a2-1b169489af1a/image.png)

영어 사전에 심볼이라는 단어를 검색하면 "상징" 이라는 뜻을 첫 번째로 가지고 있음을 알 수 있다. 이런 뜻과 같이 심볼은 **고유함이 보장되는**, **다른 값과 중복되지 않는** 어떤 하나에 대한 상징과도 같은 유일무이한 값이다.

주로 유일한 프로퍼티에 대한 키를 만들기 위해 사용된다고 한다.


## `Symbol` 생성하기

이런 심볼 값은 `Symbol` 함수를 호출해야만 생성할 수 있다.

```javascript
const exampleSymbol = Symbol();
console.log(typeof exampleSymbol); // symbol
```
이렇게 생성한 심볼 값은 다른 값과 절대 겹치지 않는 **유일무이한 값**이다.
그리고 변경 불가능한 [**원시 값**](https://developer.mozilla.org/ko/docs/Glossary/Primitive)이다.

`new` 연산자와 함께 생성자 함수 또는 클래스를 호출해 객체를 생성하는 것과는 달리 심볼 값은 변경 불가능한 원시 값이라는 것이다.

### `Symbol` 값에 대한 설명 지정하기

`Symbol` 함수에는 문자열을 인수로 전달할 수도 있다. 이때 문자열은 생성된 심볼 값에 대한 설명으로 **값 생성에는 어떠한 영향도 주지 않**는다. **심벌 값에 대한 설명이 같더라도 생성된 심벌 값은 유일무이한 값**이다!

```javascript
const sym1 = Symbol('sym');
const sym2 = Symbol('sym');

console.log(sym1 === sym2); // false
```

### `Symbol` 값의 Wrapper 객체

문자열, 숫자, 불리언과 같이 객체처럼 접근하면 암묵적으로 Wrapper 객체를 생성한다고 한다.
`description` 프로퍼티와 `toString` 메서드는 `Symbol.prototype` 의 프로퍼티이다.

```javascript
const sym1 = Symbol('sym');

console.log(sym1.description); // 'sym'
console.log(sym1.toString()); // Symbol(sym)
```

그리고 심벌 값의 경우 암묵적으로 문자열이나 숫자 타입으로 변환되지 않지만, **불리언 타입으로는 암묵적으로 타입 변환**된다! 따라서 `if` 문 등에서 존재 확인이 가느하다고 한다.

## 전역 `Symbol` 레지스트리

전역 `Symbol` 레지스트리는 자바스크립트 엔진이 관리하는 심볼 값 저장소이다. 이 저장소에는 특정 문자열을 키로 가지는 심볼 값들이 존재한다.

![](https://velog.velcdn.com/images/yummjin/post/05ae0035-12f5-47f2-a654-8dd053b07af4/image.png)
위 그림은 해시 테이블에 대한 설명이지만, 이런 방식으로 전역 심볼 레지스트리에 해당하는 심볼 값들이 저장되어 있다고 이해하면 좋을 것 같아 넣어봤다 ㅎㅎ


다만 위에서 심볼 값을 생성할 때 사용했던 `Symbol` 함수를 사용해 생성한 심볼 값은 이 전역 심볼 레지스트리에 등록되어 관리되지 않는다. **심벌 값과 매칭되는 키를 지정할 수 없기 때문**이다.

이런 전역 심볼 레지스트리에 특정 문자열을 키로 가지는 심볼 값을 등록하고 검색하기 위해서는 `Symbol.for` 메서드와 `Symbol.keyFor` 메서드를 사용할 수 있다.

### `Symbol.for` 메서드

이 메서드를 사용하면 애플리케이션 전역에서 중복되지 않는 유일무이한 상수인 심볼 값을 단 하나만 생성해 전역 심볼 레지스트리를 통해 공유할 수 있다.

```javascript
const sym1 = Symbol.for('ajax'); // 아자스!!...
```

위와 같이 `Symbol.for` 메서드를 사용하면 설정해준 ajax라는 키로 지정된 심볼 값을 가져오게 된다. 만약 ajax라는 키로 저장된 심볼 값이 없다면 새로운 심볼 값을 생성한다!

### `Symbol.keyFor` 메서드

그리고 이렇게 전역 심볼 레지스트리에 등록한 심볼값에 대한 키값은 `Symbol.keyFor` 메서드를 사용해 가져올 수 있다.

```javascript
Symbol.keyFor(sym1); // ajax
```

위에서 ajax라는 키로 저장한 심볼 값인 `sym1` 을 `Symbol.keyFor` 메서드에 넘겨 해당 심볼의 키값인 ajax를 반환받았다!

## `Symbol` 의 사용 예시

### 상수
![](https://velog.velcdn.com/images/yummjin/post/688baa75-f5c7-4bde-ae40-7f0667b57d62/image.png)

```javascript
const Rapper = {
  PH1: 123123,
  SWINGS: 456456,
  HASHSWAN: 789789
};

const nominee = Rapper.PH1;

if (nominee === Rapper.PH1) return console.log('후보자 피에이치원!!');
```

위 예시와 같이 값에는 특별한 의미가 없고 (다른 값과의 구분을 위해 사용, id같은 느낌) 상수 이름 자체에 의미가 있는 경우가 있다. 이때 123123, 456456 과 같은 값으로 무작위로 지정할 수 있지만 다른 변수 값과 중복될 여지가 있고 변경될 수도 있다. 이때 중복 또는 변경될 가능성이 없는 유일무이한 심벌 값을 사용할 수 있다.

```javascript
const Rapper = {
  PH1: Symbol('ph1'),
  SWINGS: Symbol('swings'),
  HASHSWAN: Symbol('hashswan')
};
```

> 자바스크립트의 상위 개념인 [타입스크립트에 존재하는 이넘(Enum)](https://joshua1988.github.io/ts/guide/enums.html#%EC%9D%B4%EB%84%98-enum)은 Symbol을 사용해 구현된다! 이넘은 위에서 예시로 살펴본 객체와 비슷하게 특정 값들의 집합을 의미하는 자료형이다. 정확히 말하자면 명명된 숫자 상수에 대한 집합으로, 열거형이라고 부른다. 자바스크립트에서 이넘을 구현하려면 객체의 변경을 방지하기 위해 객체를 동결하는 [`Object.freeze`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) 메서드와 심볼 값을 사용한다고 한다.

### 프로퍼티 키

객체의 프로퍼티 키는 빈 문자열을 포함한 모든 문자열 그리고 심볼 값으로 만들 수 있으며, 동적으로 생성할 수도 있다. 심볼은 유일무이한 값이므로 심볼로 프로퍼티 키를 만들면 다른 프로퍼티 키와 절대 충돌하지 않는 프로퍼티를 만들 수 있다!

### 프로퍼티 은닉

심볼 값을 프로퍼티 키로 사용해 생성한 프로퍼티는 `for ... in` 문이나 `Object.keys` , `Object.getOwnPropertyNames` 메서드를 통해 찾을 수 없다고 한다. 이를 이용해 심볼 값을 프로퍼티 키로 사용해 외부에 노출할 필요가 없는 프로퍼티를 은닉하는 것도 가능하다.

```javascript
const obj = {
  [Symbol('mySymbol')]: 1
};

for (const key in obj) {
  console.log(key); // 아무것도 출력되지 않는다
}

console.log(Object.keys(obj)); // []
console.log(Object.getOwnPropertyNames(obj)); // []
```

다만 ES6에서 도입된 [`Object.getOwnPropertySymbols`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols) 메서드를 사용하면 심볼 값을 프로퍼티 키로 사용하여 생성한 프로퍼티를 찾을 수 있다고 한다.

### 표준 빌트인 객체 확장

표준 빌트인 객체에 사용자 정의 메서드를 직접 추가하여 확장하는 것은 기본적으로 권장되지 않는다.

```javascript
Array.prototype.sum = function () {
  return this.reduce((acc, cur) => acc + cur, 0);
};

[1, 2].sum(); // 3
```

개발자가 직접 추가한 메서드와 미래에 표준 사양으로 추가될 메서드의 이름이 중복될 가능성이 있기 때문이다. 표준 빌트인 메서드를 사용자 정의 메서드가 덮어쓴다면 문제가 된다.

하지만 심볼 값은 유일무이한 값으로 중복될 가능성이 없기에 이를 사용해 표준 빌트인 객체를 확장하면 기존 키들은 물론 미래에 추가될 수 있는 어떠한 프로퍼티 키와도 충돌할 위험이 없기에 안전하게 표준 빌트인 객체를 확장할 수 있다!

```javascript
Array.prototype.[Symbol.for('sum')] = function () {
  return this.reduce((acc, cur) => acc + cur, 0);
};

[1, 2].[Symbol.for('sum')](); // 3
```

## 잘 알려진 `Symbol` (Well-known Symbol)

`Symbol` 함수의 프로퍼티에는 자바스크립트가 기본 제공하는 빌트인 심볼 값들이 할당되어 있다.

![](https://velog.velcdn.com/images/yummjin/post/757a4f1e-9b78-4775-92e9-a1973e78632d/image.png)

이런 심볼 값들은 Well-known Symbol 이라 부르며 자바스크립트 엔진의 내부 알고리즘에 사용된다.

`Array` , `String` , `Map` , `Set` 등과 같이 `for ... of` 문으로 순회 가능한 빌트인 이터러블은 Well-known Symbol 인 `Symbol.iterator` 를 키로 갖는 메서드를 가지며 `Symbol.iterator` 메서드를 호출하면 이터레이터를 반환하도록 ECMAScript 사양에 규정되어 있다고 한다. 이 규정은 이터레이션 프로토콜로, 바로 다음 글에서 살펴볼 이터러블 그리고 프로토콜과 관련되어 있는데.. 아무튼 빌트인 이터러블은 이 규정을 준수한다.

이터레이션 프로토콜을 준수하면 다음과 같이 일반 객체를 사용자 정의 이터러블로 정의하여 이터러블처럼 동작하도록 구현해 사용할 수 있다.

```javascript
const iterable = {
  // Symbol.iterator 메서드 구현을 통해 이터러블 프로토콜을 준수하는 사용자 정의 이터러블 구현
  [Symbol.iterator]() {
    let cur = 1;
    const max = 5;
    // Symbol.iterator 메서드는 next 메서드를 소유한 이터레이터를 반환한다!
    return {
      next() {
        return { value: cur++, done: cur > max + 1 };
      }
    };
  }
};

for (const num of iterable) {
  console.log(num); // 1 2 3 4 5
}
```

이를 통해 알 수 있는 것은 심벌은 중복되지 않는 상수 값을 생성하는 것은 물론이고 기존에 작성된 코드에 영향을 주지 않고 새로운 프로퍼티를 추가하기 위해 도입되었다는 것이다!!


## 참고


[자바스크립트 딥다이브 (이웅모)](https://www.yes24.com/product/goods/92742567)

[MDN docs_ `Symbol`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Symbol)

[MDN docs_ `Object.getOwnPropertySymbols()`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols)

[MDN docs_ `Object.freeze`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)
