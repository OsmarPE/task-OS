"use client";

import { Form as FormD } from "@/components/ui/form";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (values: T) => void;
  children: ReactNode;
  className?: string;
}

export function Form<T extends FieldValues>({ form, onSubmit, children, className = "" }: Props<T>) {
  return (
    <FormD {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("grid gap-4", className)}>
        {children}
      </form>
    </FormD>
  );
}
