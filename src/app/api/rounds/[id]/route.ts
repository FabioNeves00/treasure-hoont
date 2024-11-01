import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/server/db";
import { answers, rounds, users } from "@/src/server/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../server/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getServerSession(authOptions);
  if (!user || !user.user) {
    return NextResponse.json({ err: "Falha na autenticação" }, { status: 401 });
  }

  const userId = user.user.id;
  const [foundUser] = await db.select().from(users).where(eq(users.id, userId));
  if (!foundUser) {
    return NextResponse.json(
      { err: "Usuário não encontrado" },
      { status: 404 }
    );
  }

  const { id } = params;
  try {
    //@ts-expect-error - null check later
    const [round] = await db.select().from(rounds).where(and(eq(rounds.id, id), eq(rounds.routeId, foundUser.routeId)));
    const [answer] = await db.select().from(answers).where(and(eq(answers.roundId, id), eq(answers.userId, foundUser.id), eq(answers.isRight, true)));
    const [nextRound] = await db.select().from(rounds).where(and(eq(rounds.sequence, sql`${round.sequence!+1}`), eq(rounds.routeId, foundUser.routeId!)));
    if (answer) {
      return NextResponse.json({
        err: "Resposta já feita",
        status: 400
      });
    }
    if (round) {
      return NextResponse.json({
        ...round,
        nextId: nextRound.id
      });
    } else {
      return NextResponse.json(
        { err: "Etapa não encontrada" },
        { status: 404 }
      );
    }
  } catch (err) {
    return NextResponse.json({ err: "Falha em achar etapa" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const updates = await request.json();
    const [updatedRound] = await db
      .update(rounds)
      .set(updates)
      .where(eq(rounds.id, id))
      .returning();
    return NextResponse.json(updatedRound);
  } catch (err) {
    return NextResponse.json(
      { err: "Falha em atualizar etapa" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    await db.delete(rounds).where(eq(rounds.id, id));
    return NextResponse.json(null, { status: 204 });
  } catch (err) {
    return NextResponse.json(
      { err: "Falha em deletar etapa" },
      { status: 500 }
    );
  }
}
