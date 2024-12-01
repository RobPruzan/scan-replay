import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { sessionReplay } from "~/server/db/schema";

export interface RRWebEvent {
  type: number;
  data: any;
  timestamp: number;
}

// export const allEvents: { current: Array<Array<RRWebEvent>> } = { current: [] };

export async function POST(request: NextRequest) {
  try {
    const events: RRWebEvent[] = await request.json();

    // allEvents.current.push(events);

    await db.insert(sessionReplay).values({
      events,
    });

    return NextResponse.json(
      { message: "Events received successfully", count: events.length },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing RRWeb events:", error);

    // Return error response
    return NextResponse.json(
      { error: "Failed to process events" },
      { status: 500 },
    );
  }
}
