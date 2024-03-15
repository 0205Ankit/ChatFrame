import React from "react";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem } from "Frontend/src/components/ui/form";
import { Switch } from "Frontend/src/components/ui/switch";

interface Field {
  onChange: (checked: boolean) => void;
  value: boolean;
}

const HideCommentsField = () => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name="hideComments"
      render={({ field }: { field: Field }) => {
        return (
          <FormItem>
            <FormControl>
              <div className="mt-4 flex items-center justify-between">
                <p>Turn off commenting</p>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
};

export default HideCommentsField;
