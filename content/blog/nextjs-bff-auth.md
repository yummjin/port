---
title: "Next.js BFF 아키텍처로 정리하는 웹 인증과 보안 설계"
date: "2025-12-15"
description: "Next.js BFF 아키텍처로 웹 인증과 보안을 설계해보자."
tags: ["Next.js"]
---

## 들어가며

요즘 쿠팡 사건도 그렇고 서비스의 보안에 대한 이슈가 많다. 

유저들을 실제로 받고자 하는 서비스를 개발한다면 이런 보안 이슈에 대해 민감하게 반응할 필요가 있다. 나는 CSR 웹페이지를 개발하며 개발자 도구를 열면 바로 확인할 수 있는 액세스 토큰이 과연 안전한지 궁금했다. 또 프론트엔드에서 토큰을 직접적으로 다루는 것이 정말 좋은 방법일까 하는 생각이 들었다.

더 나은 사용자 정보 보호를 위한 개발 방법이 존재하지 않을까 하며 BFF에 대해 알아본 내용과 Next.js에서 BFF를 사용하는 방법에 대해 이야기해 보고자 한다.

## 웹보안

프론트엔드 단에서 이루어지는 정보 탈취 공격은 크게 두 가지로 나눌 수 있다.

### XSS 공격

XSS(Cross Site Scripting) 공격은 공격자가 특정 스크립트를 사용자의 환경에서 실행시켜 유저의 정보를 탈취하는 방법이다.

예를 들어 게시판이나 채팅과 같은 기능을 가진 서비스에서, 입력값 검증을 제대로 하지 않아 `<script>` 태그가 포함된 악성 스크립트가 게시글에 포함되고 그 게시글 또는 채팅 사이트에 접속한 유저의 환경에서 스크립트가 실행될 수 있다.

> XSS는 브라우저가 실행하는 자바스크립트에 **공격자가 코드를 주입해 사용자의 권한으로 임의의 동작을 수행하게 만드는 공격**이다.

![](https://velog.velcdn.com/images/yummjin/post/ea03307e-ce9b-4fea-b546-d942c0604848/image.png)


사실 React에서 [`dangerouslySetInnerHTML`](https://ko.legacy.reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml) 을 사용하지 않는다면 그다지 걱정하지 않아도 될 부분인 것 같기도 하다. 

프론트에서 실시간으로 UI에 반영하는 채팅 기능이라면 모르겠는데, 대부분의 게시글 기능의 경우 한번 서버로 문자열을 보낸 뒤 그 문자열을 받아와 UI에 그리기 때문에 보통의 경우라면 취약점으로 작용하지 않을 것 같다.

하지만 우리는 해커가 아니기에.. XSS 공격이 어떤 방식으로 신박하게 변형되어 사용될지 알 수 없다. 사실 적을 알고 나를 알아야 지피지기면 백전백승이라는데 우리는 적을 모른다.

하지만 확실한 것은 JavaScript만으로 이루어진 CSR 서비스는 이런 공격에 취약할 수 있다는 점이다.

### XSS 공격 취약성

![](https://velog.velcdn.com/images/yummjin/post/5fb7c441-210e-4953-b848-24c0fed6b124/image.png)

localStorage나 cookie에 저장한 토큰은 스크립트를 통해 어렵지 않게 탈취할 수 있으며 위 사진처럼 알기 쉬운 키 (`accessToken` , `refreshToken`) 으로 저장했을 경우 탈취는 더욱 쉬워진다.

CSR 웹사이트는 근본적으로 JavaScript로 이루어져 있기에 이런 크로스 사이트 스크립트 공격에 취약하다. 

### CSRF 공격

두 번째 공격 방식은 CSRF(Cross Site Request Forgery) 공격이다. 글자 그대로(Request Forgery) 요청을 강제로 보내는 공격이다.

피해자가 인지하지 못하는 상태에서 `<img>` 태그의 `src` 속성 안에 공격자가 원하는 요청을 넣어 해당 요청이 서버로 전송되도록 하는 것이다.

> CSRF는 **브라우저가 인증 정보를 자동으로 포함**시키는
세션 / 쿠키 기반 인증에서 발생하는 공격이다.

![](https://velog.velcdn.com/images/yummjin/post/7432e7f8-10ee-4cb1-99f3-dc077269299e/image.png)



### CSRF 공격 취약성

개발을 하다 보면 프론트엔드의 배포 엔드포인트와 백엔드의 엔드포인트가 다른 경우가 있다. 그럴 경우 우리는 다른 사이트에 요청을 보내기 때문에, 인가 정보를 담은 `cookie` 가 다른 사이트에서도 동작할 수 있도록 쿠키의 `sameSite` 옵션을 끄게 된다.

후술하며 더 설명하겠지만, 이렇게 `sameSite` 옵션을 느슨하게 설정했을 경우 브라우저는 **같은 도메인에서 발생한 요청들에게 쿠키를 자동**으로 붙이게 된다.

유저의 인증이 완료된 사이트에서 ** 다른 도메인으로 가는 어떤 요청이라도 인증된 요청**으로 처리해 공격자는 악성 사이트에서 **자동으로 포함된 브라우저 세션 쿠키**에서 사용자의 액세스 토큰을 탈취할 수 있다.


### XSS / CSRF 정리

결국 XSS와 CSRF의 취약성을 종합해 보면, 두 가지 방법은 서로 다른 부분에 대한 취약성을 가지고 있다.

- CSRF
**브라우저가 인증 정보를 자동**으로 포함시키는 **세션 및 쿠키 기반 인증**에서 발생하는 공격

- XSS
브라우저가 신뢰하여 실행하는 **자바스크립트 영역**에 공격자가 코드를 주입해 사용자의 권한을 탈취하거나 동작을 수행하는 공격

CSRF와 XSS는 취약점의 성격이 다르기 때문에, 브라우저가 인증 정보를 자동으로 포함하지 않는 JWT 토큰 기반 인증 구조는 CSRF에는 안전하지만 XSS를 통해 토큰이 탈취될 위험이 있다.

반대로 세션·쿠키 기반 인증 구조는 XSS 자체를 막아주지는 않지만, 인증 정보가 자바스크립트에 노출되지 않아 토큰 탈취에는 비교적 안전한 대신 CSRF 공격에 취약해진다.

결국 두 방식은 서로 다른 보안 위협에 대한 트레이드오프를 가진다.

## 보안 취약성 개선

이렇게 두 가지 보안 취약점을 동시에 만족하기 위해서는 CSRF에 안전한 **JWT 토큰 기반 인증 구조를 사용**하면서 XSS 공격에 대한 취약점을 개선해야 한다.

위에서 JavaScript를 통해 쉽게 접근할 수 있는 localStorage와 cookie에 저장한 토큰이 쉽게 탈취될 수 있기에 위험하다고 언급했다.

### HttpOnly Cookie

이를 방지하기 위해 [**HttpOnly Cookie**](https://developer.mozilla.org/ko/docs/Web/HTTP/Guides/Cookies#secure%EA%B3%BC_httponly_%EC%BF%A0%ED%82%A4)를 사용할 수 있다. HttpOnly 쿠키는 JavaScript로는 절대로 접근할 수 없는 쿠키이다.

HttpOnly Cookie에 토큰을 넣어두고 요청 시 붙여주는 방식으로 처리할 것이다. (아래에서 후술하며 더 설명)

다만 HttpOnly 쿠키는 **브라우저가 서버로 요청을 보낼 때 자동으로 포함**되게 된다. 

즉 자바스크립트로는 접근할 수 없지만 요청 자체에는 항상 실릴 수 있기 때문에 CSRF 공격에 대한 가능성이 다시 생긴다. 이를 방지하기 위해 쿠키의 SameSite 옵션과 BFF가 필요하다.

### SameSite 옵션

[이 글](https://www.codeit.kr/tutorials/94/%EC%BF%A0%ED%82%A4%EC%9D%98%20SameSite%20%EC%98%B5%EC%85%98%EC%9D%B4%EB%9E%80%3F)에서 쿠키의 SameSite 옵션에 대해 친절하게 설명하고 있다.

SameSite 옵션은 브라우저가 요청을 전송할 때, 해당 요청이 쿠키를 설정한 사이트와 동일한 사이트에서 발생했는지를 판단하여 쿠키 포함 여부를 결정하는 정책이다. 보통 쿠키를 설정한 사이트가 프론트엔드 도메인이고, CSRF 공격은 외부 도메인에서 발생하기에 외부 도메인이 프론트엔드 도메인으로 요청을 전송했을 때 쿠키를 제거해주는 것이다.

다만 위에서 말했던 것처럼 백엔드 서버의 도메인과 프론트엔드 도메인이 일치하지 않을 경우 이런 SameSite 옵션을 느슨하게 처리하게 된다. 따라서 BFF(같은 도메인을 가진다)로 같은 도메인에서 보내지 않은 요청을 걸러준 뒤 진짜 서버로 요청을 보내면 안전해진다.

### Next.js의 cookie, BFF 사용

따라서 이런 모든 해결책을 Next.js에서 적용하기 위해 [Next.js의 cookie](https://nextjs.org/docs/app/api-reference/functions/cookies)와 route handler를 통해 구현한 [BFF](https://nextjs.org/docs/app/guides/backend-for-frontend)를 사용할 것이다.

전체적인 흐름은 다음과 같다.

1. 백엔드로부터 받은 인증 토큰을 Next.js의 서버 액션 또는 Route Handler에서 처리한 뒤, next/headers의 cookies()를 사용해 HttpOnly 옵션이 설정된 쿠키로 브라우저에 저장한다. 

 이 쿠키는 자바스크립트로는 접근할 수 없으며, 이후 요청 시 브라우저가 자동으로 포함한다.

2. 인가가 필요한 요청이 발생하면 클라이언트는 먼저 Next.js로 구성된 BFF 서버로 요청을 보낸다. 

 이때 SameSite 옵션에 따라 브라우저가 동일 사이트에서 발생한 요청인 경우에만 쿠키를 요청에 포함시키며, Next.js BFF 서버는 이렇게 전달된 요청에서 cookies()를 통해 HttpOnly 쿠키 값을 읽을 수 있다. 

 Next.js에서 구성한 BFF 서버는 프론트엔드와 동일한 도메인에서 동작하기 때문에 이 브라우저 레벨의 필터링이 유효하게 작동한다.

3. Next.js BFF 서버는 HttpOnly 쿠키에서 추출한 토큰을 기반으로 Authorization 헤더를 구성하여, 실제 백엔드 서버로 인증된 요청을 전달한다.

## BFF란?

그럼 BFF는 무엇일까?

BFF는 Backend For Frontend의 약자로, 클라이언트가 직접 API 서버와 통신하지 않고 중간에 프론트엔드 전용 백엔드 프록시 서버를 두어 요청을 대신 처리하도록 하는 아키텍처 패턴이다. 

![](https://velog.velcdn.com/images/yummjin/post/200dbfdd-36a5-4ae0-b21d-bbeb1c629273/image.png)

BFF를 사용하면 백엔드에서 내려주는 원본 응답을 그대로 전달하는 것이 아니라, 프론트엔드에 필요한 형태로 데이터를 가공하여 전달할 수 있다. 이를 통해 프론트엔드에서 필요한 필드만 응답으로 내려주는 Partial Response를 구현할 수 있고, 하나의 백엔드 API를 기반으로 웹, 모바일 등 플랫폼별로 최적화된 응답 구조를 제공하는 것도 가능하다.

또한 BFF는 보안 측면에서도 중요한 역할을 한다. 인증 토큰을 브라우저 자바스크립트에 노출하지 않고 BFF 서버 내부에서만 관리할 수 있으며, 프론트엔드와 동일한 도메인에서 동작함으로써 CSRF 방어, 인증 헤더 관리, 요청 검증 로직을 중앙화할 수 있다.

## Next.js의 Cookies란?

![](https://velog.velcdn.com/images/yummjin/post/cabdc351-d9b2-4a32-8031-e334e55828fb/image.png)

cookies 함수는 Next.js에서 제공하는 서버 전용 API이다. cookies를 사용하면 현재 요청에 포함된 HTTP 쿠키를 읽고 수정할 수 있다. 그리고 서버 컴포넌트, 서버 액션, Route Handler와 같이 서버에서만 실행되는 환경에서만 사용할 수 있다.

cookies를 통해 읽는 쿠키는 브라우저의 쿠키 저장소가 아니라 브라우저가 요청 시 자동으로 포함한 HTTP Cookie 헤더를 기반으로 한다. 따라서 HttpOnly 옵션이 설정된 쿠키도 서버에서는 정상적으로 접근할 수 있게 된다. 이는 인증 토큰을 클라이언트에 노출하지 않고 서버에서 다루는 구조를 가능하게 한다.



## 참고

[Next.js_ Backend For Frontend](https://nextjs.org/docs/app/guides/backend-for-frontend)

[Next.js_ cookies](https://nextjs.org/docs/app/api-reference/functions/cookies)

[MDN web docs_ HTTP cookie](https://developer.mozilla.org/ko/docs/Web/HTTP/Guides/Cookies)

[코드잇_ 쿠키의 SameSite 옵션이란?](https://www.codeit.kr/tutorials/94/%EC%BF%A0%ED%82%A4%EC%9D%98%20SameSite%20%EC%98%B5%EC%85%98%EC%9D%B4%EB%9E%80%3F)

[카카오페이지의 BFF 적용](https://tech.kakaoent.com/front-end/2022/220310-kakaopage-bff/)
