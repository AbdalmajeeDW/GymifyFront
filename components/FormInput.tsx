"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";

type FormInputProps = {
  icon?: React.ReactNode;
  label: string;
  type: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  autoComplete?: string;
  showError?: boolean;
  errorMessage?: string;
  name?: string;
};

export default function FormInput({
  icon,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  disabled = false,
  className = "",
  id,
  name,
  autoComplete,
  showError = false,
  errorMessage = "",
}: FormInputProps) {
  const [internalError, setInternalError] = useState("");

  useEffect(() => {
    if (!showError) return;
    let newError = "";

    if (required && !value.trim()) {
      newError = "The field is required";
    } else if (type === "email" && value && !/^\S+@\S+\.\S+$/.test(value)) {
      newError = "بريد إلكتروني غير صالح";
    }

    setInternalError(newError);
  }, [value, required, type, showError]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    if (internalError) {
      setInternalError("");
    }
  };

  const hasError = (internalError && showError) || (showError && errorMessage);
  const finalErrorMessage = errorMessage || internalError;
  const inputId = id || label.replace(/\s+/g, "-").toLowerCase();

  const inputPadding = icon ? "pl-10 pr-3" : "px-3";

  return (
    <div className={`${className}`}>
      <label
        htmlFor={inputId}
        className={`block text-sm font-medium mb-1 ${hasError ? "text-red-600" : "text-gray-700"}`}
      >
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors z-10">
            <span className="[&>svg]:w-4 [&>svg]:h-4">{icon}</span>
          </span>
        )}

        <Input
          id={inputId}
          type={type}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          name={name}
          autoComplete={autoComplete}
          className={`
          ${inputPadding} py-2 border rounded-md focus:outline-none w-full
          ${
            hasError
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
          }
          ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
          ${type === "email" ? "ltr text-left" : "rtl text-right"}
        `}
          dir={type === "email" ? "ltr" : "rtl"}
        />
      </div>

      {hasError && finalErrorMessage && (
        <p className="mt-1 text-sm text-red-600">{finalErrorMessage}</p>
      )}
    </div>
  );
}
