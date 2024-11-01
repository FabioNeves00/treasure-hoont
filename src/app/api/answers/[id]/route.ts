import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/server/db';
import { answers } from '@/src/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const [answer] = await db.select().from(answers).where(eq(answers.id, id));
    if (answer) {
      return NextResponse.json(answer);
    } else {
      return NextResponse.json({ err: 'Resposta não encontrada' }, { status: 404 });
    }
  } catch (err) {
    return NextResponse.json({ err: 'Falha em achar resposta' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const updates = await request.json();
    const [updatedAnswer] = await db
      .update(answers)
      .set(updates)
      .where(eq(answers.id, id))
      .returning();
    return NextResponse.json(updatedAnswer);
  } catch (err) {
    return NextResponse.json({ err: 'Fahla em atualizar resposta' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    await db.delete(answers).where(eq(answers.id, id));
    return NextResponse.json(null, { status: 204 });
  } catch (err) {
    return NextResponse.json({ err: 'Falha em deletar resposta' }, { status: 500 });
  }
}
