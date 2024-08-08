import { NextRequest, NextResponse } from "next/server";
import { verifyJsonWebToken } from "./src/backend/auth";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path === "/login" || path === "/api/login") return NextResponse.next({ request });

  const user = await authenticateUser(request);

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (request.method === "POST" && user.access !== "write") {
    return new NextResponse("Write access denied", {
      status: 401,
    });
  }

  const response = NextResponse.next({
    request: {
      // Pass down user info as headers, because next.js has no better way
      headers: new Headers({ ...request.headers, access: user.access }),
    },
  });

  return response;
}

async function authenticateUser(req: NextRequest) {
  try {
    const jwt = req.cookies.get("auth");
    if (!jwt?.value) return undefined;
    const verify = await verifyJsonWebToken(jwt.value);

    if (Date.now() >= verify.exp * 1000) return undefined;
    return verify;
  } catch (err) {
    return undefined;
  }
}

export const config = {
  matcher: [
    // Match all request paths except the ones starting with:
    "/((?!_next/static|_next/image|assets|images|videos|favicon.ico).*)",
  ],
};
