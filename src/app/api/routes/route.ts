import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/server/db";
import { routes } from "@/src/server/db/schema";

export async function GET() {
  try {
    const allRoutes = await db.select().from(routes);
    return NextResponse.json(allRoutes);
  } catch (err) {
    return NextResponse.json({ err: "Falha em buscar rotas" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json();

    if (!title) {
      return NextResponse.json(
        { err: "O campo título é obrigatório" },
        { status: 400 }
      );
    }

    const [newRoute] = await db.insert(routes).values({ title }).returning();
    return NextResponse.json(newRoute, { status: 201 });
  } catch (error) {
    console.error("Error creating route:", error);
    return NextResponse.json({ err: "Falha em criar rota" }, { status: 500 });
  }
}
