import { Button } from "@/components/ui/button";
import { IoMdAdd } from "react-icons/io";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CreateChatDialogContent from "./create-chat-dialog-content";
import { useState } from "react";

const CreateGroupChat = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center justify-between px-4 pt-5 text-2xl font-bold max-lg:justify-center">
      <p className="text-2xl font-bold max-lg:hidden">Chat</p>
      <Button
        onClick={() => setOpen(true)}
        className="rounded-full bg-primary"
        size={"sm"}
      >
        <IoMdAdd className="text-xl" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <CreateChatDialogContent closeDialog={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateGroupChat;
