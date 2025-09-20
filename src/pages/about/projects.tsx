import { AboutLayout } from "@/shared/layouts";
import { PROJECTS } from "@/shared/data/project";
import Card from "@/shared/components/Card";
import { useRouter } from "next/router";
import Image from "next/image";

const projects: { year: string; event: string; id: string, thumb: string }[] = [];

PROJECTS.map((project) => {
  projects.push({
    year: project.period.split(".")[0] + "." + project.period.split(".")[1],
    event: project.title.split(":")[0],
    id: project.id,
    thumb: project.thumb
  });
});

export default function Projects() {
  const router = useRouter();

  return (
    <AboutLayout>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-4 grid-cols-2">
        {projects.map((item, index) => (
          <Card
            onClick={() => router.push(`/about/projects/${item.id}`)}
            key={index}
            className="cursor-pointer text-black hover:border-main active:border-main"
          ><Image alt={item.id} src={item.thumb} width={500} height={100} />
            <Card.Header>
              <h2 className="font-mono font-semibold">{item.event}</h2>
            </Card.Header>
            <Card.Content>
              <p className="text-sm">{item.year}</p>
            </Card.Content>
          </Card>
        ))}
      </div>
    </AboutLayout>
  );
}
