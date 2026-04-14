import { PageTitle } from "../shared/page-title";

export default function GetMoment() {
  const stackData = [
    {
      title: "450k+",
      SubTitle: "Photos captured",
    },
    {
      title: "120+",
      SubTitle: "Spots",
    },
    {
      title: "3200+",
      SubTitle: "Photographers",
    },
    {
      title: "45k+",
      SubTitle: "Happy users",
    },
  ];
  return (
    <section className="px-4 py-10 sm:px-6 md:mx-12.5 md:px-0 md:py-25">
      <PageTitle
        align="center"
        title="Where every wave gets its moment"
        titleClassName="mt-2 text-4xl text-(--color-text-strong) sm:text-[42px] md:text-5xl lg:text-[64px]"
      />
      <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-12 lg:mt-32 lg:gap-40">
        {stackData.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-3">
            <PageTitle
              align="center"
              title={item.title}
              subtitle={item.SubTitle}
              titleClassName="mt-2 text-[36px]! text-(--color-text-strong)"
              subtitleClassName="text-(--color-text-weak) text-base! mx-auto"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
