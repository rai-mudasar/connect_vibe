import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

export function FacebookSearchDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-60 h-10 text-[#333334] dark:text-white bg-[#F0F2F5] dark:bg-neutral-700 md:rounded-2xl flex items-center justify-start pl-6 gap-2">
          <Search size={30} className="text-neutral-400 stroke-[2px]" />
          <p className="text-neutral-500 dark:placeholder:text-neutral-400 text-sm">
            Search Facebook
          </p>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md absolute top-6 left-65 border-0 shadow-none" showCloseButton={false}>
        <DialogHeader className={"hidden"}>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>

        <div className="w-60 h-10 text-[#333334] dark:text-white bg-[#F0F2F5] dark:bg-neutral-700 md:rounded-2xl flex items-center justify-center pl-6 gap-2">
          <Search size={30} className="text-neutral-400 stroke-[2px]" />
          <input
            type="text"
            placeholder="Search Facebook"
            className="bg-transparent outline-none placeholder:text-neutral-500 dark:placeholder:text-neutral-400 w-full h-full text-sm"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
