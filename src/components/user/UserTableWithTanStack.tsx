import React from "react";
import axios from "axios";
import { toast } from "sonner";
import { useUserContext } from "@/lib/context";
import { DataTable } from "../general/data-table";
import { ColumnDef } from "@tanstack/react-table";
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
import { ArrowUpDown, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { EditUserForm } from "./EditUserForm";

export enum ActiveYn {
  Y = "Y",
  N = "N",
}

export interface User {
  id: number;
  username: string;
  fullName: string;
  role: string;
  projects: Project[];
  activeYn: ActiveYn;
}

export interface Project {
  id: number;
  name: string;
}

const handleAction = (
  user: User,
  handleDeleteUser: { (username: string): Promise<void>; (arg0: string): void },
) => {
  return (
    <div className="flex flex-wrap gap-2">
      <div>
        <EditUserForm user={user} />
      </div>
      <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-red-500 p-5">
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
    </div>
  );
};

const UserTableWithTanStack = () => {
  const { users, setUsers } = useUserContext();

  const removeUser = async (username: string) => {
    try {
      const res = await axios.delete(
        process.env.NEXT_PUBLIC_SERVER_URL! + `/user/${username}`,
      );
      if (res.status === 200) {
        toast.success("Delete successfully!");
        setUsers((pre) => {
          return pre.filter((user: User) => user.username != username);
        });
      }
    } catch (ex) {
      console.error(ex);
    }
  };

  async function handleDeleteUser(username: string) {
    await removeUser(username);
    // await fetchUsers();
  }

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "username",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Username
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "fullName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Full name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "role",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Role
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "projects",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Project
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      sortingFn: (rowA, rowB) => {
        let res = 0;
        const aProjects = rowA.original.projects;
        const bProjects = rowB.original.projects;
        res = aProjects.length > bProjects.length ? 1 : -1;
        if (aProjects.length === bProjects.length) {
          res = aProjects[0].name > bProjects[0].name ? 1 : -1;
        }
        return res;
      },
      cell: ({ row }) => {
        const projects: Project[] = row.getValue("projects");
        return (
          <div className="flex flex-wrap">
            {projects?.map((project: Project) => (
              <span
                key={project.id}
                className="mb-1 ms-1 rounded bg-gray-300 p-1"
              >
                {project.name}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "activeYn",
      header: "Active",
    },
    {
      header: "Action",
      cell: ({ row }) => {
        const user: User = row.original;
        return handleAction(user, handleDeleteUser);
      },
    },
  ];

  return (
    <div className="py-10">
      <DataTable columns={columns} data={users} />
    </div>
  );
};

export default UserTableWithTanStack;
