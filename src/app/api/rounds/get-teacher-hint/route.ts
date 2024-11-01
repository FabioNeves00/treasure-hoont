import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../../server/auth";
import { db } from "../../../../server/db";
import { users } from "../../../../server/db/schema";

export async function GET() {
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
  }
    catch (err) {
      console.log(err)
      return NextResponse.json({
        err,
        status: 500
      })
    }
}