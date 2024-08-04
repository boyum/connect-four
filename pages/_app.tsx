import { ComponentElement, ReactElement } from "react";
import "../styles/globals.css";

// biome-ignore lint/suspicious/noExplicitAny: Component is a React component, page props is its props
function MyApp({ Component, pageProps }: any) {
  return <Component {...pageProps} />;
}

export default MyApp;
