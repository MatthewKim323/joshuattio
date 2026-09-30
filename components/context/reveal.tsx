import { UcQuote } from "./uc-quote";

export function ContextReveal() {
  return (
    <section className="relative z-0 -mt-[100svh] flex flex-col bg-primary-background">
      <div className="container flex flex-1 flex-col max-lg:contents">
        <div className="flex w-full flex-1 flex-col border-subtle-stroke border-x max-lg:border-none">
          <UcQuote />
        </div>
      </div>
    </section>
  );
}
