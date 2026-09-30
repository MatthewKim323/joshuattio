"use client";

import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { FREE_EMAIL_DOMAINS, KNOWN_TLDS } from "@/components/pages/contact/sales/email-domains";

// Row-layout email capture: validates on submit, then re-validates on every
// change; a valid submit shows the spinner, then the success dialog.

const COPY = {
  placeholder: "Your email address",
  emailInvalidError: "Please enter a valid email address",
  emailLongError: "Email is too long",
  emailRequiredError: "Please enter email address",
  emailTldError: (tld: string) => `Check the domain: ".${tld}" isn't a valid domain ending`,
  emailWorkError: "Please provide a work email address (e.g. you@company.com)",
  subscribe: "Subscribe",
  successTitle: "Subscription successful",
  successDescription:
    "You've successfully subscribed to product updates. Keep an eye on your inbox, we'll be sending you the latest changes and updates every month.",
};

const SUBMIT_MS = 900;

const EMAIL_RE = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;

function validate(value: string): string | undefined {
  if (value.length < 1) return COPY.emailRequiredError;
  if (value.length > 256) return COPY.emailLongError;
  if (!EMAIL_RE.test(value)) return COPY.emailInvalidError;
  const parts = value.split("@")[1]?.split(".") ?? [];
  if (parts.length >= 2 && !KNOWN_TLDS.has(parts.at(-1)?.toLowerCase() ?? "")) return COPY.emailTldError(value.split(".").at(-1) ?? "");
  if (FREE_EMAIL_DOMAINS.includes(value.split("@")[1]?.toLowerCase() ?? "")) return COPY.emailWorkError;
  return undefined;
}

const INPUT_BASE =
  "block w-full rounded-[10px] bg-primary-background p-[10px_13px] outline-hidden transition-all duration-300 ease-out text-secondary-foreground placeholder:text-accent-foreground";
const INPUT_OK =
  "border border-default-stroke hover:border-greyscale-light-08 hover:shadow-[0px_1px_4px_rgba(56,_62,_71,_0.1)] focus-visible:border-blue-500 focus-visible:ring-[3px] focus-visible:ring-blue-300";
const INPUT_ERR =
  "border border-red-500 hover:border-red-[#CE2E4B] hover:shadow-[0px_1px_4px_rgba(56,_62,_71,_0.1)] focus-visible:border-[#CE2E4B] focus-visible:ring-[3px] focus-visible:ring-red-600/30";
const INPUT_TAIL = "placeholder:max-w-full placeholder-shown:truncate placeholder:text-base";

const BUTTON_BASE =
  "inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default";

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

function SuccessDialog({ onClose, returnFocus }: { onClose: () => void; returnFocus: () => void }) {
  const titleId = useId();
  const descId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Tab") {
        e.preventDefault();
        closeRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      returnFocus();
    };
  }, [onClose, returnFocus]);

  return createPortal(
    <>
      <div
        data-state="open"
        className="fixed top-0 left-0 z-(--dialog-overlay-z-index) h-screen w-screen bg-black-100/50 backdrop-blur-xs data-open:fade-in data-open:animate-in data-open:duration-300 data-open:ease-out"
        style={{ pointerEvents: "auto" }}
        onPointerDown={onClose}
      />
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        data-state="open"
        tabIndex={-1}
        className="group container fixed top-1/2 left-1/2 z-(--dialog-content-z-index) max-w-xl -translate-x-1/2 -translate-y-[50%]"
        style={{ pointerEvents: "auto" }}
      >
        <div className="relative rounded-3xl bg-surface-subtle p-8 group-data-open:fade-in-30 group-data-open:zoom-in-90 group-data-open:slide-in-from-bottom-6 origin-top group-data-open:animate-in group-data-open:duration-300 group-data-open:ease-out">
          <button ref={closeRef} type="button" onClick={onClose} className={`${BUTTON_BASE} size-9 rounded-[10px] button-outline absolute top-8 right-8`}>
            <svg className="text-black-500 dark:text-white-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1" d="m12.5 5.5-7 7m7 0-7-7" />
            </svg>
          </button>
          <div className="flex flex-col items-center gap-4 pt-[111px] pb-[102px]">
            <SuccessIcon />
            <h2 id={titleId} className="text-center text-heading-sm text-secondary-foreground">
              {COPY.successTitle}
            </h2>
            <p id={descId} className="text-center text-tertiary-foreground">
              {COPY.successDescription}
            </p>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}

export function SubscribeForm({ className }: { className?: string }) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timer = useRef(0);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => () => window.clearTimeout(timer.current), []);
  const closeDialog = useCallback(() => setSuccess(false), []);
  const refocus = useCallback(() => buttonRef.current?.focus(), []);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitted(true);
    const message = validate(value);
    setError(message);
    if (message) {
      inputRef.current?.focus();
      return;
    }
    setSubmitting(true);
    timer.current = window.setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
    }, SUBMIT_MS);
  };

  const messageId = `${id}-message`;

  return (
    <>
      <form
        className={`relative grid min-h-16 w-full max-w-sm items-start gap-2 md:grid-cols-[1fr_min-content] [&_button]:h-10 [&_input]:h-10! ${className ?? ""}`}
        toolname="subscribe_newsletter"
        tooldescription="Subscribe to Joshuattio product updates and newsletters with a work email address"
        onSubmit={onSubmit}
        noValidate
      >
        <div className="flex flex-col gap-y-1.5 relative">
          <div>
            <input
              ref={inputRef}
              className={`${INPUT_BASE} ${error ? INPUT_ERR : INPUT_OK} ${INPUT_TAIL}`}
              type="text"
              placeholder={COPY.placeholder}
              id={id}
              aria-describedby={error ? messageId : undefined}
              aria-invalid={!!error}
              name="email"
              value={value}
              onChange={(ev) => {
                const next = ev.target.value;
                setValue(next);
                if (submitted) setError(validate(next));
              }}
            />
          </div>
          {error ? (
            <p id={messageId} className="fade-in animate-in font-normal text-red-600 text-xs duration-300 ease-out absolute top-full right-0 left-0 mt-1.5">
              {error}
            </p>
          ) : null}
        </div>
        <button
          ref={buttonRef}
          className={`${BUTTON_BASE} h-11.5 gap-x-2 rounded-xl px-3.5 text-base has-[>svg:last-child,>img:last-child]:pr-3 has-[>svg:first-child,>img:first-child]:pl-3 button-primary relative`}
          type="submit"
          disabled={submitting}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={`animate-spin transition-opacity duration-150 ${submitting ? "opacity-100" : "opacity-0"}`}>
              <circle cx="9" cy="9" r="8" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1.5" />
              <path
                d="M17 9C17 10.0506 16.7931 11.0909 16.391 12.0615C15.989 13.0321 15.3997 13.914 14.6569 14.6569C13.914 15.3997 13.0321 15.989 12.0615 16.391C11.0909 16.7931 10.0506 17 9 17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className={`transition-opacity duration-150${submitting ? " opacity-0" : ""}`}>{COPY.subscribe}</span>
        </button>
      </form>
      {success ? <SuccessDialog onClose={closeDialog} returnFocus={refocus} /> : null}
    </>
  );
}

