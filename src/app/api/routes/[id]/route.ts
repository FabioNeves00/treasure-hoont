import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/server/db";
import { routes, users } from "@/src/server/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/server/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ err: "Falha na autenticação" }, { status: 401 });
  }

  const userId = session.user.id;
  const { id } = params;
  try {
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    if (user.routeId !== id) {
      return NextResponse.json(
        { error: "Acesso negado à rota" },
        { status: 403 }
      );
    }

    const [route] = await db.select().from(routes).where(eq(routes.id, id));

    if (route) {
      return NextResponse.json(route);
    } else {
      return NextResponse.json(
        { error: "Rota não encontrada" },
        { status: 404 }
      );
    }
  } catch (err) {
    return NextResponse.json({ err: "Falha em buscar rota" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const { title, firstTeacherHint, firstTeacherAnswer } = await request.json();
    const [updatedRoute] = await db
      .update(routes)
      .set({ title, firstTeacherHint, firstTeacherAnswer })
      .where(eq(routes.id, id))
      .returning();
    return NextResponse.json(updatedRoute);
  } catch (err) {
    return NextResponse.json(
      { err: "Falha em atualizar rota" },
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
    await db.delete(routes).where(eq(routes.id, id));
    return NextResponse.json(null, { status: 204 });
  } catch (err) {
    return NextResponse.json({ err: "Falha em deletar rota" }, { status: 500 });
  }
}
