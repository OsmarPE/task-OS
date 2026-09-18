"use client";

import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReactNode } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Control, FieldValues, Path } from "react-hook-form";

interface Props<T extends FieldValues> {
  className?: string;
  placeholder: string;
  children: ReactNode;
  name: Path<T>;
  label: string;
  control: Control<T>;
}

export default function SelectForm<T extends FieldValues>({ placeholder, children, name, label, control }: Props<T>) {
  return (
    <div>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>{children}</SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
