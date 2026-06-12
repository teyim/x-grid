type Faq = {
  question: string;
  answer: string;
};

type Step = {
  title: string;
  text: string;
};

type SeoSectionsProps = {
  title: string;
  intro: string;
  steps: Step[];
  sections: {
    title: string;
    text: string;
  }[];
  faqs: Faq[];
};

export default function SeoSections({
  title,
  intro,
  steps,
  sections,
  faqs,
}: SeoSectionsProps) {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-3 py-10 sm:space-y-10 sm:px-6 sm:py-12 lg:px-8">
      <section>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
          {title}
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-600">{intro}</p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title} className="rounded-lg border bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Step {index + 1}
              </p>
              <h3 className="mt-2 text-base font-semibold text-zinc-950">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {sections.map((section) => (
          <article key={section.title} className="rounded-lg border bg-zinc-50 p-5">
            <h3 className="text-lg font-semibold text-zinc-950">{section.title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{section.text}</p>
          </article>
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-950">FAQ</h2>
        <div className="mt-4 divide-y rounded-lg border bg-white">
          {faqs.map((faq) => (
            <details key={faq.question} className="group p-4">
              <summary className="cursor-pointer text-sm font-semibold leading-6 text-zinc-950">
                {faq.question}
              </summary>
              <p className="mt-3 text-sm leading-6 text-zinc-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
