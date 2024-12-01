import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { api, HydrateClient } from "~/trpc/server";
import { Suspense } from "react";
import { SessionDashboard } from "./dashboard";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <Suspense fallback={<>...loading</>}>
          <SessionDashboard />
        </Suspense>
      </main>
    </HydrateClient>
  );
}
