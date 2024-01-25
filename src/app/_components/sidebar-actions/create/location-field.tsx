import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { useFormContext } from "react-hook-form";
import { IoLocationOutline } from "react-icons/io5";

const LocationField = () => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="flex items-center gap-2">
              <Input
                className="border-none px-0 focus-visible:ring-0"
                autoComplete="off"
                placeholder="location"
                {...field}
              />
              <IoLocationOutline className="text-xl" />
            </div>
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};

export default LocationField;
