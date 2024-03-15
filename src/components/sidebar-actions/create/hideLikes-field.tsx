import React from "react";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

interface Field {
  onChange: (checked: boolean) => void;
  value: boolean;
}

const HideLikesField = () => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name="hideLikes"
      render={({ field }: { field: Field }) => (
        <FormItem>
          <FormControl>
            <div className="flex items-center justify-between">
              <p>Hide likes on this post</p>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default HideLikesField;
