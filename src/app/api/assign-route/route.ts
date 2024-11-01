import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/server/db";
import { users, routes } from "@/src/server/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/src/server/auth";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    if (user.routeId) {
      return NextResponse.json(
        { message: "Rota já atribuída ao usuário" },
        { status: 200 }
      );
    }

    const allRoutes = await db.select().from(routes);

    if (allRoutes.length === 0) {
      return NextResponse.json(
        { error: "Nenhuma rota disponível" },
        { status: 404 }
      );
    }

    const randomRoute = allRoutes[Math.floor(Math.random() * allRoutes.length)];

    const [updatedUser] = await db
      .update(users)
      .set({ routeId: randomRoute.id })
      .where(eq(users.id, userId))
      .returning();

    return NextResponse.json({
      message: "Rota atribuída com sucesso",
      route: randomRoute,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Falha ao atribuir rota" },
      { status: 500 }
    );
  }
}
