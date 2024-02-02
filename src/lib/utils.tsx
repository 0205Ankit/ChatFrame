import { type ClassValue, clsx } from "clsx";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatName = ({
  name,
  capitalize = false,
}: {
  name: string;
  capitalize?: boolean;
}) => {
  if (name.includes(" ")) {
    if (capitalize) return name.toUpperCase();
    const nameArray = name.split(" ");
    return nameArray
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
  if (name.includes("_")) {
    const nameArray = name.split("_");
    if (capitalize) return nameArray.join(" ").toUpperCase();
    return nameArray
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  } else {
    if (capitalize) return name.toUpperCase();
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }
};

export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export const getCommentWithMentions = ({
  comment,
  userName,
}: {
  comment: string;
  userName: string;
}) => {
  return (
    <pre className="font-sans text-sm">
      <span className="pr-2 font-semibold">{userName}</span>
      {comment.includes(" ") && (
        <>
          {comment.split(" ").map((word, index) => {
            if (word.startsWith("@")) {
              return (
                <Link
                  key={index}
                  className="font-semibold text-primary"
                  href={`/profile/${word.slice(1)}`}
                >
                  {word}{" "}
                </Link>
              );
            }
            return word + " ";
          })}
        </>
      )}
      {!comment.includes(" ") && comment.includes("@") && (
        <>
          <Link
            className="font-semibold text-primary"
            href={`/profile/${comment.slice(1)}`}
          >
            {comment}{" "}
          </Link>
        </>
      )}
      {!comment.includes(" ") && !comment.includes("@") && comment}
    </pre>
  );
};

export const getFormattedTime = (time: Date) => {
  return time.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};
