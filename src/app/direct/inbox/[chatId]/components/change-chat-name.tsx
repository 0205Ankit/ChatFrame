import { Button } from "Frontend/src/components/ui/button";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "Frontend/src/components/ui/dialog";
import { Input } from "Frontend/src/components/ui/input";
import { api } from "Frontend/src/trpc/react";

const ChangeChatName = ({ chatId }: { chatId: string }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const utils = api.useUtils();

  

  const { mutate } = api.chat.updateChatName.useMutation({
    onSuccess: () => {
      void utils.chat.getChats.invalidate();
      void utils.chat.getChatsById.invalidate();
      setOpen(false);
      setName("");
    },
  });

  const changeNameHandler = async () => {
    if (name.length > 15) {
      setError(true);
      return;
    }
    mutate({ chatId, name });
  };

  return (
    <div className="flex items-center justify-between py-5 text-lg font-medium">
      Change group name{" "}
      <Button
        onClick={() => setOpen(true)}
        size={"sm"}
        className="px-4 text-xs"
      >
        Change
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change group name</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Changing the name of a group chat changes it for everyone.
          </DialogDescription>
          <div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="focus-visible:ring-0"
              placeholder="Add a name"
            />
            {error && (
              <p className="my-1 text-sm text-red-500">Name is too long</p>
            )}
          </div>
          <Button
            onClick={changeNameHandler}
            disabled={name.length > 15}
            className="w-full"
          >
            Save
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChangeChatName;
