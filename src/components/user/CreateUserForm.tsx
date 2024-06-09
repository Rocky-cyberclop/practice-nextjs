"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { ActiveYn } from "./UserTableWithTanStack";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { X } from "lucide-react";
import { useState } from "react";
import { useUserContext } from "@/lib/context";

interface CreateUser {
  username: string;
  fullName: string;
  role: string;
  projects: string[];
  activeYn: boolean;
}

const FormSchema = z.object({
  username: z.string().min(1, {
    message: "Username is required",
  }),
  fullName: z.string().optional(),
  role: z.string().optional(),
  activeYn: z.boolean(),
});

export function CreateUserForm() {
  const { server_url } = useUserContext();
  const form = useForm<CreateUser>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: "",
      username: "",
      role: "",
      activeYn: true,
      projects: [],
    },
  });
  const [projects, setProjects] = useState<string[]>([]);
  const [proj, setProj] = useState<string>("");

  async function onSubmit(data: CreateUser) {
    const user = {
      ...data,
      projects: projects.length > 0 ? projects : null,
      activeYn: data.activeYn ? ActiveYn.Y : ActiveYn.N,
    };
    try {
      const res = await axios.post(server_url + "/user/insert", user);
      if (res.status === 201) {
        toast.success("Create User Successfully !!");
        form.reset();
        setProjects([]);
      }
    } catch (ex) {
      toast.error("Username existed!");
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="container flex w-1/2 flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                Username
              </FormLabel>
              <FormControl>
                <Input placeholder="Type username..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
              <FormLabel className="text-base font-semibold">Role</FormLabel>
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
                {projects.length > 0 &&
                  projects.map((item, index) => (
                    <div
                      className="flex items-center rounded-md bg-gray-200 p-1"
                      key={item}
                    >
                      <FormField
                        control={form.control}
                        name="projects"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormLabel className="font-normal">
                                {item}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                      <Button
                        onClick={() => handleDeleteProject(index)}
                        variant={"destructive"}
                        className="ms-1 h-fit w-fit p-1"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create User</Button>
      </form>
    </Form>
  );
}
