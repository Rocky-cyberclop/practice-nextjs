import { CreateUserForm } from "@/components/user/CreateUserForm";
import { UserProvider } from "@/lib/context";
import Head from "next/head";
import React from "react";

const AddUserPage = ({ server_url }: { server_url: string }) => {
  return (
    <>
      <Head key="add-user">
        <title>Add User</title>
      </Head>
      <h1 className="text-center text-2xl font-bold uppercase text-primary">
        Create New User
      </h1>
      <UserProvider initData={[]} server_url={server_url}>
        <CreateUserForm />
      </UserProvider>
    </>
  );
};

export default AddUserPage;
export async function getServerSideProps() {
  const server_url = process.env.NEXT_PUBLIC_SERVER_URL_CLIENT_COMPONENT;
  return { props: { server_url } };
}
