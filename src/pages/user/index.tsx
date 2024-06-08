import { ToolBar } from "@/components/user/ToolBar";
import UserTableWithTanStack, {
  User,
} from "@/components/user/UserTableWithTanStack";
import { UserProvider } from "@/lib/context";
import axios from "axios";
import Head from "next/head";
import React from "react";

const UserPage = ({ data }: { data: User[] }) => {
  return (
    <>
      <Head key={"user"}>
        <title>User management</title>
      </Head>
      <main>
        <h1 className="text-center text-2xl font-bold text-primary">
          User management aplication
        </h1>
        <UserProvider initData={data}>
          <ToolBar></ToolBar>
          <UserTableWithTanStack></UserTableWithTanStack>
        </UserProvider>
      </main>
    </>
  );
};

export default UserPage;

export async function getServerSideProps() {
  try {
    const res = await axios.get(
      process.env.NEXT_PUBLIC_SERVER_URL! + "/user/search",
    );
    const data = res.data;
    return { props: { data } };
  } catch (ex) {
    console.error(ex);
  }
  return { props: { data: [] } };
}
