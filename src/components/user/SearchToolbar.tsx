import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import axios from "axios";
import qs from "qs";
import { useUserContext } from "@/lib/context";

interface ISearch {
  username: string;
  fullName: string;
  role: string;
}

export const SearchToolbar = () => {
  const { server_url, setUsers } = useUserContext();
  const [searchParams, setSearchParams] = useState({
    username: "",
    fullName: "",
    role: "",
  });
  const [projects, setProjects] = useState<string[]>([]);
  const [proj, setProj] = useState<string>("");
  const [isActive, setIsActive] = useState<string>("default");

  const handleParamsChange = (field: string, value: string) => {
    setSearchParams((prev: ISearch) => {
      return {
        ...prev,
        [field]: value,
      };
    });
  };

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

  const handleRadioChange = (value: string) => {
    setIsActive(value);
  };

  const searchUsers = async () => {
    console.log(process.env);
    const searchParamRecords: { [key: string]: string } = searchParams;
    let userSearch = {};
    for (const property in searchParamRecords) {
      if (searchParamRecords[property].length > 0) {
        userSearch = {
          ...userSearch,
          [property]: searchParamRecords[property],
        };
      }
    }
    if (isActive !== "default")
      userSearch = { ...userSearch, activeYn: isActive };
    const queryString = qs.stringify(
      {
        ...userSearch,
        projects,
      },
      { arrayFormat: "brackets" },
    );
    try {
      const res = await axios.get(server_url + `/user/search?${queryString}`);
      if (res.status === 200) setUsers(res.data);
    } catch (ex) {
      console.error(ex);
    }
  };
  function handleSubmit() {
    searchUsers();
  }

  return (
    <div className="flex justify-start gap-2">
      <div className="w-44">
        <Label>Username</Label>
        <Input
          name="username"
          value={searchParams.username}
          placeholder="Search by username..."
          onChange={(evt) =>
            handleParamsChange(evt.target.name, evt.target.value)
          }
        />
      </div>
      <div className="w-80">
        <Label>Fullname</Label>
        <Input
          name="fullName"
          value={searchParams.fullName}
          placeholder="Search by fullname..."
          onChange={(evt) =>
            handleParamsChange(evt.target.name, evt.target.value)
          }
        />
      </div>
      <div className="w-32">
        <Label>Role</Label>
        <Input
          name="role"
          value={searchParams.role}
          placeholder="Search by role..."
          onChange={(evt) =>
            handleParamsChange(evt.target.name, evt.target.value)
          }
        />
      </div>
      <div className="w-80">
        <Label>Projects</Label>
        <div>
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
              <Button className="w-1/2" onClick={() => handleAddProject(proj)}>
                Add
              </Button>
            </PopoverContent>
          </Popover>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          {projects.length > 0 &&
            projects.map((item, index) => (
              <div
                className="flex items-center rounded-md bg-gray-200 p-1"
                key={item}
              >
                <div>{item}</div>
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
      </div>
      <div className="w-32">
        <Label>Is Active</Label>
        <RadioGroup defaultValue={isActive} onValueChange={handleRadioChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="default" id="r1" />
            <Label htmlFor="r1">Nope</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Y" id="r2" />
            <Label htmlFor="r2">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="N" id="r3" />
            <Label htmlFor="r3">No</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="flex w-60 items-center justify-end">
        <Button type="button" onClick={handleSubmit}>
          Search
        </Button>
      </div>
    </div>
  );
};
