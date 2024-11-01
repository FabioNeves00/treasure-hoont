import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/server/db";
import { answers, rounds, users } from "@/src/server/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/server/auth";
import { eq } from "drizzle-orm";

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
    const { answer, roundId } = await request.json();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ err: "Falha na autenticação" }, { status: 401 });
    }
    const [foundUser] = await db.select().from(users).where(eq(users.id, session.user.id));
    if (!foundUser) {
      return NextResponse.json({ err: "Usuário não encontrado" }, { status: 404 });
    }
    let isRight = false;
    const [round] = await db.select().from(rounds).where(eq(rounds.id, roundId));
    if (!round) {
      return NextResponse.json({ err: "Round não encontrada" }, { status: 404 });
    }

    if (foundUser.routeId !== round.routeId) {
      return NextResponse.json({ err: "Acesso negado à rota" }, { status: 403 });
    }

    if(round.hintAnswer === answer) {
      isRight = true;
    }


    const [newAnswer] = await db
      .insert(answers)
      .values({
        answer,
        isRight,
        userId: foundUser.id,
        roundId: foundUser.routeId,
      })
      .returning();
    return NextResponse.json({ newAnswer }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { err: "Falha em criar resposta" },
      { status: 500 }
    );
  }
}
