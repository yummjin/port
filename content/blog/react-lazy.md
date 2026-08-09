---
title: "lazy loading이 필요한 이유"
date: "2025-11-09"
description: "lazy loading은 무엇이고 왜 필요할까?"
tags: ["React"]
---

## 들어가며

lazy loading과 `Suspense` 는 왜 필요할까?

React는 기본적으로 CSR, Client Side Rendering 방식으로 동작한다. CSR은 JavaScript만을 사용해 DOM을 수정하고 웹 애플리케이션을 렌더링하는 것을 말한다.

![](https://velog.velcdn.com/images/yummjin/post/f67dd3d4-6f2e-41f5-bc07-c1131dd9f44c/image.png)

CSR은 위 사진과 같이 초기 접속 요청 시에 빈 껍데기 html 파일을 응답받고, 애플리케이션의 모든 로직이 포함된 JavaScript 번들이 로드될 때까지 기다린 후 화면에 요소가 렌더링되는 방식으로 동작한다. 

이때 사용자가 요청을 시작한 시점으로부터 컨텐츠가 화면에 처음 나타날 때까지 걸리는 시간을 FCP(First Contentful Paint) 라고 하는데, CSR은 JavaScript 번들이 로드될 때까지 사용자가 빈 화면을 마주해야 하므로 FCP가 길다.

결국 이런 단점을 해결하기 위해 최근에는 Server Side Rendering이라는 방식이 등장했고, React의 Server Component 등과 이를 사용한 Next.js 프레임워크를 사용해 SSR 방식의 애플리케이션을 구현할 수 있다.

그러나 이런 FCP를 줄이는 방법은 SSR 뿐만이 아니다. **초기에 로드되는 JavaScript 번들의 크기를 줄이는 방법** 또한 FCP를 줄일 수 있는 방법이다. 이 글에서는 JavaScript 번들의 크기를 줄이는 방법인 React의 lazy loading에 대해 알아본다.

## React 애플리케이션의 번들링

우리가 일반적으로 React로 애플리케이션을 개발하면, 우리가 만든 코드는 Webpack과 같은 번들러를 통해 하나의 JavaScript 파일로 번들링된다. 

![](https://velog.velcdn.com/images/yummjin/post/b1cc2eb3-d95b-450c-bfb5-7b4eebc15332/image.png)

그래서 앱의 규모가 커질수록 번들링된 파일도 커진다.

번들이 커지는 것을 방지하기 위한 가장 좋은 방법은 번들을 나누는 것이다. 코드 분할은 런타임에 여러 번들을 동적으로 만들고 불러오는 것으로, 애플리케이션을 순차적으로 로딩하여 초기 로딩에 필요한 비용을 줄여 FCP 향상 및 기타 성능 향상에 기여한다.

## import()

"이런 코드 분할을 애플리케이션에 도입하는 가장 좋은 방법은 동적 `import()` 문법을 사용하는 것" 이라고 공식 문서에서 다루고 있다. 

```
import { add } from './math';

console.log(add(16, 26));
```

위와 같은 방식으로 코드를 작성했을 때에는 `add` 함수와 `console.log()` 로직이 같은 파일로 번들링되는 반면,

```
import("./math").then(math => {
  console.log(math.add(16, 26));
});
```
이렇게 작성하게 되면 Webpack이 코드를 분할하여 `add` 함수와 `console.log()` 로직을 각각 다른 파일로 번들링한다.


## lazy

`lazy` 는 이런 `import()` 구문을 사용해 컴포넌트를 렌더링할 수 있도록 도와준다.

`const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));`

### 매개변수

`lazy` 는 하나의 매개변수를 가진다. 매개변수 `load` 는 매개변수를 가지지 않으며 Promise(또는 `then` 메서드를 가진 Promise 유사 객체)를 반환하는 함수인데, 결국 `import()` 구문 등으로 컴포넌트를 불러오는 로직을 반환하는 함수라고 생각하면 된다. 

React는 이 `load` 함수의 Promise 객체가 반환하는 컴포넌트를 처음 렌더링하려고 하기 전까지는 이 함수를 아예 실행하지 않는다. 이후 이 컴포넌트가 처음 필요한 시점이 되면 `load` 를 실행한다. 그리고 이 `load` 가 이행될 때까지 기다린 후 실행된 값의 `.default` (import 구문을 통해 불러온 파일의 default export 컴포넌트)를 React 컴포넌트로 렌더링한다.

이때 반환된 Promise 객체와 Promise의 이행된 값(컴포넌트)이 모두 캐시되기 때문에 React는 `load` 함수를 두 번 이상 호출하지 않는다. 만약 이 `load` 함수의 Promise가 거부되면, React는 가장 가까운 Error Boundary에 에러를 `throw` 한다.

결국 import를 통해 불러오는 컴포넌트가 필요해질 때 한 번 수행되고 그 뒤에는 캐싱된 값이 사용되며, 에러가 발생 시에는 가장 가까운 Error Boundary에 에러를 던진다는 것이다!

### 반환값

`lazy` 는 트리에 렌더링될 수 있는 React 컴포넌트를 반환한다. 컴포넌트의 코드가 로드되는 동안 렌더링을 시도하면 일시 중지되며, 로딩 중 Skeleton이나 loading indicator를 표시하려면 `<Suspense>` 를 사용할 수 있다.

### 사용법

> 사용법을 알아보기 전 알아두어야 할 것은 **`lazy` 는 `default export` 에만 적용된다는 것이다!**
> 그리고 `lazy` 는 **모듈의 최상위에서** 선언해 주어야 한다. 다른 컴포넌트 내부에서 선언하면 컴포넌트가 다시 렌더링될 때 모든 상태가 재설정되어 위에서 언급한 캐싱이 적용되지 않는다.
```
import { lazy } from 'react';
const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
// 이렇게 모듈의 최상위에서 정의해 주어야 한다!
function Editor() {
  // ...
}
```

`lazy` 를 사용하지 않았을 때는 다음과 같이 컴포넌트를 가져오곤 했을 것이다.

```
import MarkdownPreview from './MarkdownPreview.js';
```

이 가져오기에 `lazy` 를 사용한다면?

```
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

이렇게 사용해 주면 되고, lazy 컴포넌트 또는 lazy 컴포넌트를 포함하는 부모 컴포넌트를 `<Suspense>` 바운더리로 감싸 fallback 상태를 나타내는 UI를 표시할 수 있다.

```
<Suspense fallback={<Loading />}>
  <h2>Preview</h2>
  <MarkdownPreview />
</Suspense>
```

## 마치며

다음에는 번들링에 대해 더 자세히 알아보아야겠다!

## 참고

[Web.dev - 웹에서 렌더링](https://web.dev/articles/rendering-on-the-web?hl=ko)

[리액트 (구)공식 문서 - 코드 분할](https://ko.legacy.reactjs.org/docs/code-splitting.html)

[리액트 공식 문서 - lazy](https://ko-react-exy5xcwjj-fbopensource.vercel.app/reference/react/lazy)