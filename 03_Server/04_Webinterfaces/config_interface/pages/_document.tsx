import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/assets/favicon.ico" />
      </Head>
      <body className="bg-danube-100 text-danube-800">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
