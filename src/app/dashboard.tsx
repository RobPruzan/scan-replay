"use client";
import React, { useState } from "react";
import {
  Search,
  Clock,
  Monitor,
  ChevronRight,
  Zap,
  Cpu,
  Activity,
  Smartphone,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
export const SessionDashboard = () => {
  const [sessions] = api.replay.getReplays.useSuspenseQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const upload = api.replay.upload.useMutation();

  return (
    <div className="min-h-screen w-screen bg-black text-gray-100">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-medium text-white">Session Replays</h1>
          <p className="mt-1 text-sm text-gray-400">
            Performance analysis and replay debugger
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="max-w-md">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search sessions..."
                className="w-full rounded-md border border-gray-800 bg-transparent py-2 pl-10 pr-4 text-sm text-gray-100 placeholder-gray-500 focus:border-gray-700 focus:ring-1 focus:ring-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        <textarea
          onChange={(e) => {
            upload.mutate({
              events: JSON.parse(e.target.value),
            });
          }}
        ></textarea>

        {/* Sessions List */}
        <div className="space-y-2">
          {sessions.map((session) => (
            <Card
              onClick={() => {
                router.push(`/${session.id}`);
              }}
              key={session.id}
              className="cursor-pointer border border-gray-800/50 bg-gray-950 transition-all duration-200 hover:border-gray-700"
            >
              <CardContent className="px-5 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-grow space-y-3">
                    {/* URL and Device Info */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {/* {session.url} */}url todo
                        </div>
                        <div className="mt-1.5 flex items-center gap-3 text-xs text-gray-400">
                          <div className="flex items-center gap-1.5">
                            {/* {session.device.type === "Mobile" ? (
                                <Smartphone size={14} />
                              ) : (
                                <Monitor size={14} />
                              )} */}
                            <Monitor size={14} />
                            <span>
                              chrome
                              {/* {session.device.browser} */}
                            </span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1.5">
                            <Clock size={14} />
                            5m
                            {/* <span>{session.duration}</span> */}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-4 gap-6">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <Activity size={14} className="text-gray-500" />
                          <span className="text-xs font-medium text-gray-400">
                            FPS
                          </span>
                        </div>
                        <p
                        // className={`text-sm font-medium ${
                        //   session.performance.fps >= 55
                        //     ? "text-green-400"
                        //     : session.performance.fps >= 30
                        //       ? "text-yellow-400"
                        //       : "text-red-400"
                        // }`}
                        >
                          60
                          {/* {session.performance.fps} */}
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <Zap size={14} className="text-gray-500" />
                          <span className="text-xs font-medium text-gray-400">
                            Re-renders
                          </span>
                        </div>
                        <p className="text-sm font-medium text-white">
                          100
                          {/* {session.performance.rerenders} */}
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <Cpu size={14} className="text-gray-500" />
                          <span className="text-xs font-medium text-gray-400">
                            Memory
                          </span>
                        </div>
                        <p className="text-sm font-medium text-white">
                          {/* {session.performance.memoryUsage} */}
                          60mb
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <AlertCircle size={14} className="text-gray-500" />
                          <span className="text-xs font-medium text-gray-400">
                            Issues
                          </span>
                        </div>
                        <p className="text-sm font-medium text-white">
                          {/* {session.performance.issuesDetected.length} */}0
                        </p>
                      </div>
                    </div>

                    {/* Issues */}
                    {/* {session.performance.issuesDetected.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {session.performance.issuesDetected.map(
                            (issue, index) => (
                              <span
                                key={index}
                                className="rounded-md border border-red-500/20 bg-red-500/10 px-2 py-1 text-xs text-red-400"
                              >
                                {issue}
                              </span>
                            ),
                          )}
                        </div>
                      )} */}
                  </div>

                  <ChevronRight size={18} className="ml-4 mt-1 text-gray-600" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
