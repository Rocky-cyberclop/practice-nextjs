import React from "react";
import { Button } from "../ui/button";
import { UserPlus2 } from "lucide-react";
import Link from "next/link";
import { SearchToolbar } from "./SearchToolbar";

export const ToolBar = () => {
  return (
    <>
      <div className="flex w-full justify-end gap-2">
        <Link href="/user/add">
          <Button className="gap-2">
            <UserPlus2 className="h5 w-5"></UserPlus2>
            <span>Add user</span>
          </Button>
        </Link>
      </div>

      <div className="w-full gap-2">
        <SearchToolbar />
      </div>
    </>
  );
};
