import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, id, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 group">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-ink-secondary transition-colors duration-200 group-focus-within:text-accent"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`rounded-xl border border-border bg-raised px-3 py-2 text-sm text-ink placeholder:text-ink-muted transition-all duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15 focus:shadow-sm focus:shadow-accent/10 disabled:opacity-50 hover:border-ink-muted/30 ${error ? "border-danger" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, id, className = "", ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5 group">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-ink-secondary transition-colors duration-200 group-focus-within:text-accent"
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`rounded-xl border border-border bg-raised px-3 py-2 text-sm text-ink placeholder:text-ink-muted transition-all duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15 focus:shadow-sm focus:shadow-accent/10 disabled:opacity-50 resize-y min-h-20 hover:border-ink-muted/30 ${error ? "border-danger" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
