export function PageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-section text-[22px]">{title}</h1>
      <p className="text-body-small text-secondary max-w-[560px]">{description}</p>
    </div>
  );
}
