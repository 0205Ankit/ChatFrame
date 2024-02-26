import { type ClassValue, clsx } from "clsx";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInYears,
} from "date-fns";
import moment from "moment";
import { type Message } from "@prisma/client";

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

export function getElapsedTime(startDate: Date) {
  const currentDate = new Date();

  const minutesDiff = differenceInMinutes(currentDate, startDate);
  const hoursDiff = differenceInHours(currentDate, startDate);
  const daysDiff = differenceInDays(currentDate, startDate);
  const monthsDiff = differenceInMonths(currentDate, startDate);
  const yearsDiff = differenceInYears(currentDate, startDate);

  if (minutesDiff < 60) {
    return `${minutesDiff} m`;
  } else if (hoursDiff < 24) {
    return `${hoursDiff} h`;
  } else if (daysDiff < 30) {
    return `${daysDiff} d`;
  } else if (monthsDiff < 12) {
    return `${monthsDiff} mo`;
  } else {
    return `${yearsDiff} y`;
  }
}

// export function getFormattedDateTime(date: Date) {
//   // Get the current date and time in local timezone
//   const momentDate = date ? moment(date) : moment().local();

//   // Format the weekday as "ddd" (e.g., "Wed")
//   const formattedWeekday = momentDate.format("ddd");

//   // Format the time as "h:mm A" (e.g., "11:45 AM")
//   const formattedTime = momentDate.format("h:mm A");

//   return {
//     weekday: formattedWeekday,
//     time: formattedTime,
//   };
// }

export function getFormattedDateTime(date: Date) {
  const momentDate = date ? moment(date) : moment().local();
  const now = moment();

  const timeDifference = now.diff(momentDate, "hours");

  if (timeDifference < 24) {
    // Less than 24 hours ago, return only time
    const formattedTime = momentDate.format("h:mm A");
    return {
      time: formattedTime,
    };
  } else if (timeDifference < 48) {
    // Between 24 and 48 hours ago, return "yesterday" and time
    const formattedTime = momentDate.format("h:mm A");
    return {
      time: `yesterday ${formattedTime}`,
    };
  } else if (timeDifference < 7 * 24) {
    // Between 2 days and 1 week ago, return weekday and time
    const formattedWeekday = momentDate.format("ddd");
    const formattedTime = momentDate.format("h:mm A");
    return {
      time: `${formattedWeekday} ${formattedTime}`,
    };
  } else {
    // More than a week ago, return date and time
    const formattedDateTime = momentDate.format("DD/MM/YYYY h:mm A");
    return {
      time: formattedDateTime,
    };
  }
}

export const getUnreadMessages = ({
  messages,
  userId,
}: {
  messages: Message[];
  userId: string;
}): number => {
  let numberOfUnreadMessages = 0;
  if (!messages || !userId) numberOfUnreadMessages;

  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i]?.isReadByReciever === true) break;
    if (
      messages[i]?.senderId !== userId &&
      messages[i]?.isReadByReciever === false
    ) {
      numberOfUnreadMessages += 1;
    }
  }

  return numberOfUnreadMessages;
};
