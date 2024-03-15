import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

export default function LoadingScreen() {
  return (
    <AlertDialog open={true}>
      <AlertDialogContent className="flex items-center justify-center border-none bg-transparent shadow-none">
        <Loader2 className="h-20 w-20 animate-spin text-slate-200" />
      </AlertDialogContent>
    </AlertDialog>
  );
}
