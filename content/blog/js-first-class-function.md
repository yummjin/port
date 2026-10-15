---
title: "일급 객체와 함수 톺아보기!"
date: "2025-12-04"
description: "일급 객체를 통해 함수에 대해 자세히 알아보자."
tags: ["JavaScript"]
---

## 들어가며

생성자 함수를 알아보며 함수의 내부 메서드와 함수 객체 그 자체에 대해 살짝 알아본 바 있다. 오늘은 일급 객체에 대해 알아보며 함수에 대해 더 자세히 알아보는 시간을 가져보자..

## 일급 객체

일급 객체는 무엇일까?

일급 객체는 프로그래밍 언어에서 **값처럼 자유롭게 다룰 수 있는 객체**를 말한다. 

근데 이 부분에서 조금 혼란스러웠다. 그럼 일급 객체와 그냥 객체는 다른 개념일까? 아니면 일급 객체는 객체의 한 종류인가? 

찾아보니 일급 객체는 **객체의 한 종류**가 맞았다. 일급 객체는 객체가 얼마나 자유롭게 다뤄질 수 있는지에 대한 용어였던 것이다. 그럼 일급 객체가 아닌 객체는 어떤 것이 있을까?

자바스크립트와 같은 현대 언어에서는 거의 모든 객체(또는 값)를 일급으로 취급하기 때문에 이 개념이 제대로 다가오지 않았던 것이다.

다른 구형 프로그래밍 언어인 C언어의 함수는 변수에 할당도 불가능하고, 반환값이 될 수도 없는데 이런 부분이 일급 객체가 아닌 객체의 예시가 되고 있는 것을 획인할 수 있었다.

### 자바스크립트의 일급 객체

자바스크립트에서는 다음과 같은 조건을 만족하는 객체를 일급 객체라고 한다.

- 무명의 리터럴로 생성할 수 있다 (런타임 생성 가능)
- 변수나 자료구조(배열이나 객체 등)에 저장할 수 있다
- 함수의 매개변수에 전달할 수 있다
- 함수의 반환값으로 사용될 수 있다

### JS 함수는 일급 객체

그리고 자바스크립트의 함수는 위의 조건을 모두 만족하는 일급 객체이다. 결국 위에서 다룬 내용과 종합하면, 자바스크립트에서 함수는 다른 값들과 동일하게 자유롭게 사용될 수 있다는 것이다.

다만 다른 객체들과의 차이점은 **호출 가능**하다는 것이다. 또한 **일반 객체에는 없는 함수 고유의 프로퍼티**를 소유한다.


## 함수 객체의 프로퍼티

이렇게 함수는 객체이기에 다른 객체들처럼 프로퍼티를 가질 수 있다.

브라우저에서 console.dir 함수를 사용하면 함수 객체의 내부를 살펴볼 수 있다.

![](https://velog.velcdn.com/images/yummjin/post/d11d0627-4956-46f2-a47e-582b19ec55e7/image.png)

보면 `length` `name` `prototype` `argument` `caller` 프로퍼티가 존재하는 것을 확인할 수 있다.

### `arguments` 프로퍼티

첫 번째로 살펴볼 `arguments` 프로퍼티는 **함수 호출 시 전달된 인수들의 정보를 담고 있는 순회 가능한(이터러블) 유사 배열 객체**이다.

![](https://velog.velcdn.com/images/yummjin/post/1c40f46b-39fa-4019-99fd-317f8e00e13a/image.png)

아래와 같이 함수 내부에서 `arguments` 객체를 통해 접근할 수 있는 값과 동일하다.

![](https://velog.velcdn.com/images/yummjin/post/5c58fd28-522f-49dd-8475-bee0abbb7266/image.png)

함수 객체의 `arguments` 프로퍼티는 현재 **일부 브라우저에서만 지원**하고 있고, ES3부터 표준에서 폐지되었기에 `Function.arguments` 와 같은 (위에서 사용한) 사용법은 권장되지 않고, 함수 내부에서 지역 변수처럼 사용할 수 있는 `arguments` 객체를 참조하는 것이 권장된다.

위 사진에서 두 개의 매개변수를 받는 `multiply` 함수에 아무런 인수를 전달하지 않았음에도 오류가 발생하지 않은 것을 확인할 수 있다. **자바스크립트는 함수의 매개변수와 인수의 개수가 일치하는지 확인하지 않는다.** 따라서 매개변수 개수만큼 인수를 전달하지 않아도 에러가 발생하지 않는 것이다.

> 선언된 매개변수보다 **인수를 적게 전달**했을 경우

함수가 호출되면 함수의 몸체 내부에서 암묵적으로 매개변수가 선언되고 `undefined` 로 초기화된 이후 인수가 할당되기 때문에, 인수의 개수가 더 적다면 그대로 `undefined` 인 상태로 유지한다.

![](https://velog.velcdn.com/images/yummjin/post/5df67173-ceab-45af-9757-00f4b4e0f5ba/image.png)

> 선언된 매개변수보다 **인수를 더 많이 전달**했을 경우

전달된 인수 중 초과된 인수는 무시된다.

![](https://velog.velcdn.com/images/yummjin/post/68d46513-06d3-4240-ad40-5976ea117f6b/image.png)

하지만 `arguments` 객체의 프로퍼티에는 모든 인수가 보관된다. 위 사진에서 `arguments` 객체에는 3개의 인수가 모두 저장되어 있음을 확인할 수 있다.

> **`callee`** 프로퍼티

글자 그대로 **부른 이**를 나타낸다. `multiply` 함수에서는 `arguments` 객체를 부른 이, 즉 생성한 함수인 함수 자신을 가리킨다.

![](https://velog.velcdn.com/images/yummjin/post/a39594fe-a652-47cc-b9f0-ea3279dc1490/image.png)

_그리고 `arguments` 객체에는 익숙한 `Symbol.iterator` 가 보인다. 이전에 [이터러블](https://velog.io/@yummjin/JavaScript-%EC%9D%B4%ED%84%B0%EB%9F%AC%EB%B8%94-%ED%86%BA%EC%95%84%EB%B3%B4%EA%B8%B0#%EC%82%AC%EC%9A%A9%EC%9E%90-%EC%A0%95%EC%9D%98-%EC%9D%B4%ED%84%B0%EB%9F%AC%EB%B8%94%EC%9D%84-%EB%A7%8C%EB%93%A4%EC%96%B4%EB%B3%B4%EC%9E%90)에 대해 살펴보며 `Symbol.iterator` 를 프로퍼티 키로 가지는 메서드에서 result 객체를 반환하는 `next` 메서드가 있을 때 유사 배열 객체는 이터러블이 된다는 점을 확인한 바 있다! `arguments` 는 그래서 이터러블이다. 하지만 **배열이 아니므로 배열 메서드를 사용하면 에러가 발생하니 주의!**_

> **`arguments`** 는 어디에 쓰이나요?

**매개변수 개수를 확정할 수 없는 가변 인자 함수**를 구현할 때 유용하다! 하지만 우리는 typescript를 쓰고 항상 매개변수 개수를 확정짓는 경우가 많지만..

```javascript
function sum() {
  let res = 0;
  
  for (let i = 0; i < arguments.length; i++) {
    res += arguments[i];
  }
  
  return res;
}
```

### `caller` 프로퍼티

위에서 보았던 `callee` 프로퍼티와 비슷하게 자신을 부른 이를 나타내는 프로퍼티인데, ECMAScript 사양에 포함되지 않은 비표준 프로퍼티라고 한다.

### `length` 프로퍼티

함수 객체에서 `length` 프로퍼티는 함수를 정의할 때 선언한 매개변수의 개수를 나타낸다. 

위에서 보았던 `arguments` 객체의 `length` 프로퍼티는 **인자의 수** 이고, 함수의 `length` 프로퍼티는 **매개변수의 수** 이기에 두 프로퍼티의 값은 항상 같지 않을 수 있다. 

![](https://velog.velcdn.com/images/yummjin/post/f6477216-08a5-4856-bfd5-af5a40ab6644/image.png)

### `name` 프로퍼티

함수의 이름을 나타내는 프로퍼티이다.

ES6 이전에는 표준이 아니었는데 ES6으로 넘어오며 표준으로 정식 인정되었다고 한다.

주의할 점은 ES5에서는 익명 함수 표현식의 경우 `name` 프로퍼티가 빈 문자열을 값으로 가졌다는 것이다. ES6에서는 익명 함수를 가리키는 식별자를 값으로 가지게 되었다.

![](https://velog.velcdn.com/images/yummjin/post/c9f7aa44-0991-42b8-909d-9e038b66094b/image.png)

이렇게 지금은 익명 함수를 가리키는 변수인 `funcOne` 을 `name` 프로퍼티로 갖지만 과거에는 `''` 였다고 한다.

### `prototype` 프로퍼티

`prototype` 프로퍼티는 [생성자 함수로 호출할 수 있는 함수 객체](https://velog.io/@yummjin/JavaScript-%EC%83%9D%EC%84%B1%EC%9E%90-%ED%95%A8%EC%88%98%EB%A5%BC-%ED%86%B5%ED%95%B4-%EA%B0%9D%EC%B2%B4-%EC%83%9D%EC%84%B1%ED%95%98%EA%B8%B0#constructor%EC%99%80-non-constructor), 즉 constructor만이 소유하는 프로퍼티로 **생성자 함수로 호출될 때 생성자 함수가 생성할 인스턴스의 프로토타입 객체**를 나타낸다!

![](https://velog.velcdn.com/images/yummjin/post/2622f211-9086-4ad2-bcde-11ed796af72d/image.png)

`Empty` 생성자 함수의 프로토타입에 `setIsEmpty` 메서드를 추가해줬더니 `prototype` 프로퍼티에 추가된 것을 확인할 수 있다.

![](https://velog.velcdn.com/images/yummjin/post/59c76a51-2331-4dcc-89fe-7dbbfd7323a6/image.png)

`Empty` 객체는 `isEmpty` 속성값과 이 속성값을 바꿀 수 있는 함수인 `setIsEmpty` 를 가지며, `setIsEmpty` 함수는 프로토타입에서 상속받는다!

프로토타입은 다음 글에서 자세히 다뤄보자 (드디어!!)

## 참고

[자바스크립트 딥다이브 (이웅모)](https://www.yes24.com/product/goods/92742567)
