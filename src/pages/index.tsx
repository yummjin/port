import Head from "next/head";
import Image from "next/image";

import { SKILLS } from "@/shared/assets";
import { Card, CardWrapper } from "@/shared/components";
import { PostLayout, RootLayout } from "@/shared/layouts";

export default function Home() {
  return (
    <RootLayout>
      <Head>
        <title>Yujin Han</title>
        <meta
          name="description"
          content="프론트엔드 개발자 한유진의 포트폴리오입니다"
        />
      </Head>

      <section className="flex flex-col">
        <PostLayout>
          <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">
              안녕하세요!
              <br />
              프론트엔드 개발자 한유진입니다.
            </h1>
            <CardWrapper>
              <VideoCard />
              <VideoCard />
              <VideoCard />
            </CardWrapper>
          </div>
          <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">이런 기술들을 주로 사용해요</h1>
            <div className="scrollbar-hide flex w-full items-center gap-8 overflow-x-auto">
              {SKILLS.map((skill) => (
                <SkillCard key={skill.name} {...skill} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">
              최근에는 이렇게 공부하고 있어요
            </h1>
            <CardWrapper>
              <VideoCard />
              <VideoCard />
            </CardWrapper>
          </div>
        </PostLayout>
      </section>
    </RootLayout>
  );
}

const SkillCard = ({
  image,
  name,
  description,
}: {
  image: string;
  name: string;
  description: string;
}) => (
  <div className="flex w-32 shrink-0 flex-col gap-2">
    <div className="relative size-32 overflow-hidden rounded-full">
      <Image src={image} alt={name} fill objectFit="cover" />
    </div>
    <div className="flex flex-col items-center gap-0.5">
      <p>{name}</p>
      <p className="text-text-muted line-clamp-2 text-sm">{description}</p>
    </div>
  </div>
);

const PostCard = () => (
  <div className="flex flex-col gap-3">
    <Card>
      <div className="flex items-center gap-2"></div>
    </Card>
  </div>
);

const VideoCard = () => (
  <div className="flex flex-col gap-3">
    <Card>
      <div className="flex items-center gap-2"></div>
    </Card>
    <div className="flex items-start gap-3">
      <div className="size-9 rounded-full bg-white" />
      <div className="flex flex-col gap-0.5 font-semibold">
        <p>주토피아 보고 왔어요</p>
        <p className="text-text-muted text-sm">너무 귀엽더라구용</p>
        <p className="text-text-muted text-sm">2025.12.07</p>
      </div>
    </div>
  </div>
);
