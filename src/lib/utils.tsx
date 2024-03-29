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

export function getFormattedDateTime(date: Date) {
  const momentDate = date ? moment(date) : moment().local();
  const now = moment();

  const timeDifference = now.diff(momentDate, "days");

  if (now.isSame(momentDate, "day")) {
    // Less than 24 hours ago, return only time
    const formattedTime = momentDate.format("HH:mm");
    return {
      time: `Today, ${formattedTime}`,
    };
  } else if (timeDifference < 2) {
    // Between 24 and 48 hours ago, return "yesterday" and time
    const formattedTime = momentDate.format("HH:mm");
    return {
      time: `Yesterday, ${formattedTime}`,
    };
  } else if (timeDifference < 7) {
    // Between 2 days and 1 week ago, return weekday and time
    const formattedWeekday = momentDate.format("ddd");
    const formattedTime = momentDate.format("HH:mm");
    return {
      time: `${formattedWeekday}, ${formattedTime}`,
    };
  } else {
    // More than a week ago, return date and time
    const formattedDateTime = momentDate.format("DD/MM/YYYY HH:mm");
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
    const message = messages[i];
    if (message?.isReadByRecievers!.includes(userId)) break;
    if (
      message?.senderId !== userId &&
      !message?.isReadByRecievers!.includes(userId)
    ) {
      numberOfUnreadMessages += 1;
    }
  }

  return numberOfUnreadMessages;
};

export const getLastMessage = (message: Message | undefined) => {
  if (!message) return;

  if (message.type === "TEXT") {
    return message.content;
  }

  if (message.type === "PHOTO") {
    return "Sent a photo";
  }

  if (message.type === "AUDIO") {
    return "Sent a voice message";
  }
};

export const getFormattedElapsedSeconds = ({
  seconds,
}: {
  seconds: number;
}) => {
  if (seconds < 60) {
    return `00:${seconds < 10 ? "0" + seconds : seconds}`;
  } else if (seconds >= 60) {
    return `${Math.floor(seconds / 60) < 10 ? `0${Math.floor(seconds / 60)}` : Math.floor(seconds / 60)}:${seconds % 60 < 10 ? "0" + (seconds % 60) : seconds % 60}`;
  }
  return seconds;
};
