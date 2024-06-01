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
import { ActiveYn, User } from "./UserTable";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface UpdateUser {
  fullname: string;
  role: string;
  projects: string[];
  activeYn: boolean;
}

export function EditUserForm() {
  const router = useRouter();
  const { username } = router.query;
  const form = useForm<UpdateUser>({
    defaultValues: {
      fullname: "",
      role: "",
      activeYn: true,
      projects: [],
    },
  });
  const [projects, setProjects] = useState<string[]>([]);
  const [proj, setProj] = useState<string>("");

  useEffect(() => {
    if (!username) return;
    const getData = async () => {
      try {
        const res = await axios.get(
          process.env.NEXT_PUBLIC_SERVER_URL! +
            `/user/search?username=${username}`
        );
        if (res.status === 200) {
          const data = res.data[0];
          form.setValue("fullname", data.fullname);
          form.setValue("role", data.role);
          form.setValue("activeYn", data.activeYn === "Y" ? true : false);
          form.setValue("projects", data.projects);
          setProjects(data.projects);
        }
      } catch (ex) {
        console.error(ex);
      }
    };
    getData();
  }, [username]);

  async function onSubmit(data: UpdateUser) {
    if (typeof username === "string") {
      const user: User = {
        ...data,
        username: username,
        projects,
        activeYn: data.activeYn ? ActiveYn.Y : ActiveYn.N,
      };
      try {
        const res = await axios.patch(
          process.env.NEXT_PUBLIC_SERVER_URL! + `/user/${username}`,
          user
        );
        if (res.status === 200) {
          toast.success("Update User Successfully !!");
          router.push("/");
        }
      } catch (ex) {
        console.error(ex);
      }
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

  function checkRender() {
    console.log(Math.random());
    return <></>;
  }
  return (
    <Form {...form}>
      {checkRender()}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="gap-4  flex flex-col w-1/2 container"
      >
        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-base">
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
              <FormLabel className="font-semibold text-base">Role</FormLabel>
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
                <PopoverContent className="w-96 flex flex-col items-center gap-2">
                  <h4 className="text-center font-semibold text-lg">
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
              <div className="flex flex-wrap items-center gap-2 ">
                {projects.length > 0 &&
                  projects.map((item, index) => (
                    <div
                      className="flex items-center bg-gray-200 p-1 rounded-md"
                      key={index}
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
                      <Button
                        onClick={() => handleDeleteProject(index)}
                        variant={"destructive"}
                        className="w-fit h-fit p-1 ms-1"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Confirm Edit User</Button>
      </form>
    </Form>
  );
}
