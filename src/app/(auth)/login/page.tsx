import React from "react";
import { FormLogin } from "./form";
import { isUserAuthenticated } from "@/app/lib/firebase/admin";
import { redirect } from "next/navigation";

export default async function Login() {
  if (await isUserAuthenticated()) redirect("/home");

  return (
    <main>
      <FormLogin />
    </main>
  );
}
