"use client";

import { Control, FieldValues, Path } from "react-hook-form";
import { FormControl, FormField, FormLabel, FormItem, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";

interface Props<T extends FieldValues> {
  label: string;
  placeholder?: string;
  control: Control<T>;
  name: Path<T>;
}

export default function FormTextarea<T extends FieldValues>({ label, placeholder, control, name }: Props<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea placeholder={placeholder} {...field} value={field.value ?? ""} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
