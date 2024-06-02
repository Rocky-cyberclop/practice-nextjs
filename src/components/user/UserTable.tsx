import React, { useEffect, useState } from "react";
import {
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "../ui/table";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { toast } from "sonner";

export enum ActiveYn {
  Y = "Y",
  N = "N",
}

export interface User {
  username: string;
  fullname: string;
  role: string;
  projects: string[] | null;
  activeYn: ActiveYn;
}

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        process.env.NEXT_PUBLIC_SERVER_URL! + "/user/search",
        {
          params: {},
        }
      );
      setUsers(res.data);
    } catch (ex) {
      console.error(ex);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  const removeUser = async (username: string) => {
    try {
      const res = await axios.delete(
        process.env.NEXT_PUBLIC_SERVER_URL! + `/user/${username}`
      );
      if (res.status === 200) toast.success("Delete successfully!");
    } catch (ex) {
      console.error(ex);
    }
  };
  async function handleDeleteUser(username: string) {
    await removeUser(username);
    await fetchUsers();
  }

  return (
    <Table className="mt-5">
      <TableCaption>A list of your recent users.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Username</TableHead>
          <TableHead>Full name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Projects</TableHead>
          <TableHead>ActiveYn</TableHead>
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <>
          {users.length > 0 ? (
            users.map((user: User, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.fullname}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell className="flex flex-wrap">
                  {user.projects?.map((project: string, index) => (
                    <span
                      key={index}
                      className="bg-gray-300 ms-1 mb-1 p-1 rounded"
                    >
                      {project}
                    </span>
                  ))}
                </TableCell>
                <TableCell>{user.activeYn}</TableCell>
                <TableCell>
                  <div className=" flex justify-center items-center gap-2 h-full">
                    <Link href={`/user/edit/${user.username}`}>
                      <Button className="p-5 bg-blue-500">
                        <Pencil />
                      </Button>
                    </Link>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="p-5 bg-red-500">
                          <Trash2 />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you absolutely sure?</DialogTitle>
                          <DialogDescription>
                            You want to delete user {user.username}
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button
                              className="bg-red-700"
                              onClick={() => handleDeleteUser(user.username)}
                            >
                              Confirm
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <></>
          )}
        </>
      </TableBody>
    </Table>
  );
};

export default UserTable;
