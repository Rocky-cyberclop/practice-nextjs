import { EditUserForm } from "@/components/user/EditUserForm";
import Head from "next/head";
import React from "react";

const AddUserPage = () => {
  return (
    <>
      <Head key="edit-user">
        <title>Editing User</title>
      </Head>
      <h1 className="text-center font-bold text-2xl text-primary uppercase">
        Edit An Existing User
      </h1>
      <EditUserForm />
    </>
  );
};

export default AddUserPage;
