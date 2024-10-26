import Login from "@/components/Login";
import { auth, signIn } from "@/utils/auth";
import { fetcher } from "@/utils/fetcher";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Home() {
  const token = (await cookies()).get("ACCESS_TOKEN")?.value;
  console.log("token", token);
  const { data, error } = await fetcher("/api/user", { token });
  console.log("data", data);
  console.log("err", error);
  const user = await auth();
  console.log("user", user);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-xl">Its SSR</h1>
        <Login />
        <Link href="/client">Client</Link>

        <form
          action={async (formData) => {
            "use server";
            await signIn("credentials", formData);
          }}
          className="flex"
        >
          <label>
            Email
            <input name="email" type="email" />
          </label>
          <label>
            Password
            <input name="password" type="password" />
          </label>
          <button>Sign In</button>
        </form>
      </main>
    </div>
  );
}
