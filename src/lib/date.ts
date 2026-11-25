const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long",
  timeZone: "UTC",
});

// Call from getStaticProps only, so server and client render the same string.
export function formatPostDate(date: string) {
  const parsed = new Date(`${date}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? date : dateFormatter.format(parsed);
}
