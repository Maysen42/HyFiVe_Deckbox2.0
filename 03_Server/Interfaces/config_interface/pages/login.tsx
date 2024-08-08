import { NextPage } from "next";

export const LoginPage: NextPage = () => {
  return (
    <form method="POST" action="/api/login" className="max-w-md mx-auto py-8 flex flex-col gap-4">
      <input type="text" name="username" />
      <input type="password" name="password" />
      <button type="submit">Log in</button>
    </form>
  );
};

export default LoginPage;
