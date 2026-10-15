---
title: "객체와 프로토타입"
date: "2025-12-10"
description: "객체와의 관계에 초점을 맞춰 프로토타입을 파헤쳐보자."
tags: ["JavaScript"]
---

## 들어가며

요번 글은 "객체" 와의 관계성에 중점해 프로토타입을 샅샅히 파헤쳐보는 글이다!

## 객체에서의 프로토타입 

### 함수 객체의 `prototype` 프로퍼티

이 내용은 [함수 객체를 살펴보며](https://velog.io/@yummjin/JavaScript-%EC%9D%BC%EA%B8%89-%EA%B0%9D%EC%B2%B4%EC%99%80-%ED%95%A8%EC%88%98-%ED%86%BA%EC%95%84%EB%B3%B4%EA%B8%B0#prototype-%ED%94%84%EB%A1%9C%ED%8D%BC%ED%8B%B0) 이미 보았던 내용이다!

생성자 함수가 자신이 생성할 인스턴스에게 물려줄 프로토타입이 함수 객체의 `prototype` 프로퍼티이다. 따라서 생성자 함수로서 호출할 수 없는 non-constructor 함수는 이 프로퍼티를 소유하지 않는다.

`__proto__` 접근자 프로퍼티와 `prototype` 프로퍼티는 결국 동일한 프로토타입을 가리키지만 사용하는 주체가 다르다 (각각 객체, 생성자 함수) 는 것을 알고 가면 좋을 것 같다.

### 프로토타입의 `constructor` 프로퍼티

![](https://velog.velcdn.com/images/yummjin/post/a59cd20a-4abc-4145-b2b8-e610bac0072e/image.png)

프로토타입에 있는 `constructor` 프로퍼티는 반대로 해당 인스턴스를 생성한 생성자 함수를 가리킨다.

이 연결은 **생성자 함수가 생성될 때**(함수 객체가 생성될 때)이루어진다.

![](https://velog.velcdn.com/images/yummjin/post/6040b28a-84c7-44d6-9552-72c328894fb1/image.png)

`constructor` 또한 상속받기 때문에 명수 객체도 `YesIcanDo` 생성자 함수에 `constructor` 프로퍼티를 통해 접근할 수 있다.

![](https://velog.velcdn.com/images/yummjin/post/a3fda424-90b6-4a37-8445-2e99cd522862/image.png)

![](https://velog.velcdn.com/images/yummjin/post/3153b76b-ddec-441a-bca7-671484b6238b/image.png)

### 리터럴 표기법에 의해 생성된 객체의 생성자 함수

그럼 리터럴 표기법에 의해 생성된 함수는 어떨까?

![](https://velog.velcdn.com/images/yummjin/post/c085b9f5-f59a-4204-8dca-c1ca932ffca3/image.png)

`object` 객체는 `Object` 생성자 함수를 통해 생성되지 않았는데도 `constructor` 프로퍼티로는 `Object` 생성자 함수와 연결되어 있다. 

> **왜일까!**


## 객체의 생성 방식


ECMAScript 표준을 통해 객체가 어떻게 생성되는지 확인해 보자.

![](https://velog.velcdn.com/images/yummjin/post/7a4a0d98-1285-4a83-8c6c-8feee7d740fb/image.png)

`Object` 생성자 함수를 통해 객체를 생성하게 되면 다음과 같은 일이 발생한다.

### `new` 연산자와 함께 호출

> `const obj = new Object()`

`new` 연산자와 함께 호출되었을 경우 `OrdinaryCreateFromConstructor` 추상 연산을 호출하며 두 번째 인자에 `Object.prototype` 을 넘기며 객체를 만들게 된다.

![](https://velog.velcdn.com/images/yummjin/post/80d416e1-19e4-4ea2-91c9-efb192e6cd49/image.png)

이때 `OrdinaryCreateFromConstructor` 는 `constructor.prototype` 을 기반으로 객체의 `[[Prototype]]` 을 설정하고, 필요하면 내부 슬롯을 추가해서 최종 객체를 생성하는 내부 연산이다.

따라서 생성자인 `Object` 함수의 프로토타입인 `Object.prototype` 을 `[[Prototype]]` 으로 가지고, 내부 슬롯 리스트는 기본값으로 가지는 새로운 객체를 만들어 반환한다.

### `new` 없이, 인자도 없이 호출

> `const obj = Object()`

`new` 연산자 없이 일반 함수처럼 호출하며 인자에 아무 값도 넘기지 않았을 때이다.

![](https://velog.velcdn.com/images/yummjin/post/0688d442-a5c0-4953-807e-4c7ca0018c87/image.png)

이때는 `OrdinaryObjectCreate` 라는 추상 연산을 통해 객체가 만들어진다.

![](https://velog.velcdn.com/images/yummjin/post/ee5086b7-1bbd-4b62-b59c-a59c8dc9380f/image.png)

`OrdinaryObjectCreate` 는 인자를 `[[Prototype]]` 으로 가지는 새로운 객체를 만들고 필요한 슬롯들을 붙여 반환하는 기본 객체 생성 알고리즘이다. 

![](https://velog.velcdn.com/images/yummjin/post/492ea10d-59af-4aec-9dbe-039169b00060/image.png)

### 인자와 함께 호출

인자와 함께 호출되었을 경우에는 래퍼 객체를 인자에 감싸서 반환한다.

![](https://velog.velcdn.com/images/yummjin/post/40643e0c-f665-40a4-8f08-52827a841bf9/image.png)

### 객체 리터럴의 평가

객체 리터럴이 평가될 때에는 `OrdinaryObjectCreate` 가 호출되어 빈 객체를 생성하고 프로퍼티를 추가하도록 정의되어 있다.

![](https://velog.velcdn.com/images/yummjin/post/4a2f67eb-0b5b-46a1-80d2-8aaebff7672e/image.png)

이렇게 `OrdinaryObjectCreate` 를 통해 빈 객체를 생성하는 방식은 동일하지만 `new.target` 의 확인이나 프로퍼티를 추가하는 처리와 같이 세부 내용은 다른 것을 확인할 수 있다.

### 결론

객체 리터럴 방식과 생성자를 사용한 방식은 객체가 생성되는 데 있어서 세부적으로 다르게 구현되어 있지만, **프로토타입은 생성자 함수와 함께 생성되어 언제나 쌍으로 존재**하기 때문에 프로토타입을 공유하게 되면 생성자 함수 또한 공유하게 된다는 결론을 내릴 수 있다.

![](https://velog.velcdn.com/images/yummjin/post/1c7164d4-8ba8-4190-81e9-bfaca5e4a9bc/image.png)


## 프로토타입의 생성 시점

위에서 다양한 내용을 살펴보며 생성자 함수와 프로토타입의 연결은 **생성자 함수가 생성되는 시점**이라는 것을 살펴보았다. 이 내용이 꽤나 중요하다! 계속 책에서도 강조를 하고 초식동물마냥 되새김질 하는 것을 보면..

> **생성자 함수와 프로토타입의 연결은 생성자 함수가 생성되는 시점에 이루어진다!**

비유를 들어보자면 우리 부모님이 태어나실 때 우리에게 물려줄 유전자가 생성된다...? 는 느낌.. 하지만 객체를 생성하는 방식은 다양하니까.. 다른 예시를 들어보자면

슬라임이라는 장난감이 개발되면서 그 특성이 생겨났다. 다른 많은 공장에서 슬라임을 만들 수 있지만 이들은 모두 동일한 슬라임이라는 특성을 공유한다. 여기서 슬라임은 생성자 함수 그리고 특성은 프로토타입 정도로 생각하면 될 듯하다...

객체의 생성 방식도 여러가지지만, 생성자 함수 또한 빌트인 생성자 함수와 사용자 정의 생성자 함수 두 가지로 나뉜다. 종류별로 프로토타입의 생성 시점을 살펴보자.

### 사용자 정의 생성자 함수

사용자 정의 생성자 함수는 함수 정의가 평가되어 **함수 객체를 생성하는 시점에 프로토타입이 생성**된다. 

![](https://velog.velcdn.com/images/yummjin/post/d96c9ce0-4673-46d4-8a10-4f9cd960fe70/image.png)

함수 정의가 평가되어 함수 객체가 생성된 이후에 `console.log` 함수가 작동하기 때문에(함수 선언문으로 작성되어 호이스팅된다) `Person` 사용자 정의 생성자 함수의 프로토타입이 잘 출력되고 있는 것을 확인할 수 있다.

### 빌트인 생성자 함수

`Object`, `String`, `Number`, `Function` 과 같은 빌트인 생성자 함수도 일반함수 마찬가지로 **생성자 함수가 생성되는 시점에 프로토타입이 생성** 되는데, 이 모든 빌트인 생성자 함수는 **전역 객체가 생성되는 시점**에 생성된다.

## 프로토타입의 교체

프로토타입은 다른 객체로 변경하는 것이 가능하다. 즉 객체 간의 상속 관계를 동적으로 변경할 수 있다는 것이다. 이런 교체는 생성자 함수 또는 인스턴스에 의해 이루어질 수 있다.

### 생성자 함수에서 프로토타입 교체하기

![](https://velog.velcdn.com/images/yummjin/post/a9f231d6-f0f2-47e7-92b7-c24d55c069cd/image.png)

생성자 함수의 `prototype` 프로퍼티에 객체 리터럴을 할당해주며 직접 프로퍼티를 교체했다. 특정 인스턴스의 프로퍼티가 아닌 **생성자 함수가 앞으로 생성할 객체의 프로토타입을 교체**한 모습이다.

그런데 여기서 중요한 것은 
![](https://velog.velcdn.com/images/yummjin/post/b3afcabf-87b4-4aa5-9573-b60e13cfaee2/image.png)

`constructor` 를 통해 `Person` 생성자 함수와의 연결이 끊어져서 콘솔에 보이지 않고 있다!

![](https://velog.velcdn.com/images/yummjin/post/e385c381-9e86-46c6-8cc5-f1b70ca1910a/image.png)

이렇게 프로토타입을 교체하면 `constructor` 를 통한 연결이 파괴되기 때문에, 교체할 때 직접 `constructor` 프로퍼티에 생성자 함수를 명시해 주어야 한다.

### 인스턴스에서 프로토타입 교체하기

이번에는 특정 인스턴스에서 프로토타입을 교체해보자. 인스턴스의 `__proto__` 접근자 프로퍼티 또는 `Object.getPrototypeOf` 그리고 `Object.setPrototypeOf` 메서드를 통해 프로토타입에 접근해 특정 인스턴스의 프로토타입을 교체해줄 수 있다.

이런 교체 시에도 마찬가지로 `constructor` 를 통한 생성자 함수 연결이 끊어지기에 연결을 원한다면 반드시 명시해주어야 한다.

### 하지만

이렇게 `constructor` 를 통한 연결도 끊어지고 생성한 뒤에 할당을 통해서 교체를 해줘야 하는 점이 꽤나 번거롭기에 책에서는 프로토타입을 직접 교체하는 것보다는 [**직접 상속**](https://velog.io/@yummjin/JavaScript-%ED%94%84%EB%A1%9C%ED%86%A0%ED%83%80%EC%9E%85#%EC%A7%81%EC%A0%91-%EC%83%81%EC%86%8D) 또는 **클래스**를 사용하라고 권하고 있다.

## 프로토타입을 통한 객체 식별

### `instanceof` 연산자

`instanceof` 연산자는

- 좌변에 **객체를 가리키는 식별자**
- 우변에 **생성자 함수를 가리키는 식별자** (함수가 아닌 경우 typeError)

를 피연산자로 받는다. 

`instanceof` 연산자를 사용하면 **좌변 객체의 프로토타입 체인 속에 우변 생성자 함수의 `prototype` 이 존재하는지 여부**를 평가할 수 있다.

![](https://velog.velcdn.com/images/yummjin/post/eff43cab-6533-43cd-99d7-1c1a2a3ae1ef/image.png)

따라서 위에서 살펴본 프로토타입 교체를 통해 프로토타입을 교체해주면

![](https://velog.velcdn.com/images/yummjin/post/0d2f81f6-7cd7-4234-a557-3a39039486c4/image.png)

콘솔에는 여전히 Person 이라고 뜨긴 하지만, `Person.prototype` 이 `me` 객체의 프로토타입 체인 상에 존재하지 않기 때문에 `false` 가 반환된다.

그리고 여기서 좀 유의할 점은 `constructor` 프로퍼티와 생성자 함수 간의 연결이 파괴되어도 **생성자 함수의 `prototype` 프로퍼티와 프로토타입 간의 연결은 파괴되지 않기에 `instanceof` 는 영향을 받지 않는다는 점**이다.

![](https://velog.velcdn.com/images/yummjin/post/71c19ced-8bd8-40ad-a797-cdfe733af61c/image.png)

### `in` 연산자

`in` 연산자를 사용하면 **객체 내부에 특정 프로퍼티가 존재하는지 여부**를 확인할 수 있다.

![](https://velog.velcdn.com/images/yummjin/post/bfbf673d-8429-4b6f-94ca-8ad5b9140fa0/image.png)


대상 객체의 프로퍼티 뿐 아니라 상속받은 프로토타입의 모든 프로퍼티를 확인한다. 사진에서도 순서대로 객체의 프로퍼티, `Person.prototype` 의 프로퍼티, `Object.prototype` 의 프로퍼티를 확인하고 있다.

> 동일하게 동작하는 `[Reflect](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Reflect).has` 메서드도 있다. ES6부터 도입되었다.
![](https://velog.velcdn.com/images/yummjin/post/d04a80b3-c330-44c0-b8c3-43504b2c9bc1/image.png)

> 그리고 대상 객체의 프로퍼티만 확인하고 싶다면 `Object.prototype.hasOwnProperty` 를 사용하면 된다.
![](https://velog.velcdn.com/images/yummjin/post/038b528e-b2f2-4df3-9be4-3bf1020420bc/image.png)


### `for ... in` 을 통한 프로퍼티 열거

`for ... in` 문을 사용하면 객체의 모든 프로퍼티를 순회하며 열거한다.

![](https://velog.velcdn.com/images/yummjin/post/a5efa3be-274e-4287-81d3-a7bc1e08c724/image.png)

`Object.prototype` 의 프로퍼티들은 열거하지 않음을 알 수 있는데, 이는 `Object.prototype` 의 프로퍼티들이 `enumerable` 하지 않기 때문이다. (열거 불가능)

![](https://velog.velcdn.com/images/yummjin/post/75be36ee-2b9a-44b3-b51b-2e42a440ee8d/image.png)

열거 불가능한 프로퍼티를 이렇게 정의해 주면 마찬가지로 `for ... in` 문을 통해 가져오지 못하는 것을 확인할 수 있다.

### `Object.keys`/`values`/`entries` 메서드

**객체 자신의 고유 프로퍼티만** 다루고 싶을 때에는 이 정적 메서드들을 사용하는 것이 적절하다. 상속받은 프로퍼티가 포함될 수도 있기 때문에..

- `Object.keys` 메서드는 자신의 `enumerable` 한 프로퍼티 키를 배열로 반환한다.
- `Object.values` 메서드는 자신의 `enumerable` 한 프로퍼티 값을 배열로 반환한다.
- `Object.entries` 메서드는 자신의 `enumerable` 한 프로퍼티 **키와 값의 쌍**의 배열을 배열로 반환한다.

![](https://velog.velcdn.com/images/yummjin/post/b9f6a4ab-0d93-4f03-8e99-d7a06a743035/image.png)

## 마무리하며

방대하던 프로토타입의 개념에 대해 드디어 좀 정리가 끝났다. 원래 하나로 정리하고자 하는데 두 편이나 작성하게 되었다.

프로토타입은 생성자 함수와 굉장히 밀접한 영향을 맺고 있다. 그래서 생성자 함수, 인스턴스의 생성, 인스턴스의 프로퍼티에 관해서도 짚고 넘어가다 보니 내용이 많아진 것 같다.

결국 중요한 것은 **프로토타입은 생성자 함수가 생성될 때 함께 탄생**하며, **항상 쌍으로 존재**한다는 것이다. 웹개발을 하면서 이런 프로토타입을 자주 사용할 일이 있을지는 (라이브러리 구현이나 오픈소스 기여 등이면 몰라도) 잘 모르겠지만 구조가 확실하게 이해된 것 같아서 나름 뿌듯하다.

누군가 자바스크립트를 묻거든 고개를 들어 도마뱀을 읽으라 하라..

![](https://velog.velcdn.com/images/yummjin/post/ac4c97b6-aa6c-470b-9058-1c8d9c9ecb17/image.png)


## 참고

[자바스크립트 딥다이브 (이웅모)](https://www.yes24.com/product/goods/92742567)

[ECMAScript_Object](https://tc39.es/ecma262/#sec-object-objects)
