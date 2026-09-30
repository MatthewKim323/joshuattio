"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent, MouseEvent as ReactMouseEvent, ReactNode } from "react";
import { SalesSelect } from "@/components/pages/contact/sales/sales-select";
import { validateField as validateSalesField } from "@/components/pages/contact/sales/validation";

// Startup program application. Validates on submit (then re-validates each field
// as it changes), focuses the first invalid field, and swaps to the success state
// after a local stand-in for the network round trip: nothing is posted anywhere.

const SUBMIT_MS = 900;

const COPY = {
  firstNameLabel: "First name",
  firstNamePlaceholder: "e.g. Julia",
  firstNameError: "Please enter your first name",
  firstNameLongError: "First name is too long",
  lastNameLabel: "Last name",
  lastNamePlaceholder: "e.g. Arowa",
  lastNameError: "Please enter your last name",
  lastNameLongError: "Last name is too long",
  companyEmailLabel: "Company email",
  companyEmailPlaceholder: "e.g. julia@example.com",
  yearFoundedLabel: "Year founded",
  yearFoundedError: "Please select year founded",
  fundingRoundLabel: "Latest funding round",
  latestFundingRoundError: "Please select a funding round",
  amountRaisedLabel: "Total amount raised",
  totalAmountRaisedError: "Please select total amount raised",
  teamSizeLabel: "Team size",
  teamSizeError: "Please select a team size",
  investorsLabel: "Investors",
  investorsPlaceholder: "e.g. Redpoint Ventures, angels, or bootstrapped",
  investorsError: "Please tell us who your investors are",
  investorsLongError: "Investors is too long",
  useCaseLabel: "Use case",
  useCasePlaceholder: "What will you use Joshuattio for?",
  useCaseError: "Please describe your use case",
  useCaseLongError: "Use case description is too long (max 1000 characters)",
  selectPlaceholder: "Select",
  apply: "Apply",
  submittingAria: "Submitting…",
  successTitle: "We've received your submission.",
  successBodyBefore: "Thank you for your interest in joining Joshuattio's Startups program. If you have any questions, please email us at ",
  salesEmail: "sales@joshuattio.com",
} as const;

// The capture's ten years, oldest first.
const YEAR_OPTIONS = ["2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"];
const FUNDING_ROUND_OPTIONS = ["Pre-seed", "Seed", "Series A", "Series B"];
const AMOUNT_RAISED_OPTIONS = ["$0 to $500k", "$500k to $1M", "$1M to $2.5M", "$2.5M to $5M", "$5M to $7.5M", "$7.5M+"];
const TEAM_SIZE_OPTIONS = ["1 to 5", "6 to 10", "11 to 20", "21 to 50", "51 to 100", "101+"];

type FieldName =
  | "firstName"
  | "lastName"
  | "companyEmail"
  | "yearFounded"
  | "latestFundingRound"
  | "totalAmountRaised"
  | "teamSize"
  | "investors"
  | "useCase";

// Registration order (the order the first invalid field is picked in).
const FIELD_ORDER: FieldName[] = [
  "firstName",
  "lastName",
  "companyEmail",
  "yearFounded",
  "latestFundingRound",
  "totalAmountRaised",
  "teamSize",
  "investors",
  "useCase",
];

const IDS: Record<FieldName, string> = {
  firstName: "_r_0_",
  lastName: "_r_1_",
  companyEmail: "_r_2_",
  yearFounded: "_r_3_",
  latestFundingRound: "_r_5_",
  totalAmountRaised: "_r_7_",
  teamSize: "_r_9_",
  investors: "_r_b_",
  useCase: "_r_c_",
};

type Values = Partial<Record<FieldName, string>>;
type Errors = Partial<Record<FieldName, string>>;

function requiredText(value: string | undefined, empty: string, long: string, max: number) {
  if (!value) return empty;
  if (value.length > max) return long;
  return undefined;
}

function validateField(name: FieldName, value: string | undefined): string | undefined {
  switch (name) {
    case "firstName":
      return requiredText(value, COPY.firstNameError, COPY.firstNameLongError, 256);
    case "lastName":
      return requiredText(value, COPY.lastNameError, COPY.lastNameLongError, 256);
    case "investors":
      return requiredText(value, COPY.investorsError, COPY.investorsLongError, 256);
    case "useCase":
      return requiredText(value, COPY.useCaseError, COPY.useCaseLongError, 1000);
    case "companyEmail":
      return validateSalesField("companyEmail", value);
    case "yearFounded":
      return value === undefined || Number.isNaN(Number(value)) ? COPY.yearFoundedError : undefined;
    case "latestFundingRound":
      return FUNDING_ROUND_OPTIONS.includes(value ?? "") ? undefined : COPY.latestFundingRoundError;
    case "totalAmountRaised":
      return AMOUNT_RAISED_OPTIONS.includes(value ?? "") ? undefined : COPY.totalAmountRaisedError;
    case "teamSize":
      return TEAM_SIZE_OPTIONS.includes(value ?? "") ? undefined : COPY.teamSizeError;
  }
}

function validateAll(values: Values): Errors {
  const errors: Errors = {};
  for (const name of FIELD_ORDER) {
    const message = validateField(name, values[name]);
    if (message) errors[name] = message;
  }
  return errors;
}

const INPUT_BASE =
  "block w-full rounded-[10px] bg-primary-background p-[10px_13px] outline-hidden transition-all duration-300 ease-out text-secondary-foreground placeholder:text-accent-foreground placeholder:text-sm";
const INPUT_OK =
  "border border-default-stroke hover:border-greyscale-light-08 hover:shadow-[0px_1px_4px_rgba(56,_62,_71,_0.1)] focus-visible:border-blue-500 focus-visible:ring-[3px] focus-visible:ring-blue-300";
const INPUT_ERR =
  "border border-red-500 hover:border-red-[#CE2E4B] hover:shadow-[0px_1px_4px_rgba(56,_62,_71,_0.1)] focus-visible:border-[#CE2E4B] focus-visible:ring-[3px] focus-visible:ring-red-600/30";
const BUTTON_CLASS =
  "relative inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-11.5 gap-x-2 rounded-xl px-3.5 text-base has-[>svg:last-child,>img:last-child]:pr-3 has-[>svg:first-child,>img:first-child]:pl-3 button-primary mt-7 w-full";
const LINK_CLASS =
  "-mx-px rounded-sm px-px underline transition-colors duration-400 hover:duration-150 active:duration-50 text-link-foreground decoration-transparent hover:text-link-strong-foreground hover:decoration-link-strong-foreground active:text-link-strong-foreground";

// Label: a double click on the label text does not select it.
function Label({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  const onMouseDown = (e: ReactMouseEvent<HTMLLabelElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("button, input, select, textarea")) return;
    if (!e.defaultPrevented && e.detail > 1) e.preventDefault();
  };
  return (
    <label className="nowrap text-ellipsis text-accent-foreground text-xs" htmlFor={htmlFor} onMouseDown={onMouseDown}>
      {children}
    </label>
  );
}

function FieldMessage({ id, message }: { id: string; message: string | undefined }) {
  if (!message) return null;
  return (
    <p id={`${id}-message`} className="fade-in animate-in font-normal text-red-600 text-xs duration-300 ease-out">
      {message}
    </p>
  );
}

function SubmitLoaderIcon() {
  return (
    <>
      <svg aria-hidden="true" className="h-6 w-6 animate-spin fill-blue-500 text-white-200" viewBox="0 0 100 101" fill="none">
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">{"Loading..."}</span>
    </>
  );
}

function SuccessIcon() {
  return (
    <svg width="213" height="120" viewBox="0 0 213 120" fill="none">
      <path
        d="M77.6204 42.3796C85.1525 34.8475 95.2896 30.496 105.938 30.2237C116.587 29.9515 126.933 33.7794 134.84 40.9167C142.747 48.054 147.611 57.9555 148.427 68.5762C149.243 79.1968 145.949 89.7252 139.225 97.9866C132.501 106.248 122.861 111.612 112.296 112.969C101.731 114.327 91.0478 111.575 82.4535 105.282C73.8592 98.9891 68.0101 89.6357 66.1143 79.1538C64.2186 68.672 66.4209 57.8624 72.2665 48.9577"
        stroke="#99A2AF"
      />
      <path
        d="M158.342 3.0876L148.457 4.84691C147.399 5.03327 146.422 5.54765 145.662 6.30803L103.356 48.6134L85.3382 30.0214C84.1231 28.769 82.3638 28.195 80.6417 28.5007L70.809 30.2451C69.7504 30.4314 68.7739 30.9458 68.0135 31.7062L52.5375 47.1896C50.4875 49.2396 50.4875 52.5719 52.5375 54.6294L74.9389 77.0308L93.3669 95.4588C94.582 96.6739 96.3115 97.2181 98.0037 96.9199L107.889 95.1606C108.947 94.9742 109.924 94.4598 110.684 93.6995L177.687 26.6966C179.737 24.6466 179.737 21.3143 177.687 19.2568L162.971 4.54126C161.756 3.32615 160.027 2.78195 158.335 3.08014L158.342 3.0876Z"
        fill="#FAFAFA"
        stroke="#6F7988"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M69.5417 30.8862L95.3126 56.6571L103.356 48.606" stroke="#6F7988" strokeWidth="2" strokeLinejoin="round" />
      <path d="M144.856 7.11308L146.839 5.13013L167.206 25.5038L95.8567 96.8528" stroke="#6F7988" strokeLinejoin="round" />
      <path d="M179.774 23.2673L167.206 25.5037" stroke="#6F7988" strokeLinejoin="round" />
    </svg>
  );
}

function FormSuccess() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <div ref={ref} role="status" tabIndex={-1} className="flex flex-col items-center gap-4 outline-none">
      <SuccessIcon />
      <h2 className="text-center text-heading-sm text-secondary-foreground">{COPY.successTitle}</h2>
      <p className="text-center text-base text-tertiary-foreground md:max-w-[420px]">
        {COPY.successBodyBefore}
        <a href={`mailto:${COPY.salesEmail}`} className={LINK_CLASS}>
          {COPY.salesEmail}
        </a>
        {"."}
      </p>
    </div>
  );
}

const toOptions = (list: string[]) => list.map((v) => ({ value: v, label: v }));
const yearOptions = toOptions(YEAR_OPTIONS);
const fundingOptions = toOptions(FUNDING_ROUND_OPTIONS);
const amountOptions = toOptions(AMOUNT_RAISED_OPTIONS);
const teamSizeOptions = toOptions(TEAM_SIZE_OPTIONS);

export function StartupForm() {
  const [status, setStatus] = useState<"initial" | "success">("initial");
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const setValue = (name: FieldName, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (isSubmitted) {
      const message = validateField(name, value);
      setErrors((prev) => {
        const next = { ...prev };
        if (message) next[name] = message;
        else delete next[name];
        return next;
      });
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitted(true);
    const found = validateAll(values);
    setErrors(found);
    const first = FIELD_ORDER.find((name) => found[name]);
    if (first) {
      document.getElementById(IDS[first])?.focus();
      return;
    }
    setIsSubmitting(true);
    timer.current = window.setTimeout(() => {
      setIsSubmitting(false);
      setStatus("success");
    }, SUBMIT_MS);
  };

  const text = (name: FieldName, label: string, placeholder: string) => {
    const id = IDS[name];
    const error = errors[name];
    return (
      <div className="flex flex-col gap-y-1.5">
        <Label htmlFor={id}>{label}</Label>
        <div>
          <input
            className={`${INPUT_BASE} ${error ? INPUT_ERR : INPUT_OK}`}
            placeholder={placeholder}
            id={id}
            aria-describedby={error ? `${id}-message` : undefined}
            aria-invalid={!!error}
            type="text"
            name={name}
            value={values[name] ?? ""}
            onChange={(ev) => setValue(name, ev.target.value)}
            suppressHydrationWarning
          />
        </div>
        <FieldMessage id={id} message={error} />
      </div>
    );
  };

  const selectField = (name: FieldName, label: string, options: { value: string; label: string }[]) => {
    const id = IDS[name];
    const error = errors[name];
    return (
      <div className="flex flex-col gap-y-1.5">
        <Label htmlFor={id}>{label}</Label>
        <SalesSelect
          id={id}
          name={name}
          placeholder={COPY.selectPlaceholder}
          options={options}
          value={values[name]}
          isError={!!error}
          onChange={(v) => setValue(name, v)}
        />
        <FieldMessage id={id} message={error} />
      </div>
    );
  };

  if (status === "success") {
    return (
      <div className="mx-auto w-full max-w-lg lg:min-h-[500px] flex flex-col justify-center">
        <FormSuccess />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg lg:min-h-[500px]">
      <form
        id="startup-application-form"
        onSubmit={onSubmit}
        {...{
          toolname: "apply_startups_program",
          tooldescription:
            "Apply to the Joshuattio for Startups program by submitting company details including funding stage, investors, team size, and use case",
        }}
      >
        <div className="flex flex-col gap-y-5">
          <div className="grid grid-cols-2 gap-x-5 gap-y-3 max-md:grid-cols-1">
            {text("firstName", COPY.firstNameLabel, COPY.firstNamePlaceholder)}
            {text("lastName", COPY.lastNameLabel, COPY.lastNamePlaceholder)}
          </div>
          {text("companyEmail", COPY.companyEmailLabel, COPY.companyEmailPlaceholder)}
          <div className="grid grid-cols-2 gap-x-5 gap-y-5 max-md:grid-cols-1">
            {selectField("yearFounded", COPY.yearFoundedLabel, yearOptions)}
            {selectField("latestFundingRound", COPY.fundingRoundLabel, fundingOptions)}
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-5 max-md:grid-cols-1">
            {selectField("totalAmountRaised", COPY.amountRaisedLabel, amountOptions)}
            {selectField("teamSize", COPY.teamSizeLabel, teamSizeOptions)}
          </div>
          {text("investors", COPY.investorsLabel, COPY.investorsPlaceholder)}
          {text("useCase", COPY.useCaseLabel, COPY.useCasePlaceholder)}
        </div>
        <button
          className={BUTTON_CLASS}
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          aria-label={isSubmitting ? COPY.submittingAria : undefined}
        >
          {isSubmitting ? <SubmitLoaderIcon /> : COPY.apply}
        </button>
      </form>
    </div>
  );
}
