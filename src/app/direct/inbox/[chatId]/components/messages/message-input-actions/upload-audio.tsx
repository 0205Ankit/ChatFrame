import React, { useEffect, useState } from "react";
import { IoMicOutline } from "react-icons/io5";
import { FaRegCircleStop } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { useAudioRecorder } from "react-audio-voice-recorder";
import { IoIosClose } from "react-icons/io";
import { getFormattedElapsedSeconds } from "@/lib/utils";
import { IoPlayCircle } from "react-icons/io5";
import { FaPauseCircle } from "react-icons/fa";
import useAudioUpload from "@/hooks/use-audio-upload";
import { api } from "@/trpc/react";
import socket from "@/utils/socket";
import LoadingScreen from "@/components/loading-screen";

const UploadAudio = ({
  chatId,
  senderId,
}: {
  chatId: string;
  senderId: string;
}) => {
  const [showRecording, setShowRecording] = useState(false);
  const [playRecording, setPlayRecording] = useState(true);
  const [audioDuration, setAudioDuration] = useState(0); //in seconds
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const {
    startRecording,
    stopRecording,
    recordingBlob,
    isRecording,
    recordingTime,
  } = useAudioRecorder();
  const { startUploading, isUploadingAudio, audioUrl } = useAudioUpload();
  const utils = api.useUtils();
  const { mutate } = api.messages.createMessage.useMutation({
    onSuccess: async () => {
      await Promise.all([
        void utils.chat.getChats.invalidate(),
        void utils.messages.getMessagesByChatId.invalidate(),
      ]);
      socket.emit("new message", chatId);
      setShowRecording(false);
    },
  });

  const startRecordingHandler = () => {
    setShowRecording(true);
    startRecording();
  };

  const stopRecordingHandler = () => {
    stopRecording();
    setAudioDuration(recordingTime);
    setAudioDuration(0);
  };

  const closeAudioMedia = () => {
    stopRecording();
    setShowRecording(false);
  };

  useEffect(() => {
    if (!recordingBlob) return;
    const audio = new Audio(URL.createObjectURL(recordingBlob));
    setAudio(audio);
  }, [recordingBlob]);

  const playRecordingHandler = () => {
    setPlayRecording(false);
    void audio?.play();
  };

  useEffect(() => {
    if (!audio) return;
    const handleAudioPause = () => {
      setPlayRecording(true);
    };
    audio.addEventListener("ended", handleAudioPause);
    return () => {
      audio.removeEventListener("ended", handleAudioPause);
    };
  }, [audio]);

  useEffect(() => {
    if (audioUrl) {
      mutate({
        chatId,
        content: audioUrl,
        senderId,
        type: "AUDIO",
      });
    }
  }, [audioUrl, chatId, mutate, senderId]);

  const pauseRecordingHandler = () => {
    setPlayRecording(true);
    void audio?.pause();
  };

  const sendAudioMessageHandler = () => {
    if (!recordingBlob) return;
    startUploading(recordingBlob);
  };

  return (
    <>
      {isUploadingAudio && <LoadingScreen />}
      {!showRecording ? (
        <Button onClick={startRecordingHandler} variant={"noStyle"} size={"xs"}>
          <IoMicOutline className="text-2xl" />
        </Button>
      ) : (
        <div className="max-w[400]:w-full flex w-[300px] items-center rounded-full bg-primary px-2 text-white">
          <Button
            className="h-fit w-fit rounded-full p-0 text-white"
            onClick={closeAudioMedia}
            variant={"noStyle"}
            size={"xs"}
          >
            <IoIosClose className="text-xl" />
          </Button>
          <div className="flex w-full items-center justify-between">
            <span className="rounded-full bg-white px-2 text-sm text-primary">
              {recordingTime
                ? getFormattedElapsedSeconds({ seconds: recordingTime })
                : getFormattedElapsedSeconds({ seconds: audioDuration })}
            </span>
            {isRecording ? (
              <Button
                onClick={stopRecordingHandler}
                className="text-white"
                variant={"noStyle"}
                size={"xs"}
              >
                <FaRegCircleStop className="text-xl" />
              </Button>
            ) : (
              <>
                {playRecording ? (
                  <Button
                    onClick={playRecordingHandler}
                    className="text-white"
                    variant={"noStyle"}
                    size={"xs"}
                  >
                    <IoPlayCircle className="text-2xl" />
                  </Button>
                ) : (
                  <Button
                    onClick={pauseRecordingHandler}
                    className="text-white"
                    variant={"noStyle"}
                    size={"xs"}
                  >
                    <FaPauseCircle className="text-xl" />
                  </Button>
                )}
              </>
            )}
          </div>
          {recordingBlob && (
            <button
              className="text-xs font-semibold"
              onClick={sendAudioMessageHandler}
            >
              send
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default UploadAudio;
