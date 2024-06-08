"use client";

import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { toast } from "sonner";
import { Switch } from "../ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ActiveYn, Project, User } from "./UserTableWithTanStack";
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
import { Input } from "../ui/input";
import { useUserContext } from "@/lib/context";

interface UpdateUser {
  id: number;
  username: string;
  fullName: string;
  role: string;
  projects: string[];
  activeYn: boolean;
}

export function EditUserForm({
  user,
}: Readonly<{
  user: User;
}>) {
  const { setUsers } = useUserContext();
  const form = useForm<UpdateUser>({
    defaultValues: {
      fullName: "",
      role: "",
      activeYn: true,
      projects: [],
    },
  });
  const [projects, setProjects] = useState<string[]>(() => {
    const stringProjects = new Array<string>();
    user.projects.forEach((project: Project) => {
      stringProjects.push(project.name);
    });
    return stringProjects;
  });
  const [proj, setProj] = useState<string>("");

  useEffect(() => {
    form.setValue("fullName", user.fullName);
    form.setValue("role", user.role);
    form.setValue("activeYn", user.activeYn === "Y");
  }, []);

  async function onSubmit(data: UpdateUser) {
    const userUpdate = {
      ...data,
      username: user.username,
      projects: projects.length > 0 ? projects : null,
      activeYn: data.activeYn ? ActiveYn.Y : ActiveYn.N,
    };
    try {
      const res = await axios.patch(
        process.env.NEXT_PUBLIC_SERVER_URL! + `/user/${user.username}`,
        userUpdate,
      );
      if (res.status === 200) {
        toast.success("Update user successfully!!");
        setUsers((pre) => {
          return pre.map((user: User) => {
            if (user.username === userUpdate.username) {
              user.fullName = data.fullName;
              user.role = data.role;
              const updatedProjects = new Array<Project>();
              projects.forEach((project: string, index) => {
                const updatedProject = { id: index, name: project };
                updatedProjects.push(updatedProject);
              });
              user.projects = updatedProjects;
              user.activeYn = data.activeYn ? ActiveYn.Y : ActiveYn.N;
              return user;
            }
            return user;
          });
        });
      }
    } catch (ex) {
      console.error(ex);
    }
  }

  const handleDeleteProject = (id: number) => {
    setProjects((prev) => prev.filter((_, index) => index !== id));
  };

  const handleAddProject = (proj: string) => {
    if (proj.length === 0) return;
    if (!projects.some((project) => proj === project)) {
      setProjects((prev) => [...prev, proj]);
      setProj("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-600">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[40%]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="container flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Full name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Type full name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Role
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Type the role..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="activeYn"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormDescription>
                      Active status let user can login
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="projects"
              render={() => (
                <FormItem>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" type="button">
                        Add Project
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="flex w-96 flex-col items-center gap-2">
                      <h4 className="text-center text-lg font-semibold">
                        Add Projects
                      </h4>
                      <Input
                        value={proj}
                        placeholder="Project Name"
                        className="w-full"
                        onChange={(evt) => setProj(evt.target.value)}
                      />
                      <Button
                        className="w-1/2"
                        onClick={() => handleAddProject(proj)}
                      >
                        Add
                      </Button>
                    </PopoverContent>
                  </Popover>
                  <div className="flex flex-wrap items-center gap-2">
                    {projects?.length > 0 &&
                      projects.map((item, index) => (
                        <div
                          className="flex items-center rounded-md bg-gray-200 p-1"
                          key={item}
                        >
                          <FormField
                            control={form.control}
                            name="projects"
                            render={() => {
                              return (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormLabel className="font-normal">
                                    {item}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                          <div>
                            <Button
                              onClick={() => handleDeleteProject(index)}
                              type="button"
                              variant={"destructive"}
                              className="ms-1 h-fit w-fit p-1"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="submit">Confirm Edit User</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
