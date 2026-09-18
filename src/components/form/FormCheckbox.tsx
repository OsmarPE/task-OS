"use client";

import { Control, FieldValues, Path } from "react-hook-form";
import { FormControl, FormField, FormLabel, FormItem } from "../ui/form";
import { Checkbox } from "../ui/checkbox";

interface Props<T extends FieldValues> {
  label: string;
  control: Control<T>;
  name: Path<T>;
}

export default function FormCheckbox<T extends FieldValues>({ control, label, name }: Props<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>{label}</FormLabel>
          </div>
        </FormItem>
      )}
    />
  );
}
