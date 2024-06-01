import React from "react";
import { Button } from "../ui/button";
import { UserPlus2 } from "lucide-react";
import Link from "next/link";

export const ToolBar = () => {
  return (
    <div className="w-full flex justify-end gap-2">
      <Link href="/user/add">
        <Button className="gap-2">
          <UserPlus2 className="w-5 h5"></UserPlus2>
          <span>Add user</span>
        </Button>
      </Link>
    </div>
  );
};
