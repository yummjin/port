---
title: "this 톺아보기"
date: "2025-12-11"
description: "this에 대해 자세히 알아보자."
tags: ["JavaScript"]
---

## 들어가며

생성자 함수를 살펴보며 `this` 를 많이 사용했다. 안 짚고 넘어가면 `this` 가 서운해..

## `this` 가 뭘까요?

`this` 는 특정 객체의 메서드에서 사용하는 **자신이 속한 객체를 가리키는 식별자**이다.

**자신이 속한 객체**또는 **자신이 생성할 인스턴스**를 가리키는 **자기 참조 변수**이다.

### 왜 필요한가요?

`this` 가 없다면..

객체 리터럴 방식으로 생성한 객체의 경우 메서드 내부에서 자신이 속한 객체를 가리키는 식별자를 사용해 재귀적으로 참조할 수 있다.

```javascript
const circle = {
  radius: 5,
  getDiameter() {
    return 2 * circle.radius;
  }
};
```

코드를 평가하는 과정에서 선언문이 먼저 실행되어 스코프에 등록되고, 런타임에서 `circle` 식별자에 객체가 바인딩된다.

이후`getDiameter` 가 호출되는 시점에서는 객체가 생성되었기 때문에 위처럼 작성하더라도 오류는 발생하지 않는다.

하지만 자기 자신이 속한 객체를 재귀적으로 참조하는 방식은 **생성자 함수에서는 불가능**하다.

```javascript
function Circle(radius) {
  ????.radius = radius;
}
```

생성자 함수는 미래에 자신이 생성할 인스턴스를 가리켜야 한다. 생성자 함수를 정의하는 시점에서는 아직 인스턴스가 생성되지 않았다.

따라서 이렇게 **자기 자신이 속한 객체 또는 자신이 생성할 인스턴스를 가리키는 특수한 식별자인 `this`**가 필요하다.

### `this` 의 생성

`this` 는 자바스크립트 엔진에 의해 암묵적으로 생성되며, 코드 어디서든 참조할 수 있다.

함수를 **호출**하면 `arguments` 객체와 `this` 가 암묵적으로 함수 내부에 전달된다.

이때 **`this` 가 가리키는 값은 함수 호출 방식에 의해 동적으로 결정**된다! (이렇게 결정되는 것을 **`this` 바인딩**이라고 한다)

### 다른 언어에서의 `this`

자바나 C++ 같은 클래스 기반 언어에서 `this` 는 언제나 클래스가 생성하는 인스턴스를 가리킨다. 하지만 위에서도 언급했듯 자바스크립트에서는 함수가 호출되는 방식에 따라 동적으로 결정된다.

## 함수 호출 방식과 `this` 바인딩

그럼 함수 호출 방식과 각각 `this` 에 어떤 값이 바인딩되는지 알아보자.

- **일반 함수 호출**
```javascript
foo()
```
일반적인 방식으로 함수를 호출했을 때,
`this` 는 전역 객체 `window` 를 나타낸다.
(브라우저 환경)

- **메서드 호출**
```javascript
const obj = { foo };
obj.foo();
```
프로퍼티 값으로 할당된 함수,
즉 메서드를 호출했을 때,
`this` 는 메서드를 호출한 객체 `obj` 를 가리킨다.

- **생성자 함수 호출**
```javascript
new foo()
```
`new` 연산자와 함께 생성자 함수로 호출했을 때,
`this` 는 생성자 함수가 생성한 인스턴스를 가리킨다.

- **`Function.prototype.apply/call/bind` 메서드에 의한 간접 호출**
```javascript
const bar = { name: 'bar' };

foo.call(bar);
foo.apply(bar);
foo.bind(bar)();
```
아래에서도 살펴보겠지만 이 메서드들은 `this` 를 지정해주는 메서드들이라 인수로 넘기는 객체를 `this` 로 가진다.

### 일반 함수 호출

전역 함수는 물론이고 중첩 함수를 일반 함수로 호출하면 `this` 에는 전역 객체가 바인딩된다.

일반 함수에서는 `this` 를 사용할 일이 없다시피 하기 때문에(객체나 생성자 등에서 자기참조를 위해 사용하므로), strict mode를 사용하면 일반 함수로 호출했을 때 `this` 에 `undefined` 를 바인딩한다.

콜백 함수의 경우에도 모두 전역 객체를 `this` 로 가지게 되기 때문에 일반 함수로 호출하면서 `this` 바인딩을 상위 함수와 같게 가져가고 싶다면 뒤에서 더 자세히 살펴볼 `Function.prototype.apply/call/bind` 메서드를 사용할 수 있다.

아니면 이렇게 변수에 할당해서 넘겨주는 방법도 있다만..
```javascript
var value = 1;

const obj = {
  value: 100,
  foo() {
    const that = this;
    
    setTimeout(function () {
      console.log(that.value);
    }, 100);
  }
};
```
> 아니면 화살표 함수를 사용하는 방법도 있다!

### 메서드 호출

**메서드를 호출한 객체**가 `this` 에 바인딩된다.

메서드를 **소유한 객체가 아닌 호출한 객체**임에 주의해야 한다.

특정 객체에서 `this` 를 가지고 정의한 메서드를 다른 객체의 메서드에 할당한 뒤 다른 객체를 호출하면

최초로 정의한 객체가 아닌 **그 메서드를 호출한 객체**를 가리킨다.

이는 프로토타입 메서드 내부에서 사용된 `this` 도 마찬가지이다. 

![](https://velog.velcdn.com/images/yummjin/post/5b97552b-8d27-4930-85b7-cd8a304bf44f/image.png)

### 생성자 함수

생성자 함수에서는 **미래에 생성할 인스턴스**를 가리킨다.

## `Function.prototype.apply/call/bind` 메서드를 통한 간접 호출

### `apply/call` 메서드

`apply` 와 `call` 메서드는 인자로 두 가지를 받는다.
- `this` 로 사용할 객체
- 본래 함수에게 전달할 인수들

여기서 두 함수의 차이점은 두 번째 매개변수인 **본래 함수에게 전달할 인수들의 방식**이다. 이것 외에 두 함수는 동일하게 동작한다.

`apply` 메서드의 경우 인수를 **배열로 묶어서 전달**한다.
`call` 메서드의 경우 인수를 **쉼표로 구분한 리스트 형식**으로 전달한다.

![](https://velog.velcdn.com/images/yummjin/post/6924fdb5-ae47-4651-acbb-32184f36beea/image.png)

### `bind` 메서드

`bind` 메서드는 하나의 인자를 받는다.
- `this` 로 사용할 객체

그리고 인자로 받은 객체를 `this` 로 바인딩한 함수를 반환한다. 따라서 

```javascript
Array.prototype.slice.call(arguments, 0, 1);
Array.prototype.slice.apply(arguments, [0, 1]);
Array.prototype.slice.bind(arguments)(0, 1);
```
이렇게 사용하면 모두 같게 동작한다.

### 용도

이런 간접 호출은 프로토타입 체인에 존재하지 않는 메서드를 사용할 때 유용하다.

예를 들어 위에서 예시로 사용한 `arguments` 객체는 함수 내부에서 지역 변수처럼 사용되는 객체인데, 유사 배열 객체이다. 

따라서 `Array.prototype` 의 메서드들을 사용할 수 없는데, 간접 호출을 통해 `this` 에 `arguments` 를 바인딩해주면 배열의 메서드들을 사용할 수 있다.

또한 일반 함수로 호출한 콜백 함수에 `this` 를 명시적으로 지정해줄 때 유용하다.

![](https://velog.velcdn.com/images/yummjin/post/ecc5b456-8ab9-465f-99b2-38478a2fefc2/image.png)

(화살표 함수를 사용하면 `bind` 를 사용하지 않아도 된다)

## 참고

[자바스크립트 딥다이브 (이웅모)](https://www.yes24.com/product/goods/92742567)
