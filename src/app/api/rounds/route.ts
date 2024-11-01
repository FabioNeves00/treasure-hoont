import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/server/db";
import { rounds } from "@/src/server/db/schema";

export async function GET() {
  try {
    const allRounds = await db.select().from(rounds);
    return NextResponse.json(allRounds);
  } catch (err) {
    return NextResponse.json(
      { err: "Falha em buscar etapas" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      routeId,
      clue,
      nextTeacherClue,
      clueAnswer,
      nextTeacherAnswer,
      keySegment,
    } = await request.json();
    const [newRound] = await db
      .insert(rounds)
      .values({
        routeId,
        clue,
        nextTeacherClue,
        clueAnswer,
        nextTeacherAnswer,
        keySegment,
      })
      .returning();
    return NextResponse.json(newRound, { status: 201 });
  } catch (err) {
    return NextResponse.json({ err: "Falha em criar etapa" }, { status: 500 });
  }
}
