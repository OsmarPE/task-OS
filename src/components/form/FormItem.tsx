"use client";

import { Control, FieldValues, Path } from "react-hook-form";
import { FormControl, FormField, FormLabel, FormItem as FormItemD, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

interface Props<T extends FieldValues> {
  label: string;
  placeholder?: string;
  control: Control<T>;
  name: Path<T>;
  type?: string;
}

export default function FormItem<T extends FieldValues>({
  label,
  placeholder,
  control,
  name,
  type = "text",
}: Props<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItemD>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} {...field} value={field.value ?? ""} />
          </FormControl>
          <FormMessage />
        </FormItemD>
      )}
    />
  );
}
