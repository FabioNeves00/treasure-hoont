import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/server/db";
import { answers, rounds, users } from "@/src/server/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/server/auth";
import { and, eq, not, sql } from "drizzle-orm";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ err: "Falha na autenticação" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const [user] = await db.select().from(users).where(and(eq(users.id, userId), not(eq(users.routeId, sql`NULL`))));

    if (!user) {
      return NextResponse.json(
        { err: "Usuário não encontrado" },
        { status: 401 }
      );
    }

    const [lastCorrectAnswer] = await db
      .select()
      .from(answers)
      .leftJoin(rounds, eq(answers.roundId, rounds.id))
      .where(
        and(
          //@ts-expect-error - null check later
          eq(rounds.routeId, user.routeId),
          eq(answers.isRight, true),
          eq(answers.userId, userId)
        )
      );

    if (!lastCorrectAnswer.rounds) {
      return NextResponse.json({ err: "Erro na busca" }, { status: 401 });
    }

    const { sequence } = lastCorrectAnswer.rounds;
    if (!sequence)
      return NextResponse.json({ err: "Erro na busca" }, { status: 401 });

    const [nextSequence] = await db
      .select()
      .from(rounds)
      .where(
        and(
          // @ts-expect-error
          eq(rounds.routeId, user.routeId),
          eq(sql`${sequence} + 1`, rounds.sequence)
        )
      );

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
      hint,
      hintAnswer,
      keySegment,
      sequence,
      finalHint,
    } = await request.json();
    const [newRound] = await db
      .insert(rounds)
      .values({
        routeId,
        hint,
        hintAnswer,
        keySegment,
        sequence,
        finalHint,
      })
      .returning();
    return NextResponse.json(newRound, { status: 201 });
  } catch (err) {
    return NextResponse.json({ err: "Falha em criar etapa" }, { status: 500 });
  }
}