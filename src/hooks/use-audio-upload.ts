import { useUploadThing } from "@/utils/uploadthing";
import React from "react";
import { useToast } from "./use-toast";

const useAudioUpload = () => {
  const { toast } = useToast();
  const [audioUrl, setAudioUrl] = React.useState<string>();
  const [isUploadingAudio, setIsUploadingAudio] = React.useState(false);

  const { startUpload } = useUploadThing("audioFileUploader", {
    onClientUploadComplete: (data) => {
      setIsUploadingAudio(false);
      setAudioUrl(data[0]?.url);
    },
    onUploadError: (err) => {
      toast({
        title: err.message,
        description: "Can't upload more than 1 audio at once",
      });
    },
    onUploadBegin: () => {
      setIsUploadingAudio(true);
    },
  });

  const startUploading = (audio: Blob) => {
    const audioFile = new File([audio], "audio_message.wav", {
      type: "audio/wav",
    });
    void startUpload([audioFile]);
  };

  return {
    startUploading,
    isUploadingAudio,
    audioUrl,
  };
};

export default useAudioUpload;
