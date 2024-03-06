import { Button } from "@/components/ui/button";
import { IoMdAdd } from "react-icons/io";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CreateChatDialogContent from "./chat-dialog-content";

const CreateGroupChat = () => {
  return (
    <div className="flex items-center justify-between px-4 pt-5 text-2xl font-bold max-lg:justify-center">
      <p className="text-2xl font-bold max-lg:hidden">Chat</p>
      <Dialog>
        <DialogTrigger>
          <Button className="rounded-full bg-primary" size={"sm"}>
            <IoMdAdd className="text-xl" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <CreateChatDialogContent />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateGroupChat;
