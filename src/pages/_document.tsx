import { Html, Head, Main, NextScript } from "next/document";

import { THEME_INIT_SCRIPT } from "@/lib/theme";

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
