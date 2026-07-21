import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, id, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink-secondary">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`rounded-xl border border-border bg-raised px-3 py-2 text-sm text-ink placeholder:text-ink-muted transition-all duration-150 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50 ${error ? "border-danger" : ""} ${className}`}
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
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink-secondary">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`rounded-xl border border-border bg-raised px-3 py-2 text-sm text-ink placeholder:text-ink-muted transition-all duration-150 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50 resize-y min-h-20 ${error ? "border-danger" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
