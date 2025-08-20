import { AboutLayout } from "@/shared/layouts";
import { PROJECTS } from "@/shared/data/project";
import Card from "@/shared/components/Card";
import { useRouter } from "next/router";

const projects: { year: string; event: string; id: string }[] = [];

PROJECTS.map((project) => {
  projects.push({
    year: project.period.split(".")[0] + "." + project.period.split(".")[1],
    event: project.title.split(":")[0],
    id: project.id,
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
            className="cursor-pointer hover:border-main active:border-main"
          >
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
