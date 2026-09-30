"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { REGION_OPTIONS, validateField } from "@/components/pages/contact/sales/validation";

// Conversational application form: one question per screen, Enter to continue.
// Nothing is sent anywhere; finishing shows a local confirmation.

type Key = "firstName" | "lastName" | "email" | "website" | "region" | "why";
type Step = {
  key: Key;
  title: string;
  hint?: string;
  placeholder: string;
  kind: "text" | "email" | "url" | "choice" | "long";
};

const STEPS: Step[] = [
  { key: "firstName", title: "What's your first name?", placeholder: "Type your answer here...", kind: "text" },
  { key: "lastName", title: "And your last name?", placeholder: "Type your answer here...", kind: "text" },
  {
    key: "email",
    title: "What's your work email?",
    hint: "We'll use this to follow up on your application.",
    placeholder: "name@company.com",
    kind: "email",
  },
  {
    key: "website",
    title: "Where can we find your work?",
    hint: "Your company, agency or portfolio website.",
    placeholder: "https://",
    kind: "url",
  },
  { key: "region", title: "Where are you based?", placeholder: "", kind: "choice" },
  {
    key: "why",
    title: "What excites you about working with Joshuattio?",
    hint: "Share your experience, your skills and the teams you work with.",
    placeholder: "Type your answer here...",
    kind: "long",
  },
];

const INPUT =
  "block w-full rounded-[10px] bg-primary-background p-[10px_13px] outline-hidden transition-all duration-300 ease-out text-secondary-foreground placeholder:text-accent-foreground placeholder:text-sm border border-default-stroke hover:border-greyscale-light-08 hover:shadow-[0px_1px_4px_rgba(56,_62,_71,_0.1)] focus-visible:border-blue-500 focus-visible:ring-[3px] focus-visible:ring-blue-300";
const BUTTON =
  "relative inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-9 gap-x-1.5 rounded-[10px] px-3 text-sm button-primary";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function check(step: Step, value: string): string | undefined {
  const v = value.trim();
  if (step.kind === "email") return validateField("companyEmail", v);
  if (step.kind === "choice") return v ? undefined : "Please pick one";
  if (!v) return "Please fill this in";
  if (step.kind === "url" && !/^(https?:\/\/)?[^\s.]+\.[^\s]{2,}$/i.test(v)) return "Please enter a valid website";
  return undefined;
}

export function ExpertApplyForm() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [values, setValues] = useState<Record<Key, string>>({
    email: "",
    firstName: "",
    lastName: "",
    region: "",
    website: "",
    why: "",
  });
  const [error, setError] = useState<string | undefined>();
  const [done, setDone] = useState(false);
  const field = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const started = useRef(false);
  const step = STEPS[index];

  useEffect(() => {
    // Focus follows the active question, but only after the visitor has interacted.
    if (started.current) field.current?.focus({ preventScroll: true });
  }, [index]);

  const go = (next: number) => {
    started.current = true;
    setDir(next > index ? 1 : -1);
    setError(undefined);
    setIndex(next);
  };

  const submitStep = (e?: FormEvent) => {
    e?.preventDefault();
    const message = check(step, values[step.key]);
    if (message) {
      setError(message);
      return;
    }
    if (index === STEPS.length - 1) {
      setDone(true);
      return;
    }
    go(index + 1);
  };

  const set = (v: string) => {
    setValues((s) => ({ ...s, [step.key]: v }));
    if (error) setError(undefined);
  };

  const progress = done ? 1 : index / STEPS.length;

  return (
    <div
      className="relative flex size-full flex-col overflow-hidden border border-subtle-stroke bg-primary-background"
      style={{ borderRadius: 8 }}
    >
      <div className="h-1 w-full bg-secondary-background">
        <motion.div
          className="h-full bg-black-800"
          initial={false}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.4, ease: EASE }}
        />
      </div>
      <div className="relative flex flex-1 items-center" style={{ padding: "0 8%" }}>
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          {done ? (
            <motion.div
              key="done"
              role="status"
              className="flex w-full flex-col gap-3"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <p className="text-heading-sm text-secondary-foreground">
                {`Thanks${values.firstName.trim() ? `, ${values.firstName.trim()}` : ""}. Your application is in.`}
              </p>
              <p className="text-base text-tertiary-foreground">
                {"Our partnerships team reviews every application and will reach out to "}
                <span className="font-medium text-secondary-foreground">{values.email.trim()}</span>
                {" with next steps."}
              </p>
            </motion.div>
          ) : (
            <motion.form
              key={step.key}
              noValidate
              onSubmit={submitStep}
              className="flex w-full flex-col gap-5"
              custom={dir}
              initial={{ opacity: 0, y: 32 * dir }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -32 * dir }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <div className="flex flex-col gap-1.5">
                <p className="text-sm text-accent-foreground">{`${index + 1} / ${STEPS.length}`}</p>
                <label htmlFor={`expert-apply-${step.key}`} className="text-xl text-secondary-foreground">
                  {step.title}
                  {" *"}
                </label>
                {step.hint && <p className="text-sm text-tertiary-foreground">{step.hint}</p>}
              </div>
              {step.kind === "choice" ? (
                <div role="radiogroup" aria-label={step.title} className="flex flex-col gap-2">
                  {REGION_OPTIONS.map((opt, i) => {
                    const on = values.region === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => {
                          set(opt);
                          started.current = true;
                        }}
                        className={`${INPUT} flex cursor-pointer items-center gap-3 text-left text-sm`}
                        style={on ? { borderColor: "var(--color-blue-500)" } : undefined}
                      >
                        <span className="inline-flex size-5 items-center justify-center rounded-sm border border-default-stroke text-xs text-tertiary-foreground">
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              ) : step.kind === "long" ? (
                <textarea
                  id={`expert-apply-${step.key}`}
                  ref={(el) => {
                    field.current = el;
                  }}
                  rows={5}
                  value={values[step.key]}
                  placeholder={step.placeholder}
                  aria-invalid={error ? true : undefined}
                  onChange={(e) => set(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submitStep();
                  }}
                  className={INPUT}
                  style={{ resize: "none" }}
                />
              ) : (
                <input
                  id={`expert-apply-${step.key}`}
                  ref={(el) => {
                    field.current = el;
                  }}
                  type={step.kind === "email" ? "email" : step.kind === "url" ? "url" : "text"}
                  autoComplete={
                    step.key === "firstName"
                      ? "given-name"
                      : step.key === "lastName"
                        ? "family-name"
                        : step.kind === "email"
                          ? "email"
                          : "url"
                  }
                  value={values[step.key]}
                  placeholder={step.placeholder}
                  aria-invalid={error ? true : undefined}
                  onChange={(e) => set(e.target.value)}
                  className={INPUT}
                />
              )}
              <div className="flex flex-col gap-3">
                {error && <p className="text-xs text-red-600">{error}</p>}
                <div className="flex items-center gap-3">
                  <button type="submit" className={BUTTON}>
                    {index === STEPS.length - 1 ? "Submit" : "OK"}
                  </button>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => go(index - 1)}
                      className="cursor-pointer text-sm text-tertiary-foreground"
                    >
                      {"Back"}
                    </button>
                  )}
                  <span className="text-xs text-accent-foreground max-lg:hidden">
                    {step.kind === "long" ? "press Cmd + Enter" : "press Enter"}
                  </span>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
