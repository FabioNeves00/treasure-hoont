import { getServerSession } from "next-auth";
import { db } from "../../../../server/db";
import { routes, users } from "../../../../server/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { authOptions } from "../../../../server/auth";

export async function GET() {
  const data = await getServerSession(authOptions);
  if(!data) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const [userRoute] = await db.select().from(users).innerJoin(routes, eq(routes.id, users.routeId)).where(eq(users.id, data?.user.id));
  return NextResponse.json(userRoute.routes);
}