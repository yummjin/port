---
title: "프로토타입"
date: "2025-11-27"
description: "프로토타입에 대해 알아보자."
tags: ["JavaScript"]
---

## 들어가며

순서 없이 딥다이브를 공부하는 중인데 매번 객체 관련된 부분에서 프로토타입이 등장해 오늘은 프로토타입에 대해 알아보려 한다!

### 프로토타입의 사전적 의미
![](https://velog.velcdn.com/images/yummjin/post/8bf6b851-a266-48c2-9b5c-4478ba221854/image.png)
프로토타입은 사전적으로 "원형" "모델" "기본형" "견본" 과 같은 뜻을 가지고 있다. "원형", 즉 본이 되고 표준이 되는 것이 바로 프로토타입이다. 

### 자바스크립트와 객체지향

자바스크립트는 명령형, 함수형, 프로토타입 기반 객체지향 프로그래밍을 지원하고 있는 멀티 패러다임 프로그래밍 언어이다. 

이때 자바스크립트가 **객체지향 언어** 라는 점에서, C++나 Java와 같은 클래스 기반 객체지향 언어의 특징인 클래스와 상속, 캡슐화를 위한 키워드인 `public`, `private`, `protected` 등이 존재하지 않기에 자바스크립트는 객체지향 언어가 아니지 않나? 는 오해를 받는 경우가 있다는데..

하지만 자바스크립트는 ~클래스 기반~ 객체지향 프로그래밍 언어보다 효율적이며 더 강력한 객체지향 프로그래밍 능력을 지니고 있는 **프로토타입 기반 객체지향 프로그래밍 언어** 이다!

> ES6에서 자바스크립트에도 클래스가 도입되었다. 다만 기존 프로토타입 기반 객체지향 모델을 폐지하고 새로운 객체지향 모델을 제공하는 것은 아니고, 기존 프로토타입 기반 패턴을 더 쉽게 읽고 쓰기 위해 도입된 [syntatic sugar](https://ko.wikipedia.org/wiki/%EC%8B%A0%ED%83%9D%ED%8B%B1_%EC%8A%88%EA%B1%B0)이다.
>
> 다만 클래스와 생성자 함수의 동작에는 약간의 차이가 있다. 이 부분에 대해서는 클래스에 대해 알아보며 나중에 더 자세히 다뤄보자!

### 객체지향 프로그래밍

그럼 객체지향 프로그래밍은 무엇일까?

자바스크립트는 **객체 기반** 프로그래밍 언어이며 **자바스크립트를 이루고 있는 거의 모든 것이 객체** 이다. 원시 타입을 제외한 나머지 값들(함수, 배열, 정규 표현식 등)은 모두 객체라고 한다.

객체지향 프로그래밍은 프로그램을 명령어 또는 함수의 목록으로 보는 전통적인 **명령형 프로그래밍**의 절차지향적인 관점에서 벗어나 **여러 개의 독립적 단위, 즉 객체의 집합** 으로 프로그램을 표현하려는 프로그래밍 패러다임을 말한다.

이런 객체지향 프로그래밍은 실세계의 실체(사물이나 개념)를 인식하는 철학적 사고를 프로그래밍에 접목하려는 시도로부터 시작하는데, 이때 **실체**는 특성이나 성질을 나타내는 **속성** 을 가지고 있고, 이를 통해 실체를 인식하거나 구별할 수 있다.

![](https://velog.velcdn.com/images/yummjin/post/67c488c8-a599-45db-82a9-87f85ddfa26e/image.png)

이렇게 물질의 속성값 color, shape, type 을 구체적으로 표현하면 특정한 사물인 "사과" 를 다른 사물과 구분하여 인식할 수 있게 된다.

이러한 방식을 프로그래밍에 접목하여, 사과가 가진 다양한 특성 중 색상과 타입이라는 속성에만 관심이 있을 때 이런 특정한 속성만 간추려 내어 표현하는 것을 **추상화**라고 한다.

```javascript
const object = {
  color: "red",
  type: "fruit"
};
```

이렇게 **속성을 통해 여러 개의 값을 하나의 단위로 구성한 복합적인 자료구조를 객체**라고 하고, 이런 독립적인 객체들의 집합으로 프로그램을 표현하려는 것이 객체지향 프로그래밍이다.

이때 속성값으로는 객체의 상태값 뿐 아니라 객체의 상태 데이터를 조작하는 동작도 포함될 수 있다. 

```javascript
const object = {
  color: "green",
  type: "plant",
  changeColor(color) { 
    // 상태 데이터를 조작하는 동작
    this.color = color;
    return this.color;
  }
};
```

**객체의 상태 데이터는 프로퍼티**, **객체의 상태를 조작하는 동작은 메서드** 라고 한다!

### 객체지향 프로그래밍의 4가지 특징

이런 객체지향 프로그래밍은 4가지 특징을 가지고 있는데, 첫 번째는 앞서 언급한 **추상화** 이다.

두 번째는 **상속**, 세 번째는 **다형성**, 그리고 **캡슐화** 이다. 

이 내용에 대해서는 [여기](https://www.codestates.com/blog/content/%EA%B0%9D%EC%B2%B4-%EC%A7%80%ED%96%A5-%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D-%ED%8A%B9%EC%A7%95)서 더 잘 설명해주고 있어 참고하면 좋을 것 같다!

## 상속과 프로토타입

이제 본격적으로 프로토타입에 대해서 알아보자!

앞서 프로토타입은 자바스크립트의 객체지향 동작의 기반이 되는 것이라고 언급한 바 있다.

상속은 객체지향 프로그래밍의 4가지 특징 중 하나이며 **어떤 객체의 프로퍼티 또는 메서드를 다른 객체가 내려받아 그대로 사용할 수 있는 것**을 말한다.

자바에서는 클래스를 상속하면서 이 상속이라는 특징을 구현할 수 있다. 그럼 자바스크립트는 어떻게 상속을 구현할까?

```javascript
// 생성자 함수 Circle
function Circle(radius) {
  this.radius = radius;
  this.getArea = function () {
    return Math.PI * this.radius ** 2;
  };
}

const circle1 = new Circle(1);
const circle2 = new Circle(2);

/** Circle 생성자 함수는 인스턴스를 생성할 때마다
* 동일한 동작을 하는 getArea 메서드를 중복 생성
* 모든 인스턴스는 해당 메서드를 중복 소유하게 됨 
*
* getArea 메서드는 하나만 생성해서 
* 모든 인스턴스가 공유 사용하는 것이 바람직함
*/

console.log(circle1.getArea === circle2.getArea); // false
```

위 코드에서 생성자 함수는 동일한 프로퍼티 구조를 가지는 객체를 여러 개 생성할 때 유용하다.

하지만 위에서 간단하게 주석으로 설명한 대로, `Circle` 생성자 함수를 통해 생성되는 모든 인스턴스는 같은 동작을 하는 `getArea` 메서드를 중복 생성하여 중복 소유하게 된다.

![](https://velog.velcdn.com/images/yummjin/post/5012f8dc-6355-45b9-a99c-2375daeebe25/image.png)

이때 **상속**을 통해 불필요한 중복을 제거할 수 있다.

```javascript
// 생성자 함수 Circle
function Circle(radius) {
  this.radius = radius;
}

/** Circle 생성자 함수가 생성한 모든 인스턴스가
* getArea 메서드를 공유해서 사용할 수 있도록
* 프로토타입에 추가한다!
*
* 프로토타입은 Circle 생성자 함수의 prototype 프로퍼티에 바인드된다.
*/

Circle.prototype.getArea = function () {
  return Math.PI * this.radius ** 2;
};

// 인스턴스 생성
const Circle1 = new Circle(1);
const Circle2 = new Circle(2);

console.log(circle1.getArea === circle2.getArea); // true
```

생성자 함수의 `prototype` 프로퍼티에 상속시키고자 하는 메서드를 정의하면, 생성자 함수의 프로토타입에 해당 메서드를 추가할 수 있다.

![](https://velog.velcdn.com/images/yummjin/post/32cef805-77ba-4911-9357-484fe6304d91/image.png)

Circle 생성자 함수가 생성한 모든 인스턴스는 자신의 프로토타입 (`Circle.prototype`) 의 모든 프로퍼티와 메서드를 상속받는다.

이렇게 생성자 함수가 생성할 모든 인스턴스가 공통적으로 사용할 프로퍼티나 메서드를 프로토타입에 미리 구현해 두면 생성자 함수가 생성할 모든 인스턴스는 별도의 구현 없이 상위 객체인 프로토타입의 자산을 공유하여 사용할 수 있다!

## 프로토타입의 구조

모든 객체는 `[[Prototype]]` 이라는 내부 슬롯을 가지며, 이 내부 슬롯의 값은 프로토타입의 참조이다. 

_이때 `[[Prototype]]` 내부 슬롯의 값이 `null` 인 객체는 프로토타입이 없는 것이다)_

`[[Prototype]]` 에 저장되는 프로토타입은 객체 생성 방식에 의해 결정된다. **객체가 생성될 때 객체 생성 방식에 따라 프로토타입이 결정**되고 `[[Prototype]]` 에 저장된다.

`[[Prototype]]` 내부 슬롯의 값이 `null` 인 객체를 제외한 모든 객체는 하나의 프로토타입을 가진다. 그리고 모든 프로토타입은 생성자 함수와 연결되어 있다.

### `__proto__` 접근자 프로퍼티

모든 객체는 `__proto__` 접근자 프로퍼티를 통해 자신의 프로토타입, 즉 `[[Prototype]]` 내부 슬롯에 간접적으로 접근할 수 있다.

![](https://velog.velcdn.com/images/yummjin/post/a565bc58-93e7-4ddc-9fca-b17fe2a9e527/image.png)

이렇게 콘솔에서 임의로 객체를 만들어보면, `[[Prototype]]` 이라는 내부 슬롯이 존재하고 있음을 확인할 수 있다.

![](https://velog.velcdn.com/images/yummjin/post/ba7addbf-3902-447f-9830-0b36151c7591/image.png)

`[[Prototype]]` 내부 슬롯에는 `apple` 객체의 프로토타입인 `Object.prototype` 이 들어있는 것을 확인할 수 있다.

브라우저가 `__proto__` 접근자를 통해 `apple` 객체의 `[[Prototype]]` 내부 슬롯이 가리키는 객체인 `Object.prototype` 에 접근한 결과를 콘솔에 표시한 것이다.

이렇게 모든 객체는 `__proto__` 접근자 프로퍼티를 통해 내부 슬롯에 접근할 수 있다.

> 내부 슬롯/내부 메서드에 대해서는 [이 글](https://velog.io/@yummjin/JavaScript-%ED%94%84%EB%A1%9C%ED%8D%BC%ED%8B%B0-%EC%96%B4%ED%8A%B8%EB%A6%AC%EB%B7%B0%ED%8A%B8#%EB%82%B4%EB%B6%80-%EC%8A%AC%EB%A1%AF%EA%B3%BC-%EB%82%B4%EB%B6%80-%EB%A9%94%EC%84%9C%EB%93%9C)을 참고!!

그리고 접근자 프로퍼티는 getter와 setter 함수를 통해 `[[Prototype]]` 내부 슬롯의 값(프로토타입)을 취득하거나 할당한다.

![](https://velog.velcdn.com/images/yummjin/post/9d37fde7-48e5-4b33-94fb-e0127b4ca877/image.png)

`__proto__` 를 통해서 `object` 의 프로토타입을 취득했고, `object.__proto__ = parent` 를 통해 `object` 객체의 프로토타입을 교체(새로 할당)했다. `object` 객체는 `x` 라는 프로퍼티를 속성받게 되었다.

![](https://velog.velcdn.com/images/yummjin/post/ab55913f-f39b-454c-847b-d603ae8ba700/image.png)

### 왜 접근자 프로퍼티를 통해 접근할까?

프로토타입에 접근하기 위해 위에서 살펴본 것과 같이 접근자 프로퍼티를 사용하는 이유는 **상호 참조**에 의해 **프로토타입 체인**이 생성되는 것을 방지하기 위해서라고 한다.

![](https://velog.velcdn.com/images/yummjin/post/b2629018-433d-42cd-8279-35d4c41dc50e/image.png)

이 예제에서는 `parent` 객체를 `child` 객체의 프로토타입으로 설정한 후, `child` 객체를 `parent` 객체의 프로토타입으로 설정하려 하고 있다.

위에서는 에러가 발생했지만, 만약 이런 코드가 에러 없이 정상적으로 처리되면 서로가 자신의 프로토타입이 되는.. **비정상적인 프로토타입 체인**이 만들어진다.

![](https://velog.velcdn.com/images/yummjin/post/0482c07d-a6e2-4164-9ba0-44f7f5567edf/image.png)

> 서로가 서로의 프로토타입이 되면 왜 비정상적인가?

이렇게 순환 참조하는 프로토타입 체인이 만들어지면, 프로토타입의 종점이 존재하지 않아 프로퍼티를 검색할 때 **무한 루프**에 빠진다고 한다.

그래서 `__proto__` 접근자 프로퍼티를 통해 검사 후에 프로토타입을 교체할 수 있도록! 일종의 guard를 해둔 것이다.

### `__proto__` 를 코드 내에서 사용하지 마세요

ES5까지는 비표준이었으나, ES6부터 `__proto__` 접근자는 표준이 되어 대부분의 브라우저가 이를 지원하고 있다. 

하지만 **모든 객체가 `__proto__` 를 사용할 수 있는 것은 아니**기에 접근자 프로퍼티를 직접 사용하는 것은 권장하지 않는다고 한다.

직접 상속을 통해 `Object.prototype` 을 상속받지 않는 객체를 생성할 수도 있다.

![](https://velog.velcdn.com/images/yummjin/post/5c6b3a6f-352d-4068-b6df-f24f24f3e87b/image.png)

_오 신기하당 ,,,,,_

[`Object.getPrototypeOf`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf) 메서드와 [`Object.setPrototypeOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf) 메서드를 통해 프로토타입을 취득하고 조작하자!

## 프로토타입 체인

자바스크립트는 객체의 프로퍼티에 접근하려 할 때 해당 객체에 접근하려는 프로퍼티가 없다면 `[[Prototype]]` 내부 슬롯의 참조를 따라 **자신의 부모 역할을 하는 프로토타입의 프로퍼티를 순차적으로 검색**한다. 이를 프로토타입 체인이라고 하고, 프로토타입 체인은 자바스크립트가 객체지향 프로그래밍의 상속을 구현하는 매커니즘이다!

![](https://velog.velcdn.com/images/yummjin/post/e1378d2d-03e9-4358-9024-3bf9bad1809d/image.png)

![](https://velog.velcdn.com/images/yummjin/post/9127f3b9-f449-4515-95fb-15b6f221c419/image.png)

`me` 객체에서 `hasOwnProperty` 메서드를 사용하면 이렇게 그림에서 볼 수 있듯이 내부 슬롯의 참조를 따라 위로 올라가며 검색한다.

이때 `Object.prototype` 은 **프로토타입 최상위에 위치하는 객체**이다! 그래서 **프로토타입 체인의 종점**이라고 한다.

> 참고로 식별자를 검색하는 매커니즘은 **스코프 체인**이다.
![](https://velog.velcdn.com/images/yummjin/post/233160b6-1545-47ea-a2c3-c5914b52bd61/image.png)
이렇게 함수의 중첩 관계로 이루어진 스코프의 계층적 구조에서 식별자를 검색하게 된다.


## 오버라이딩과 프로퍼티 섀도잉

오버라이딩은 상위 클래스가 가지고 있는 메서드를 **하위 클래스가 재정의**해서 사용하는 방식이다. (자바에도 있음.. 수업 들을때 시험에 나옴) 참고로 오버로딩은 이름만 동일하고 매개변수는 다른 메서드를 구현하고 매개변수를 통해 메서드를 구별해서 호출하는 방식이다~,, _자바스크립트는 오버로딩을 지원하지 않지만 `arguments` 객체를 통해서 구현할 수는 있다는 점~_

프로퍼티 섀도잉은 자식 인스턴스에서 부모의 프로토타입에 있는 프로퍼티와 동일한 이름의 프로퍼티를 정의했을 때 오버라이딩되어 **부모의 프로퍼티가 가려지는** 현상을 이야기한다.


## 직접 상속

위에서 [`Object.create`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/create) 메서드를 사용해 아무런 프로토타입도 상속받지 않는 객체를 만들 수 있음을 언급했다.

![](https://velog.velcdn.com/images/yummjin/post/5c6b3a6f-352d-4068-b6df-f24f24f3e87b/image.png)

이렇게 `Object.create` 메서드를 사용해 객체를 생성할 때에는 **명시적으로 프로토타입을 지정**해서 객체에 프로토타입을 **직접 상속**해 주어야 하는데, 이것이 직접 상속이다. 명시적으로 지정한 프로토타입이 없다면 아무런 프로토타입을 상속받지 않는 객체를 생성할 수 있다.

`Object.create` 메서드는 두 가지 매개변수를 가진다.

- 첫 번째 매개변수는 생성할 객체의 프로토타입으로 지정할 객체이다. **필수**
- 두 번째 매개변수는 생성할 객체의 프로퍼티 키와 프로퍼티 디스크립터 객체로 이루어진 객체 (진짜 객체) 이다. **옵셔널**

```javascript
Object.defineProperties(object1, {
  property1: {
    value: 42,
    writable: true,
  },
  property2: {},
});
```

두 번째 매개변수는 `Object.defineProperties` 메서드의 두 번째 매개변수와 같다.

코드를 통해 살펴보자. 

![](https://velog.velcdn.com/images/yummjin/post/cfb1e1e4-57de-42f8-b699-59386ce619a0/image.png)

첫 번째 매개변수에 `Object.prototype` 을 전달해 `apple` 객체가 그를 상속받을 수 있도록 했고, 두 번째 매개변수를 통해 `apple` 객체의 [프로퍼티를 정의](https://velog.io/@yummjin/JavaScript-%ED%94%84%EB%A1%9C%ED%8D%BC%ED%8B%B0-%EC%96%B4%ED%8A%B8%EB%A6%AC%EB%B7%B0%ED%8A%B8#%EB%8D%B0%EC%9D%B4%ED%84%B0-%ED%94%84%EB%A1%9C%ED%8D%BC%ED%8B%B0)했다. 

### 직접 상속의 장점

이런 직접 상속 방식으로 객체를 생성할 때에는 객체를 생성하면서 직접적으로 상속을 구현하게 된다. **첫 번째 매개변수의 프로토타입 체인에 속하는 객체를 생성**하게 되는 것이다.

이 방식은 다음과 같은 장점을 가지고 있는데,

- `new` 연산자 없이도 객체 생성이 가능
- 프로토타입을 지정하면서 객체 생성 가능
- 객체 리터럴에 의해 생성된 객체도 상속받을 수 있음

### 객체 리터럴 내부에서 `__proto__` 에 의한 직접 상속

`Object.create` 메서드에 의한 직접 상속은 상속에 있어서는 편리하지만 프로퍼티를 정의하는 방식에서 번거로움이 있다.

![](https://velog.velcdn.com/images/yummjin/post/9e3480ac-fda6-403c-b32b-61dd43f85e67/image.png)
_번거롭다..._

ES6에서는 `Object.create` 메서드 말고 객체 리터럴 내부에서 `__proto__` 접근자 프로퍼티를 사용해 직접 상속을 구현할 수 있다.

![](https://velog.velcdn.com/images/yummjin/post/d4d3445b-c001-4090-9ff5-3b2e0ea274fc/image.png)

진짜 편리하다!!! 앞으로 상속할 일이 있으면 이렇게 사용하지 않을까 싶다

## 정적 프로퍼티와 메서드

정적 프로퍼티와 메서드는 **생성자 함수로 인스턴스를 생성하지 않아도 참조 및 호출할 수 있는 프로퍼티와 메서드**이다.

![](https://velog.velcdn.com/images/yummjin/post/c062d2f5-1e55-491e-9468-909e5a9b2eab/image.png)

앞서 살펴본 `Object.create` 도 `Object` 생성자 함수의 정적 메서드라는 점~

![](https://velog.velcdn.com/images/yummjin/post/de404b49-4bc5-47a9-810e-a962fede2ee0/image.png)

이렇게 생성자 함수가 소유한 자신의 프로퍼티 및 메서드를 정적 프로퍼티/메서드 라고 한다.


## 참고

[자바스크립트 딥다이브 (이웅모)](https://www.yes24.com/product/goods/92742567)
