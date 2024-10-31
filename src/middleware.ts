export { default } from "next-auth/middleware";

export const config = {
  // matcher: [
  //   '/((?!api/webhooks|auth/sign-in|auth/error|certificates|api/certificates|_next/static|_next/image|favicon.ico).*)',
  // ],
  matcher: ["/none"],
};
