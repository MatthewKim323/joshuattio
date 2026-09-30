import { FREE_EMAIL_DOMAINS, KNOWN_TLDS } from "./email-domains";

// Copy for the sales form (field labels, placeholders, errors, success state).
export const COPY = {
  companyEmailLabel: "Company email",
  companyEmailPlaceholder: "Your work email",
  companySizeError: "Please select your company size",
  companySizeLabel: "Number of users",
  detailsError: "Please tell us how we can help",
  detailsLabel: "Details",
  detailsPlaceholder: "Tell us about your needs and questions",
  emailInvalidError: "Please enter a valid email address",
  emailLongError: "Email is too long",
  emailRequiredError: "Please enter your work email",
  emailTldError: (tld: string) => `Check the domain: ".${tld}" isn't a valid domain ending`,
  emailWorkError: "Please provide a work email address (e.g. you@company.com)",
  firstNameError: "Please enter your first name",
  firstNameLabel: "First name",
  firstNamePlaceholder: "First",
  lastNameError: "Please enter your last name",
  lastNameLabel: "Last name",
  lastNamePlaceholder: "Last",
  phoneNumberInvalidError: "Please enter a valid phone number in international format (e.g., +1 202 555 0123)",
  phoneNumberLabel: "Phone number (optional)",
  phoneNumberLongError: "Phone number is too long",
  phoneNumberPlaceholder: "Your phone number",
  regionError: "Please select your region",
  regionLabel: "Region",
  selectPlaceholder: "Select",
  submit: "Submit",
  successTitle: "We'll be in touch soon!",
  successTitleMobile: "We've received your application!",
  successBodyBefore: "Our team will be in touch soon. If you have any questions, please email us at ",
  successBodyMobileBefore: "Our team will review your application shortly. If you have any questions, please email us at ",
  salesEmail: "sales@joshuattio.com",
} as const;

export const REGION_OPTIONS = ["North America", "Europe", "Rest of World"] as const;
export const TEAM_SIZE_OPTIONS = ["1 to 5", "6 to 10", "11 to 20", "21 to 50", "51 to 100", "101+"] as const;

export type FieldName =
  | "firstName"
  | "lastName"
  | "companyEmail"
  | "phoneNumber"
  | "region"
  | "companySize"
  | "details";

// Registration order of the fields (the order errors are resolved in).
export const FIELD_ORDER: FieldName[] = [
  "firstName",
  "lastName",
  "companyEmail",
  "phoneNumber",
  "region",
  "companySize",
  "details",
];

export type Values = Partial<Record<FieldName, string>>;
export type Errors = Partial<Record<FieldName, string>>;

// Same pattern as the schema library's email check.
const EMAIL_RE = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;

const tldOf = (value: string) => value.split(".").at(-1) ?? "";

function isKnownTld(value: string) {
  const [, domain] = value.split("@");
  const parts = domain?.split(".") ?? [];
  return parts.length < 2 || KNOWN_TLDS.has(parts.at(-1)?.toLowerCase() ?? "");
}

const isWorkEmail = (value: string) => !FREE_EMAIL_DOMAINS.includes(value.split("@")[1]?.toLowerCase() ?? "");

// International format check: optional leading +, a country calling code and
// 7 to 15 digits overall (E.164), common separators allowed.
function isValidPhone(raw: string) {
  const value = raw.split("‭").join("");
  const withPlus = value.startsWith("+") ? value : `+${value}`;
  if (!/^\+[\d\s().\-]+$/.test(withPlus)) return false;
  const digits = withPlus.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) return false;
  return digits[0] !== "0";
}

// First failing check per field wins, in declaration order.
export function validateField(name: FieldName, value: string | undefined): string | undefined {
  switch (name) {
    case "firstName":
      return !value ? COPY.firstNameError : undefined;
    case "lastName":
      return !value ? COPY.lastNameError : undefined;
    case "details":
      return !value ? COPY.detailsError : undefined;
    case "companyEmail": {
      if (value === undefined || value.length < 1) return COPY.emailRequiredError;
      if (value.length > 256) return COPY.emailLongError;
      if (!EMAIL_RE.test(value)) return COPY.emailInvalidError;
      if (!isKnownTld(value)) return COPY.emailTldError(tldOf(String(value)));
      if (!isWorkEmail(value)) return COPY.emailWorkError;
      return undefined;
    }
    case "phoneNumber": {
      if (value === undefined) return undefined;
      if (value.length > 30) return COPY.phoneNumberLongError;
      if (!value) return undefined;
      return isValidPhone(value) ? undefined : COPY.phoneNumberInvalidError;
    }
    case "region":
      return (REGION_OPTIONS as readonly string[]).includes(value ?? "") ? undefined : COPY.regionError;
    case "companySize":
      return (TEAM_SIZE_OPTIONS as readonly string[]).includes(value ?? "") ? undefined : COPY.companySizeError;
  }
}

export function validateAll(values: Values): Errors {
  const errors: Errors = {};
  for (const name of FIELD_ORDER) {
    const message = validateField(name, values[name]);
    if (message) errors[name] = message;
  }
  return errors;
}
