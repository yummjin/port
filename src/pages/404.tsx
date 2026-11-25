import Head from "next/head";
import Link from "next/link";

import { NAV_LINKS } from "@/lib/nav";

export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>페이지를 찾을 수 없어요</title>
      </Head>

      <main className="px-content mx-auto flex max-w-[1000px] flex-col gap-6 pt-12 pb-20">
        <div className="flex flex-col gap-2">
          <p className="text-caption text-muted">404</p>
          <h1 className="text-section text-foreground">
            페이지를 찾을 수 없어요
          </h1>
          <p className="text-body-small text-secondary">
            주소가 바뀌었거나 삭제된 페이지예요. 아래에서 다시 찾아보세요.
          </p>
        </div>

        <ul className="border-border divide-border flex w-fit divide-x border">
          {[{ href: "/", label: "Home" }, ...NAV_LINKS].map(
            ({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-body-small text-foreground flex h-9 items-center px-3 transition-opacity hover:opacity-70"
                >
                  {label}
                </Link>
              </li>
            ),
          )}
        </ul>
      </main>
    </>
  );
}
