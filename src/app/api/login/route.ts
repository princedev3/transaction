import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const POST = async (req: Request, res: any) => {
  try {
    const { email, password } = await req.json();
    const age = 60 * 60 * 24 * 7;
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    const isPasswordCorrect = bcrypt.compareSync(
      password,
      existingUser?.password as string
    );

    const token = jwt.sign(
      {
        id: existingUser?.id,
      },
      process.env.NEXT_PUBLIC_JWT_SECRETE as string,
      { expiresIn: age }
    );

    if (!isPasswordCorrect && !existingUser?.active) {
      return new NextResponse(
        JSON.stringify({ message: "can not create post" }),
        { status: 500 }
      );
    }
    const cookie = await cookies();
    cookie.set("tokenLogin", token, {
      httpOnly: true,
      maxAge: age,
      path: "/",
      sameSite: "strict",
      secure: false,
    });
    const cookieString = cookie.toString();
    return new NextResponse(JSON.stringify(existingUser), {
      status: 200,
      headers: { "Set-Cookie": cookieString },
    });
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ message: "can not create post" }),
      { status: 500 }
    );
  }
};
