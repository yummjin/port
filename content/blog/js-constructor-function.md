---
title: "생성자 함수를 통해 객체 생성하기"
date: "2025-12-02"
description: "생성자 함수로 객체를 생성하는 방식은 리터럴과 어떻게 다를까?"
tags: ["JavaScript"]
---

## 들어가며

객체 생성 방법에는 여러 가지가 있다고 하는데, 여태까지는 직접 리터럴을 통해 생성하는 방식을 주로 사용해왔다. 생성자 함수를 통해 객체를 생성하는 방식은 이와 어떻게 다르고 어떤 식으로 동작하는지 자세히 살펴보자!

## 생성자 함수란?

생성자 함수란 **`new` 연산자와 함께 호출하여 객체를 생성**하는 함수를 말한다. 

생성자 함수에 의해 생성된 객체를 **인스턴스**라 한다.

### `Object` 생성자 함수

`new Object();` 과 같이 `new` 연산자와 함께 `Object` 생성자 함수를 호출하면 빈 객체가 생성되어 반환된다. 이렇게 빈 객체를 생성한 이후 프로퍼티 또는 메서드를 추가해 객체를 완성할 수 있다.

![](https://velog.velcdn.com/images/yummjin/post/9b97ce92-a073-4631-9c2f-e56a22feb53d/image.png)

### 다양한 빌트인 생성자 함수

자바스크립트는 `Object` 생성자 함수 외에도 `String` , `Number` , `Boolean` , `Function` , `Array` , `Date` , `RegExp` , `Promise` 등 다양한 빌트인 생성자 함수를 제공한다.

### 하지만..

객체를 생성하는 방법은 객체 리터럴을 사용하는 것이 더 간편하다. 책에서도 _특별한 이유가 없다면 그다지 유용해 보이지 않는다._ 라고 언급하고 있다.

> `const person = { name: 'Park' }` 과 같이 직접 키와 값을 명시하는 방식이 객체 리터럴 방식이다

## 객체 리터럴 방식과의 비교

### 객체 리터럴 방식의 문제점

객체 리터럴 방식은 직관적이고 간편하지만 **단 한 개의 객체만 생성한다는 문제점**을 가지고 있다. 

따라서 동일한 프로퍼티를 가지는 객체를 여러 개 생성해야 하는 경우 매번 같은 프로퍼티를 기술해야 하기 때문에 비효율적이다.

```javascript
const circle1 = {
  radius: 5,
  getDiameter() {
    return 2 * this.radius;
  }
};

console.log(circle1.getDiameter()); // 10

const circle2 = {
  radius: 10,
  getDiameter() {
    return 2 * this.radius;
  }
};

console.log(circle1.getDiameter()); // 20
```

위 코드에서 `circle1` 과 `circle2` 객체는 프로퍼티 구조가 동일하다. 객체 고유의 상태를 나타내는 데이터 프로퍼티인 `radius` 의 값은 다르지만 `getDiameter` 메서드는 완전히 동일하다.

### 생성자 함수 방식의 장점

생성자 함수를 통해 객체를 생성하면 위와 같은 단점을 완벽하게 해결할 수 있다.

```javascript
function Circle(radius) {
  // 생성자 함수 내부의 this는 생성자 함수가 생성할 인스턴스이다
  this.radius = radius;
  // 매개변수를 인스턴스의 속성에 할당
  this.getDiameter = function () {
    return 2 * this.radius;
  };
}

const circle1 = new Circle(5);
const circle2 = new Circle(10);
```

> 이때 **생성자 함수를 정의하는 방식이 일반 함수와 동일**하다는 것을 확인할 수 있다. **`new` 연산자와 함께 호출되면 정의된 함수는 생성자 함수로 동작**하고, `new` 연산자와 함께 호출하지 않으면 일반 함수로 동작한다.

사실 이런 식으로 동일한 프로퍼티 구조를 가지는 객체를 생성할 때면 항상 객체를 반환하는 함수를 만들어 사용했던 것 같다.

### 객체를 반환하는 Factory Function과의 비교

Factory Function은 위에서 말한 대로 객체를 반환하는 함수이다.

`Circle` 생성자 함수를 Factory Function으로 나타내면 다음과 같다.

```javascript
function createCircle(radius) {
  return {
    radius,
    getDiameter() { return radius * 2; }
  };
}
```

생성자 함수와 `new` 연산자를 사용해 객체를 생성하면 프로토타입 기반 상속과 함께 객체가 생성된다는 장점이 있다. 다음 글에서 알아보겠지만 (안 그래도 프로토타입 공부하다 연결연결해서 생성자로 왔다) 프로토타입을 통해서 메서드를 공유하면 메모리 절약에 용이하다.

하지만 복잡한 `this` 의 복잡한 스코프 구조를 이해하고 사용해야 하기 때문에 헷갈릴 수 있으며 함수형 패턴에 비해 유연성이 떨어질 수 있다. 그리고 Factory Function 이 함수형 패턴에 더 부합하다고 한다.

그래서 우리 지피티는 객체가 많이 생성되는 경우가 아니라면 Factory Function의 사용을 오히려 더 권장했다..

무튼!

## 생성자 함수의 동작

### 인스턴스 생성 과정

생성자 함수는 프로퍼티 구조가 동일한 인스턴스를 생성하기 위한 템플릿과 같다.

생성자 함수를 통해 인스턴스를 생성하면

1. 인스턴스를 생성하고
2. 생성된 인스턴스를 초기화(인스턴스 프로퍼티 추가 및 초기값 할당) 

하게 된다.

생성자 함수 내부 코드를 살펴보면 `this` 에 프로퍼티를 추가하고 필요에 따라 전달된 인수를 프로퍼티의 초기값으로 할당하며 인스턴스를 초기화하는 것을 확인할 수 있다.

인스턴스를 생성하고 반환하는 코드는 보이지 않는데, 자바스크립트 엔진은 **암묵적인 처리를 통해 인스턴스를 생성하고 반환**한다. 

그럼 암묵적인 처리 과정에서는 어떤 일이 벌어질까?


> **1. 인스턴스 생성과 `this` 바인딩**

생성자 함수를 `new` 연산자와 함께 호출하면 **암묵적으로 빈 객체가 생성**된다.

![](https://velog.velcdn.com/images/yummjin/post/f29ca168-c48c-48c4-b025-b559d8885118/image.png)

그리고 이렇게 암묵적으로 생성된 빈 객체는 생성자 함수 내부의 `this` 에 바인딩된다.

![](https://velog.velcdn.com/images/yummjin/post/305824be-82b6-4917-a501-53cfe1641509/image.png)


이 두 과정은 **함수 몸체의 코드가 한 줄씩 실행되는 런타임 이전에 실행**된다. (바인딩 후에 함수의 몸체 코드가 실행되기 때문에 위에서 콘솔에 `this` 에 바인딩된 빈 객체가 찍히는 것을 확인할 수 있다)

> **2. 인스턴스 초기화**

이렇게 인스턴스 생성과 `this` 바인딩이 완료되면 생성자 함수에 기술되어 있는 코드가 한 줄씩 실행되며 `this` 에 바인딩되어 있는 인스턴스를 초기화한다.

이때 이 과정은 선택적으로 이루어진다. 즉 개발자가 생성자 함수에 아무런 초기화 로직을 작성하지 않았다면 초기화 과정은 일어나지 않고 인스턴스가 생성된다.

![](https://velog.velcdn.com/images/yummjin/post/c9d999e9-8649-4ae5-8087-588c374fae5f/image.png)

> **3. 인스턴스 반환**

생성자 함수 내부에서 모든 처리가 끝나면 `this` 를 암묵적으로 반환한다.

다만 명시적으로 객체를 반환하면 이 암묵적 `this` 반환이 무시되기 때문에 **생성자 함수 내부에서는 `return` 문을 반드시 생략**해야 한다!

## 생성자 함수의 구조

### 내부 메서드 `[[Call]]` 과 `[[Construct]]`

**함수도 객체**이지만 일반 객체와는 다르다. **호출할 수 있다.**

이렇게 일반 객체와 달리 함수로서 동작하기 위해 함수 객체만을 위한 `[[Environment]]` , `[[FormalParameters]]` 등의 내부 슬롯과 `[[Call]]`, `[[Construct]]` 같은 내부 메서드를 가지고 있다.

위에서 함수는 일반적인 함수로서 호출할 수도 있고, `new` 연산자와 함께 생성자 함수로서 호출할 수도 있다고 언급했는데,

**일반 함수로서 호출되면 `[[Call]]`** 이 호출되고, **`new` 연산자와 함께 생성자 함수로서 호출되면 `[[Construct]]`** 가 호출된다.

![](https://velog.velcdn.com/images/yummjin/post/da916dc4-14de-4114-ab34-9075384d09c8/image.png)

이때,

- 내부 메서드 `[[Call]]` 을 가지는 함수 객체 -> **Callable** (호출할 수 있는 객체, 즉 함수)

  호출할 수 없는 객체는 함수 객체가 아니므로, 함수로서 기능하는 객체는 모두 콜러블(Callable)이어야 한다.

- 내부 메서드 `[[Construct]]` 를 갖는 함수 객체 -> **Constructor** (생성자 함수로서 호출할 수 있는 함수)
- `[[Construct]]` 를 가지지 않는 객체 -> **Non-Constructor** (생성자 함수로서 호출할 수 없는 함수)

로 구분되며 아래와 같은 관계를 가진다.

![](https://velog.velcdn.com/images/yummjin/post/d160c3e1-b89c-4104-afa7-ff4605883894/image.png)

### constructor와 non-constructor

그럼 constructor와 non-constructor는 어떻게 구분될까?

자바스크립트 엔진은 함수 객체를 생성할 때 함수 정의 방식에 따라 이를 구분짓는다.

- constructor: 함수 선언문, 함수 표현식, 클래스 (클래스도 함수이다)
- non-constructor: 메서드 (ES6 메서드 축약 표현), 화살표 함수

![](https://velog.velcdn.com/images/yummjin/post/e356d3ac-f7dc-4d6d-805f-785079324d6a/image.png)

_고마워요 스피드웨건!_

constructor인 일반 함수를 `new` 연산자와 함께 호출하는 실수에 주의하라고 한다!

### `new` 연산자

생성자 함수는 `new` 연산자와 만났을 때 `[[Construct]]` 가 호출되며 생성자 함수로 동작한다.

> _내가 그의 이름을 new와 함께 불러주기 전에는 그는 다만 하나의 함수에 지나지 않았다._
>
>_내가 그를 new와 함께 불러주었을 때, 그는 새로운 객체가 되었다._ ;; ...

![](https://velog.velcdn.com/images/yummjin/post/77393864-1390-4973-99b4-c724a9a03fea/image.png)

그리고 `new` 가 없이 일반 함수로서 생성자 함수가 호출되면, 함수 내부의 `this` 는 새로운 인스턴스가 아닌 전역 객체 `window` 를 가리키게 된다. 따라서 새로운 인스턴스를 초기화하는 로직이 동작하면 전역 객체의 프로퍼티와 메서드가 된다.

> 생성자 함수는 일반적으로 첫 문자를 대문자로 기술하는 Pascal Case로 명명하여 일반 함수와 구별할 수 있도록 노력한다.

### `new.target`

Pascal Case를 통해 다른 방식으로 함수를 명명하더라도 실수는 언제나 발생할 수 있기에.. ES6에서는 `new.target` 을 지원한다. (IE에서는 지원하지 않는다)

`new.target` 은 `this` 와 유사하게 constructor인 모든 함수 내부에서 암묵적인 지역 변수와 같이 사용되며 **메타 프로퍼티**라고 부른다.

함수에서 `new.target` 을 사용하면 **함수가 `new` 연산자와 함께 생성자 함수로서 호출되었는지를 확인 가능**하다!

```javascript
function Circle(radius) {
  if (!new.target) {
    return new Circle(radius);
  }
  // ...
}
```

`new` 연산자와 함께 호출되었다면 `new.target` 은 함수 자신을 나타낸다. `new` 연산자 없이 일반 함수로서 호출되었다면 `new.target` 은 `undefined` 이다. 

따라서 이를 확인해 `new` 연산자와 함께 호출되지 않았다면 다시 `new` 연산자와 함께 재귀 호출을 통해 생성자 함수로서 호출할 수 있다.

대부분의 빌트인 생성자에는 이런 `new.target` 을 통한 처리가 되어 있어 `new` 연산자 없이 호출해도 동일하게 작동한다고 한다!

![](https://velog.velcdn.com/images/yummjin/post/ad1a4372-47f2-4446-8958-bd6d854df669/image.png)


## 참고

[자바스크립트 딥다이브 (이웅모)](https://www.yes24.com/product/goods/92742567)

[향상된 객체 리터럴](https://joshua1988.github.io/es6-online-book/enhanced-object-literals.html#%EA%B8%B0%EC%A1%B4-%EA%B0%9D%EC%B2%B4-%EC%A0%95%EC%9D%98-%EB%B0%A9%EC%8B%9D)
