---
title: "프로퍼티 어트리뷰트"
date: "2025-11-28"
description: "객체 프로퍼티의 동작을 정의하는 프로퍼티 어트리뷰트를 알아보자."
tags: ["JavaScript"]
---

## 들어가며

프로퍼티 어트리뷰트는 **객체의 프로퍼티가 내부적으로 가지고 있는 메타데이터(프로퍼티의 성격을 결정하는 숨겨진 값들)**를 의미한다.

즉 **객체의 프로퍼티가 어떻게 동작해야 하는지를 정의하는 설정 값들**이다.

_프로토타입을 공부하다가 짚고 가야 할 것 같아서 넘어왔다!!_

_그리고 글을 작성하며 "속성값" 이라는 하나의 단어에 대해 "프로퍼티" 와 "속성값" 이라는 단어를 혼재하여 사용하기보다는 통일하는 것이 좋을 것 같아 **프로퍼티** 로 모두 통일해 작성했다! **프로퍼티 === 속성값**_

## 내부 슬롯과 내부 메서드

프로퍼티 어트리뷰트는 내부 슬롯에 저장되어 있기에 내부 슬롯과 내부 메서드에 대한 이해가 먼저 필요하다!

내부 슬롯과 내부 메서드는 자바스크립트 엔진의 구현 알고리즘을 설명하기 위해 ECMAScript 사양에서 사용하는 수도 프로퍼티와 수도 메서드이다.

> 과거 수도 코드 (pseudo code) 로 과제를 작성해 본 적이 있다. 수도코드는 컴퓨터가 실행할 수는 없으나 사람이 이해하기 쉽도록 일반 문장을 코드 형식으로 작성하는.. 자연어와 코드가 결합된 형태의 코드이다. 로직의 흐름을 설명함으로써 로직 설계에 도움이 된다. 수도 프로퍼티와 수도 메서드 또한 그와 비슷하게 자연어로 로직의 흐름을 설명하는 느낌이라고 생각하자.

![](https://velog.velcdn.com/images/yummjin/post/338569d5-3f25-4c4b-8a37-934b13735c4f/image.png)

이렇게 ECMAScript 사양에서 이중 대괄호로 감싼 이름들이 바로 내부 슬롯과 내부 메서드이다!

이 내부 슬롯과 내부 메서드는 **자바스크립트 엔진의 내부 로직**이기 때문에 원칙적으로 자바스크립트는 내부 슬롯과 내부 메서드에 직접적으로 접근하거나 호출할 수 있는 방법을 제공하지 않는다.

다만 일부 내부 슬롯과 내부 메서드에 한해서는 간접적으로 접근할 수 있는 수단을 제공한다.

`[[Prototype]]` 내부 슬롯은 `__proto__` 를 통해 간접적으로 접근할 수 있다.

## 프로퍼티 어트리뷰트

위에서도 언급했지만 프로퍼티 어트리뷰트는 **프로퍼티의 상태를 나타내는 데이터**이다. 

이런 프로퍼티의 상태는 
- **프로퍼티의 값`value`**
- **값의 갱신 가능 여부`writable`**
- **열거 가능 여부`enumerable`**
- **재정의 가능 여부`configurable`** 

등으로 이루어져 있다.

위의 네 가지 상태는 각각 상태 값을 담는 내부 슬롯 `[[Value]]`, `[[Writable]]`, `[[Enumerable]]`, `[[Configurable]]` 에 담겨 있다. 다른 상태들도 마찬가지로 상태의 이름을 가진 내부 슬롯에 상태값이 담겨있다.

내부 슬롯이므로 직접 이 값들에 접근할 수는 없지만 `Object.getOwnPropertyDescriptor` 메서드를 통해 간접적으로 확인할 수 있다.

```javascript
var o, d;

o = {
  get foo() {
    return 17;
  },
};
d = Object.getOwnPropertyDescriptor(o, "foo");
// { configurable: true, enumerable: true, get: /* getter 함수 */, set: undefined }

o = { bar: 42 };
d = Object.getOwnPropertyDescriptor(o, "bar");
// { configurable: true, enumerable: true, value: 42, writable: true }

o = {};
Object.defineProperty(o, "baz", {
  value: 8675309,
  writable: false,
  enumerable: false,
});
d = Object.getOwnPropertyDescriptor(o, "baz");
// { value: 8675309, writable: false, enumerable: false, configurable: false }
```

이렇게 예제 코드로 확인해볼 수 있다. `Object.getOwnPropertyDescriptor` 메서드는 프로퍼티 어트리뷰트 정보를 제공하는 **프로퍼티 디스크립터`PropertyDescriptor`** 객체를 반환한다.

## 데이터 프로퍼티와 접근자 프로퍼티

프로퍼티는 데이터 프로퍼티와 접근자 프로퍼티로 구분된다.

- 데이터 프로퍼티

데이터 프로퍼티는 **키와 값**으로 구성된 일반적인 프로퍼티이다.

- 접근자 프로퍼티

접근자 프로퍼티는 **자체적으로 값을 가지지 않고** 다른 데이터 프로퍼티의 **값을 읽거나 저장할 때 사용하는 접근자 함수**로 구성된 프로퍼티이다.

### 데이터 프로퍼티

데이터 프로퍼티가 가지는 프로퍼티 어트리뷰트는 다음과 같다.

- `[[Value]]` - `value`

프로퍼티 키를 통해 프로퍼티 값에 접근하면 반환되는 **값**이다.


프로퍼티 키를 통해 프로퍼티 값을 변경하면 `[[Value]]` 에 값을 재할당한다. 이때 프로퍼티가 없으면 프로퍼티를 동적 생성하고 생성된 프로퍼티의 `[[Value]]` 에 값을 저장한다.

---

- `[[Writable]]` - `writable`

프로퍼티 **값의 변경 가능 여부**를 나타내며 불리언 값을 갖는다.

`[[Writable]]` 의 값이 false 인 경우 해당 프로퍼티의 `[[Value]]` 의 값을 변경할 수 없는 읽기 전용 프로퍼티가 된다.

---

- `[[Enumerable]]` - `enumerable`

프로퍼티의 **열거 가능 여부**를 나타내며 불리언 값을 갖는다.

`[[Enumerable]]` 의 값이 false 인 경우 해당 프로퍼티는 `for ... in` 문이나 `Object.keys` 메서드 등으로 열거할 수 없다.

---

- `[[Configurable]]` - `configurable`

프로퍼티의 **재정의 가능 여부**를 나타내며 불리언 값을 갖는다.

`[[Configurable]]` 의 값이 false 인 경우 해당 프로퍼티의 삭제, 그리고 값의 변경이 금지된다. 단 `[[Writable]]` 이 true 인 경우 값의 변경과 writable을 false로 변경하는 것은 허용된다.

-> 재정의는 불가하지만 값의 변경은 가능한 경우 값 변경 또는 값 변경 가능 여부를 전환하는 것은 가능하다는 것

![](https://velog.velcdn.com/images/yummjin/post/b3848401-1fd1-4c9a-a056-5b6552e8497e/image.png)

이렇게 데이터 프로퍼티인 color 에 대해 `getOwnPropertyDescriptor` 를 실행했을 때 위에서 살펴봤던 네 가지 상태를 반환한다.

### 접근자 프로퍼티

접근자 프로퍼티가 가지는 프로퍼티 어트리뷰트는 다음과 같다.

- `[[Get]]` - `get`

접근자 프로퍼티를 통해 **데이터 프로퍼티의 값을 읽을 때 호출되는 접근자 함수**이다.

즉 접근자 프로퍼티 키로 프로퍼티 값에 접근하면 프로퍼티 어트리뷰트 `[[Get]]` 의 값, `getter` 함수가 호출되고 그 결과가 프로퍼티 값으로 반환된다.
![](https://velog.velcdn.com/images/yummjin/post/7bcb0508-365b-4d68-9227-f4f807dda4fc/image.png)

---

- `[[Set]]` - `set`

접근자 프로퍼티를 통해 **데이터 프로퍼티의 값을 저장할 때 호출되는 접근자 함수**이다.

즉 접근자 프로퍼티 키로 프로퍼티 값을 저장하면 프로퍼티 어트리뷰트 `[[Set]]` 의 값, `setter` 함수가 호출되고 그 결과가 프로퍼티 값으로 저장된다.

---
- `[[Enumerable]]` - `enumerable`

프로퍼티의 **열거 가능 여부**를 나타내며 불리언 값을 갖는다. (데이터 프로퍼티와 같음)

`[[Enumerable]]` 의 값이 false 인 경우 해당 프로퍼티는 `for ... in` 문이나 `Object.keys` 메서드 등으로 열거할 수 없다.

---

- `[[Configurable]]` - `configurable`

프로퍼티의 **재정의 가능 여부**를 나타내며 불리언 값을 갖는다. (데이터 프로퍼티와 같음)

### 예제 코드

```javascript

const person = {
  firstName: 'Yujin',
  lastName: 'Han',
  
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },
  
  set fullName(name) {
    [this.firstName, this.lastName] = name.split(' ');
  }
};
```

이 `person` 객체는 두 가지 데이터 프로퍼티와 두 가지 접근자 프로퍼티를 가진다. 

데이터 프로퍼티를 통해 값에 접근하면 다음과 같다.
```javascript
console.log(person.firstName + ' ' + person.lastName);
// Yujin han
```

그리고 접근자 프로퍼티를 통해 프로퍼티 값을 저장하고 참조해보자. 

이때 메서드(메서드도 데이터 프로퍼티이다)와 다른 점은 **프로퍼티 키를 통해 접근** 함으로써 바로 값을 읽거나 쓸 수 있다는 점이다. 

```javascript
/** setter 함수를 통한 값의 저장
* 접근자 프로퍼티에 값을 저장하면 setter 함수가 호출된다 */

person.fullName = 'Woohyuk Byun';
console.log(person);
// { firstName: 'Woohyuk', lastName: 'Byun' }

// getter 함수를 통한 값의 접근

console.log(person.fullName);
// 'Woohyuk Byun'
```

![](https://velog.velcdn.com/images/yummjin/post/64c2505a-f9bc-4ba6-b98a-eea64cda8e7d/image.png)

위 사진의 동작처럼 메서드를 사용해 값을 읽으려면 프로퍼티 키를 사용해 받아온 메서드를 실행시켜야 한다.

## 프로퍼티 정의

프로퍼티 정의란,

- **새로운 프로퍼티를 추가**하면서 **프로퍼티 어트리뷰트를 명시적으로 정의**하거나,
- **기존 프로퍼티**의 프로퍼티 어트리뷰트를 **재정의**

하는 것을 말한다.

`Object.defineProperty` 메서드를 통해 프로퍼티 어트리뷰트를 정의할 수 있다.

```javascript
const person = {};

Object.defineProperty(person, 'firstName', {
  value: 'Yujin',
  writable: true,
  enumerable: true,
  configurable: true
});

Object.defineProperty(person, 'lastName', {
  value: 'Han'
});
```

그리고 여러 개의 프로퍼티 어트리뷰트를 한 번에 정의하고자 할 때에는 `Object.defineProperties` 메서드를 사용하면 된다.

### 프로퍼티의 기본값

프로퍼티를 정의할 때 프로퍼티 디스크립터 객체에서 생략된 어트리뷰트는 다음과 같이 기본값이 정의된다.

![](https://velog.velcdn.com/images/yummjin/post/716ee39c-9e4c-47fc-872b-10d05dc63249/image.png)


## 객체 변경 방지

객체는 기본적으로 변경 가능한 값이기에, 재할당 없이 직접 변경할 수 있다. 프로퍼티를 추가하거나 삭제하고, 프로퍼티 값을 갱신하고, 프로퍼티 어트리뷰트를 재정의하는 모든 것이 가능하다.

이때 이런 객체의 **변경을 방지**하는 것도 가능하다. 자바스크립트는 객체의 변경을 방지하는 다양한 메서드를 제공하는데, 객체 변경 방지 메서드들은 객체의 변경을 금지하는 강도가 다르다.


| 구분 | 메서드 | 프로퍼티 추가 | 삭제 |값 읽기 | 값 쓰기 |어트리뷰트 재정의 |
| - | - | :-: | :-: | :-: | :-: | :-: |
| 객체 확장 금지 | `Object.preventExtensions` | X | O | O | O | O | 
| 객체 밀봉 | `Object.seal` | X | X | O | O | X | 
| 객체 동결 | `Object.freeze` | X | X | O | X | X | 

### 객체 확장 금지

`Object.preventExtensions` 에서드는 객체의 확장을 금지한다. 이때 객체 확장 금지란 말 그대로 “확장”, 즉 “값 추가 금지”. 프로퍼티 추가 금지를 의미한다.

**확장이 금지된 객체는 프로퍼티 추가가 금지**된다.

확장이 가능한 객체인지 여부는 `Object.isExtensible` 메서드로 확인할 수 있다.

### 객체 일본

`Object.seal` 메서드는 객체를 밀봉한다. “객체 밀봉“ 이란 약간 밀봉..? 포장해서 상자에 넣고 딱 봉한다! 이런 느낌이다. 사실 느낌이랑 특성이 잘 맞는지는 모르겠지만 **프로퍼티 추가 및 삭제와 프로퍼티 어트리뷰트 재정의가 금지**된다.

**밀봉된 객체는 읽기와 쓰기만 가능**하다.

밀봉된 객체인지 여부는 `Object.isSealed` 메서드로 확인할 수 있다.

### 객체 동결

`Object.freeze` 는 객체를 동결한다. 세 가지 메서드 중에서 가장 강렬하다. 아예 얼려 버리는 것이다. 따라서 **프로퍼티 추가 및 삭제, 어트리뷰트 재정의, 프로퍼티 값 갱신이 불가능**하다.

즉 **동결된 객체는 읽기만 가능**하다.

동결된 객체인지 여부는 `Object.isFrozen` 메서드로 확인할 수 있다.

### 불변 객체

위에서 살펴본 변경 방지 메서드들은 얕은 변경 방지를 통해 직속 프로퍼티만 변경이 방지되고 중첩 객체들까지는 영향을 주지 못한다고 한다.

```javascript
const person = {
  name: ‘Han’,
  address: { city: ‘Seoul’ }
};
```

내부의 `address` 데이터 프로퍼티로 가져올 수 있는 객체는 `Object.freeze(person)` 을 통해서 동결되지 않는다.

따라서 모든 중첩 객체까지 동결시키려면 **객체를 값으로 갖는 모든 프로퍼티에 대해 재귀적으로 `Object.freeze` 메서드를 호출**해야 한다는 점 유의하자!


## 참고

[자바스크립트 딥다이브 (이웅모)](https://www.yes24.com/product/goods/92742567)

[MDN Web Docs_ `Object.getOwnPropertyDescriptor`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)
