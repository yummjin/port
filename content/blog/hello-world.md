---
title: "블로그를 시작하며"
date: "2026-08-09"
description: "이 폴더에 마크다운 파일을 추가하면 자동으로 블로그 글이 됩니다."
tags: ["안내", "블로그"]
---

이 파일은 예시 글입니다. `content/blog/` 아래에 `.md` 파일을 추가하면
`/blog`와 `/blog/[slug]`에 자동으로 노출됩니다.

## 이미지 넣기

마크다운 이미지 문법을 그대로 쓰면 됩니다.

![프로필 이미지](/images/profile.jpeg)

## 코드 블록

```ts
export function hello(name: string) {
  return `Hello, ${name}!`;
}
```

- 목록
- GFM(표, 취소선 등)도 지원됩니다.
