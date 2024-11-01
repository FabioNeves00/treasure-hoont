import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/server/db";
import { answers, rounds, users } from "@/src/server/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/server/auth";
import { and, eq, not, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ err: "Falha na autenticação" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) {
      return NextResponse.json(
        { err: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    //@ts-expect-error - null check later
    const roundsFromRoute = await db.select().from(rounds).where(eq(rounds.routeId, user.routeId));
    return NextResponse.json({
      ...roundsFromRoute[0],
      nextId: roundsFromRoute[1]?.id
    });
  } catch (err) {
    console.log(err);
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
