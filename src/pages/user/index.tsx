import { ToolBar } from "@/components/user/ToolBar";
import UserTable from "@/components/user/UserTable";
import { NextPage } from "next";
import Head from "next/head";
import React from "react";

const UserPage: NextPage = () => {
  return (
    <>
      <Head key={"user"}>
        <title>User management</title>
      </Head>
      <main>
        <h1 className="text-center font-bold text-2xl text-primary">
          User management aplication
        </h1>
        <ToolBar></ToolBar>
        <UserTable></UserTable>
      </main>
    </>
  );
};

export default UserPage;
