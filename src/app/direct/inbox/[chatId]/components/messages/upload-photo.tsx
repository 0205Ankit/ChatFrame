import LoadingScreen from "@/components/loading-screen";
import useSinglePhotoUpload from "@/hooks/use-singlePhoto-upload";
import { api } from "@/trpc/react";
import React, { useEffect } from "react";
import { IoMicOutline } from "react-icons/io5";
import socket from "@/utils/socket";

const UploadPhoto = ({
  chatId,
  senderId,
}: {
  chatId: string;
  senderId: string;
}) => {
  const utils = api.useUtils();
  const { mutate } = api.messages.createMessage.useMutation({
    onSuccess: async () => {
      await Promise.all([
        void utils.chat.getChats.invalidate(),
        void utils.messages.getMessagesByChatId.invalidate(),
      ]);
      socket.emit("new message", chatId);
    },
  });
  const { getInputProps, getRootProps, isUploadingPhoto, photoUrl } =
    useSinglePhotoUpload();

  useEffect(() => {
    if (photoUrl) {
      mutate({
        chatId,
        content: photoUrl,
        senderId,
        type: "PHOTO",
      });
    }
  }, [photoUrl, chatId, mutate, senderId]);

  return (
    <>
      {isUploadingPhoto && <LoadingScreen />}
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <IoMicOutline className="cursor-pointer text-2xl" />
      </div>
    </>
  );
};

export default UploadPhoto;
