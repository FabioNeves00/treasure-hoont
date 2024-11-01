import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/server/db";
import { routes } from "@/src/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const [route] = await db.select().from(routes).where(eq(routes.id, id));
    if (route) {
      return NextResponse.json(route);
    } else {
      return NextResponse.json({ err: "Rota não achada" }, { status: 404 });
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
    const { title } = await request.json();
    const [updatedRoute] = await db
      .update(routes)
      .set({ title })
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
