import React from 'react'
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { TextareaWithCounter } from '@/components/textarea-with-counter';

const CaptionField = () => {
    const form = useFormContext()
  return (
    <FormField
      control={form.control}
      name="caption"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <TextareaWithCounter
              placeholder="caption..."
              hasCounter
              maxChars={2000}
              {...field}
              className="max-h-[100px] min-h-[100px] border-none px-0 focus-visible:ring-0"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

export default CaptionField