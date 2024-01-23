import AppLogo from "./app-logo";
import Search from "./sidebar-actions/search";
import Messages from "./sidebar-actions/messages";
import Create from "./sidebar-actions/create";
import Profile from "./sidebar-actions/profile";
import MoreOptions from "./sidebar-actions/moreOptions";
import Home from "./sidebar-actions/home";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

type PropTypes = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
};

const SideBar = ({ className }: PropTypes) => {
  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 box-border flex min-h-screen flex-col justify-between bg-primaryDark px-4 py-10 text-primaryDark-foreground",
        className,
      )}
    >
      <AppLogo />

      {/* ------------ actions ------------------- */}
      <div className="flex flex-col gap-3">
        <RadioGroup defaultValue="home">
          <div>
            <RadioGroupItem value="home" id="home" className="peer" />
            <Label htmlFor="home" className="bg-white peer-checked:bg-red-800">
              <Home />
            </Label>
          </div>
          <div>
            <RadioGroupItem value="search" id="search" className="" />
            <Label htmlFor="search">
              <Search />
            </Label>
          </div>
          <div>
            <RadioGroupItem value="messages" id="messages" className="" />
            <Label htmlFor="messages">
              <Messages />
            </Label>
          </div>
          <div>
            <RadioGroupItem value="create" id="create" className="" />
            <Label htmlFor="create">
              <Create />
            </Label>
          </div>
          <div>
            <RadioGroupItem value="profile" id="profile" className="" />
            <Label htmlFor="profile">
              <Profile />
            </Label>
          </div>
        </RadioGroup>
      </div>
      <MoreOptions />
    </div>
  );
};

export default SideBar;
