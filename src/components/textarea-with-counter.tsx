import React, { useState, type ChangeEvent } from "react";
import {
  TextareaAutosize as Textarea,
  type TextareaAutosizeProps,
} from "./textarea-autosize";
import { cn } from "@/lib/utils";

type TextareaWithCounterProps = TextareaAutosizeProps & {
  hasCounter?: boolean;
  maxChars?: number;
};

export const TextareaWithCounter: React.FC<TextareaWithCounterProps> = ({
  hasCounter,
  maxChars,
  onChange,
  className,
  ...props
}) => {
  const [count, setCount] = useState(0);

  const handleCount = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    // Removed the early return, so users can continue typing
    setCount(value.length);

    if (onChange) {
      onChange(e);
    }
  };

  const withinTwentyPercent = maxChars ? count >= maxChars * 0.8 : false;

  return (
    <div className="relative">
      <Textarea
        {...props}
        onChange={handleCount}
        className={cn(
          hasCounter && withinTwentyPercent ? "pt-8" : "",
          withinTwentyPercent
            ? "border-warning focus-visible:ring-warning"
            : "",
          count >= (maxChars ?? Number.POSITIVE_INFINITY)
            ? "border-error focus-visible:ring-error"
            : "",
          "min-h-[200px]",
          className,
        )}
      />
      {hasCounter && withinTwentyPercent && (
        <span
          className={cn(
            "badge badge-lg absolute right-3 top-2 rounded-md bg-primaryDark px-3 py-1 text-xs font-bold",
            withinTwentyPercent ? "text-warning" : "",
            count >= (maxChars ?? Number.POSITIVE_INFINITY) ? "text-error" : "",
          )}
        >
          {maxChars ? maxChars - count : ``}
        </span>
      )}
    </div>
  );
};
