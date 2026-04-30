export default function TermsConditionsBanner() {
  return (
    <section className="bg-brand-disabled">
      <div className="mx-auto max-w-470 px-4 py-14 text-center sm:px-6 sm:py-16 md:px-10 md:py-20 lg:px-12.5 lg:py-22 2xl:py-25">
        <h1 className="text-brand-default text-3xl leading-tight font-bold sm:text-4xl lg:text-[64px] lg:leading-[1.08]">
          Terms and Conditions – SurfShare
        </h1>

        <p className="text-text-weak mx-auto mt-3 max-w-300 text-sm leading-6 sm:mt-4 sm:text-base sm:leading-7 lg:mt-6 lg:text-[28px] lg:leading-tight">
          If you have any questions or concerns regarding this Terms and Conditions, please contact
          us at -<span className="text-brand-default underline"> admin@surfshare.com.au</span>
        </p>

        <p className="mt-3 inline-flex items-center gap-2 rounded-sm px-5 py-2.5 text-sm font-medium text-[#4B5563] transition-colors">
          Last updated: [26 April 2026]
        </p>
      </div>
    </section>
  );
}
