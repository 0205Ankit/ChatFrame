import Image from "next/image";
import Link from "next/link";
import React from "react";

const WelcomeMessage = () => {
  return (
    <div className="mx-auto flex h-screen w-10/12 flex-col items-center justify-center gap-1">
      <Image
        src="/appLogo.svg"
        alt="logo"
        width={200}
        height={200}
        className="mb-5 w-[300px]"
      />
      <h1 className="text-xl font-semibold">
        👋 Hey there, Welcome to ChatFrame!
      </h1>
      <p className="text-center">
        I&apos;m Ankit, and this is my personal project. It&apos;s a bit of a
        playground where you can <strong>post pics</strong>,
        <strong>chat</strong> with folks, and just have a good time.
      </p>
      <h1 className="mt-4 text-xl font-semibold">📸 What&apos;s Inside?</h1>
      <p className="text-center">
        Feel free to share your moments, chat <strong>one-on-one</strong> or in{" "}
        <strong>groups</strong>, and drop a <strong>like</strong> or{" "}
        <strong>comment</strong> on posts. Oh, and we&apos;ve got those nifty{" "}
        <strong>real-time</strong> notifications in the chat.
      </p>
      <h1 className="mt-4 text-xl font-semibold">🕵️‍♂️ Test the Waters</h1>
      <p className="text-center">
        Since this is just my pet project, you might want to follow{" "}
        <Link
          className="font-semibold text-primary underline"
          href={"/profile/ankit"}
        >
          @ankit
        </Link>{" "}
        to check out some posts on your feed. Or better yet, create your own
        account! No email confirmation needed, so go ahead and make as many as
        you want. Try out group chats or just shoot me a message.
      </p>
      <h1 className="mt-4 text-xl font-semibold">👉 Thanks for Swinging By!</h1>
      <p className="text-center">
        I&apos;m stoked that you dropped in. If you&apos;ve got any questions,
        ideas, or just want to chat about coding, or anything else, hit me up.
        And if you&apos;re curious about the code behind the scenes, it&apos;s
        all on{" "}
        <Link
          className="font-semibold text-primary underline"
          href={"https://github.com/0205Ankit/ChatFrame"}
          target="_blank"
        >
          Github
        </Link>{" "}
        .
      </p>
    </div>
  );
};

export default WelcomeMessage;
