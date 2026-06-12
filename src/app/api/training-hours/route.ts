import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserCounters, saveUserCounters } from "@/lib/db";
import { normalizeCountersState, type CountersState } from "@/lib/training-hours";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id ?? session?.user?.email;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return NextResponse.json(getUserCounters(userId));
  } catch {
    return NextResponse.json(
      { error: "Failed to load counters" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const session = await auth();
  const userId = session?.user?.id ?? session?.user?.email;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: CountersState;
  try {
    body = normalizeCountersState(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    saveUserCounters(userId, body);
    return NextResponse.json(body);
  } catch {
    return NextResponse.json(
      { error: "Failed to save counters" },
      { status: 500 },
    );
  }
}
