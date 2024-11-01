import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/server/db";
import { rounds } from "@/src/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const [round] = await db.select().from(rounds).where(eq(rounds.id, id));
    if (round) {
      return NextResponse.json(round);
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
