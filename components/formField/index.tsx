"use client";

import type { ReactNode } from "react";
import { ErrorMessage, Field, type FieldProps } from "formik";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type FormFieldProps = {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  as?: "input" | "textarea";
  rows?: number;
  required?: boolean;
  icon?: ReactNode;
  rightIcon?: ReactNode;
  transform?: (value: string) => string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  readOnly?: boolean;
};

export default function FormField({
  name,
  label,
  placeholder,
  type,
  inputMode,
  maxLength,
  as = "input",
  rows = 4,
  required,
  icon,
  rightIcon,
  transform,
  className,
  inputClassName,
  disabled,
  readOnly,
}: FormFieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="text-dark-secondary-100 mb-2 block text-xs font-medium"
      >
        {label}
      </label>
      <Field name={name}>
        {({ field, meta, form }: FieldProps<string>) => {
          const showError = Boolean(meta.touched && meta.error);
          const handleValueChange = (value: string) => {
            const nextValue = transform ? transform(value) : value;
            form.setFieldValue(name, nextValue);
          };

          if (as === "textarea") {
            return (
              <textarea
                id={name}
                name={name}
                rows={rows}
                value={field.value ?? ""}
                onChange={(event) => handleValueChange(event.target.value)}
                onBlur={field.onBlur}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                readOnly={readOnly}
                className={cn(
                  "bg-background border-line-color focus-visible:ring-primary/50 w-full rounded-lg border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none",
                  disabled && "cursor-not-allowed opacity-50",
                  showError && "border-red-500 focus-visible:ring-red-500/50",
                  inputClassName
                )}
              />
            );
          }

          return (
            <Input
              {...field}
              id={name}
              type={type}
              inputMode={inputMode}
              maxLength={maxLength}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
              readOnly={readOnly}
              icon={icon}
              rightIcon={rightIcon}
              error={showError}
              className={inputClassName}
              onChange={(event) => handleValueChange(event.target.value)}
            />
          );
        }}
      </Field>
      <ErrorMessage
        name={name}
        component="div"
        className="mt-1 text-xs text-red-500"
      />
    </div>
  );
}
