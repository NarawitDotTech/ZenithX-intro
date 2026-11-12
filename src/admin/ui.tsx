"use client";

import { useId, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";

const control =
  "w-full rounded-lg border border-line-strong bg-bg px-3 py-2.5 text-[15px] text-text placeholder:text-muted/60 transition-colors focus:border-accent focus:outline-none";

type FieldProps = {
  label: string;
  hint?: string;
  children: (id: string) => ReactNode;
  className?: string;
};

export const Field = ({ label, hint, children, className = "" }: FieldProps) => {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children(id)}
      {hint ? <p className="mt-1.5 text-xs text-muted">{hint}</p> : null}
    </div>
  );
};

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> & {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
};

export const TextField = ({ label, hint, value, onChange, className, ...rest }: TextFieldProps) => (
  <Field label={label} hint={hint} className={className}>
    {(id) => <input id={id} value={value} onChange={(e) => onChange(e.target.value)} className={control} {...rest} />}
  </Field>
);

type TextAreaFieldProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "value"> & {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
};

export const TextAreaField = ({ label, hint, value, onChange, className, rows = 4, ...rest }: TextAreaFieldProps) => (
  <Field label={label} hint={hint} className={className}>
    {(id) => (
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${control} resize-y leading-relaxed`}
        {...rest}
      />
    )}
  </Field>
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

const variants = {
  primary: "bg-accent text-[var(--accent-ink)] hover:brightness-110 disabled:opacity-50",
  secondary: "border border-line-strong hover:border-accent hover:text-accent disabled:opacity-50",
  ghost: "text-muted hover:text-text hover:bg-surface-2",
  danger: "text-red-300 hover:bg-red-500/10 hover:text-red-200",
};

export const Button = ({ variant = "secondary", className = "", type = "button", ...rest }: ButtonProps) => (
  <button
    type={type}
    className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium transition disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    {...rest}
  />
);

/** Small square button for list controls; `label` becomes the accessible name and tooltip. */
export const IconButton = ({
  label,
  children,
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    className={`grid size-9 shrink-0 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-line-strong hover:text-text disabled:opacity-30 ${className}`}
    {...rest}
  >
    {children}
  </button>
);

export const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`rounded-2xl border border-line bg-surface p-5 md:p-6 ${className}`}>{children}</div>
);

export const SectionTitle = ({ title, description, action }: { title: string; description?: string; action?: ReactNode }) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h2 className="text-2xl font-semibold">{title}</h2>
      {description ? <p className="mt-1 max-w-xl text-sm text-muted">{description}</p> : null}
    </div>
    {action}
  </div>
);

/** Move an item within an array (returns a new array). */
export const move = <T,>(list: T[], from: number, to: number) => {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};
