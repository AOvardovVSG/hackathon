import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  const userId = session?.userId;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-4xl font-bold text-center">
            Welcome to HR Portal
          </h1>
          {!userId && (
            <div className="flex gap-4">
              <Link
                href="/sign-in"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
          {userId && (
            <p className="text-center text-lg">
              Welcome back! Use the navigation menu to access different sections.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
