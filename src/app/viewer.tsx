"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Zap,
  Activity,
  Cpu,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
let init = false;
type Change = {
  name: string;
  unstable: boolean;
  prevValue: unknown;
  nextValue: unknown;
};

type Render = {
  type: string;
  count: number;
  trigger: boolean;
  name: string;
  time: number;
  forget: boolean;
  changes: Change[];
};

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
};

type Outline = {
  rect: Rect;
  renders: Render[];
};

type InnerPayload = {
  nodeId: number;
  outline: Outline;
};

type InnerData = {
  tag: string;
  plugin: string;
  payload: InnerPayload;
};

type OuterPayload = {
  data: InnerData;
};

type Data = {
  plugin: string;
  payload: OuterPayload;
};

type TargetEvent = {
  type: number;
  data: Data;
  timestamp: number;
  delay: number;
};
const SessionViewer = ({ replayId }: { replayId: string }) => {
  const [replay] = api.replay.getReplayById.useSuspenseQuery({ id: replayId });
  const [selectedTab, setSelectedTab] = useState("events");
  const [currentTime, setCurrentTime] = useState("00:00");
  const playerRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      if (!playerRef.current) {
        return;
      }
      if (init) {
        return;
      }
      init = true;
      const scan = await import("react-scan");
      scan.createReplayer(replay.events, playerRef.current);
    })();
  }, []);

  const router = useRouter();
  // Mock events data
  const events = [
    {
      id: 1,
      timestamp: "00:02",
      type: "render",
      component: "<TodoList />",
      duration: "42ms",
      info: "Unnecessary re-render detected",
    },
    {
      id: 2,
      timestamp: "00:15",
      type: "longTask",
      component: "<DataGrid />",
      duration: "156ms",
      info: "Long task blocking main thread",
    },
    // ... more events
  ];

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="border-b border-gray-800">
          <div className="px-4 py-4">
            <button
              onClick={() => {
                router.push("/");
              }}
              className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-gray-200"
            >
              <ArrowLeft size={16} />
              Back to sessions
            </button>
          </div>
        </div>

        <div className="flex h-[calc(100vh-64px)]">
          {/* Player Section */}
          <div className="flex-1 border-r border-gray-800">
            <div className="border-b border-gray-800 p-4">
              <h1 className="text-lg font-medium text-white">/home</h1>
              <div className="mt-1 flex items-center gap-3 text-sm text-gray-400">
                <span>Chrome 98.0.4758.102</span>
                <span>•</span>
                <span>0:05</span>
              </div>
            </div>

            <div className="p-4">
              {/* Player container */}
              <div
                ref={playerRef}
                className="flex aspect-video w-full items-center justify-center rounded-lg border border-gray-800/50"
              >
                {/* {player ? (
                  player
                ) : (
                  <span className="text-gray-500">Player Placeholder</span>
                )} */}
              </div>

              {/* Playback controls */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="rounded-md p-2 hover:bg-gray-900">
                    <SkipBack size={16} />
                  </button>
                  <button
                    onClick={async () => {
                      playerRef.current?.replaceChildren();
                      const scan = await import("react-scan");
                      scan.createReplayer(replay.events, playerRef.current!);
                    }}
                    className="rounded-md p-2 hover:bg-gray-900"
                  >
                    <Play size={16} />
                  </button>
                  <button className="rounded-md p-2 hover:bg-gray-900">
                    <SkipForward size={16} />
                  </button>
                  <span className="ml-2 text-sm text-gray-400">
                    {currentTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="rounded-md border border-gray-800 px-2 py-1 text-xs hover:bg-gray-900">
                    0.5x
                  </button>
                  <button className="rounded-md border border-gray-800 bg-gray-800 px-2 py-1 text-xs">
                    1x
                  </button>
                  <button className="rounded-md border border-gray-800 px-2 py-1 text-xs hover:bg-gray-900">
                    2x
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats & Events Section */}
          <div className="w-[400px]">
            {/* Performance Stats */}
            <div className="border-b border-gray-800 p-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-gray-800 bg-gray-950">
                  <CardContent className="p-4">
                    <div className="mb-1 flex items-center gap-2 text-xs text-gray-400">
                      <Activity size={14} />
                      FPS
                    </div>
                    <div className="text-xl font-medium text-green-400">58</div>
                  </CardContent>
                </Card>
                <Card className="border-gray-800 bg-gray-950">
                  <CardContent className="p-4">
                    <div className="mb-1 flex items-center gap-2 text-xs text-gray-400">
                      <Zap size={14} />
                      Re-renders
                    </div>
                    <div className="text-xl font-medium text-white">
                      {replay.events.filter((e) => e.type === 6).length}
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-gray-800 bg-gray-950">
                  <CardContent className="p-4">
                    <div className="mb-1 flex items-center gap-2 text-xs text-gray-400">
                      <Cpu size={14} />
                      Memory
                    </div>
                    <div className="text-xl font-medium text-white">80MB</div>
                  </CardContent>
                </Card>
                <Card className="border-gray-800 bg-gray-950">
                  <CardContent className="p-4">
                    <div className="mb-1 flex items-center gap-2 text-xs text-gray-400">
                      <AlertCircle size={14} />
                      Issues
                    </div>
                    <div className="text-xl font-medium text-red-400">51</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Events Tab Bar */}
            <div className="border-b border-gray-800 px-4">
              <div className="flex">
                <button
                  className={`border-b-2 px-4 py-3 text-sm font-medium ${
                    selectedTab === "events"
                      ? "border-white text-white"
                      : "border-transparent text-gray-400 hover:text-gray-300"
                  }`}
                  onClick={() => setSelectedTab("events")}
                >
                  Events
                </button>
                {/* <button
                  className={`border-b-2 px-4 py-3 text-sm font-medium ${
                    selectedTab === "network"
                      ? "border-white text-white"
                      : "border-transparent text-gray-400 hover:text-gray-300"
                  }`}
                  onClick={() => setSelectedTab("network")}
                >
                  Network
                </button> */}
              </div>
            </div>

            {/* Events List */}
            <div
              className="overflow-auto"
              style={{ height: "calc(100vh - 340px)" }}
            >
              {replay.events
                .filter(
                  (e) =>
                    e.type === 6 &&
                    e.data.payload?.data.payload.outline.renders.at(0)?.name,
                )
                .map((event, idx) => {
                  console.log(event);
                  const dEvent = event as TargetEvent;
                  console.log("whats this", dEvent);

                  return (
                    <div
                      key={idx}
                      className="cursor-pointer border-b border-gray-800/50 px-4 py-3 hover:bg-gray-950"
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <div className="text-sm font-medium text-white">
                          {/* {event.component} */}
                          {/* {JSON.stringify(event.data)} */}
                          {"<"}
                          {""}
                          {
                            dEvent.data.payload?.data.payload.outline.renders.at(
                              0,
                            )?.name
                          }
                          {"/>"}
                        </div>

                        <span className="text-xs text-gray-400">
                          {/* {event.timestamp} */}
                          caused by:{" "}
                          {
                            dEvent.data.payload?.data.payload.outline.renders.at(
                              0,
                            )?.type
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        {(
                          dEvent.data.payload?.data.payload.outline.renders.at(
                            0,
                          )?.time === 0 ? 0.1 :(dEvent.data.payload?.data.payload.outline.renders.at(
                            0,
                          )?.time ?? 0) 
                        ).toFixed(2)}
                        ms
                        {/* {(Math.random() * 100).toFixed(2)}s */}
                        {/* <span className="text-gray-400">{event.duration}</span> */}
                      </div>
                      {/* <p className="mt-1 text-xs text-gray-400">{event.info}</p> */}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionViewer;
