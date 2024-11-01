import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/server/db";
import { answers } from "@/src/server/db/schema";

export async function GET() {
  try {
    const allAnswers = await db.select().from(answers);
    return NextResponse.json(allAnswers);
  } catch (err) {
    return NextResponse.json(
      { err: "Falha em achar respostas" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { answer, isRight, userId, roundId } = await request.json();
    const [newAnswer] = await db
      .insert(answers)
      .values({
        answer,
        isRight,
        userId,
        roundId,
      })
      .returning();
    return NextResponse.json(newAnswer, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { err: "Falha em criar resposta" },
      { status: 500 }
    );
  }
}
