"use client";
import { useParams } from "next/navigation";
import SessionViewer from "../viewer";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function Page() {
  const params = useParams();

  return (
    <div className="h-screen w-screen overflow-auto bg-black">
      <Suspense fallback={<Loader2 className="animate-spin" />}>
        <SessionViewer replayId={params["sessionId"] as string} />;
      </Suspense>
    </div>
  );
}
