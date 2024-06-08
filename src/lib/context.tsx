import { User } from "@/components/user/UserTableWithTanStack";
import React, { createContext, useState, useContext, ReactNode } from "react";

interface IUserContext {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const UserContext = createContext<IUserContext | undefined>(undefined);

export const UserProvider: React.FC<{
  children: ReactNode;
  initData: User[];
}> = ({ children, initData }) => {
  const [users, setUsers] = useState<User[]>(initData);
  return (
    <UserContext.Provider value={{ users, setUsers }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): IUserContext => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext had to be used in UserProvider");
  }
  return context;
};
