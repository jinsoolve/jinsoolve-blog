import type { WrapPageElementBrowserArgs } from "gatsby";
import React from "react";
import Root from "./src/Root";
import "katex/dist/katex.min.css";

export const wrapPageElement = ({ element }: WrapPageElementBrowserArgs) => {
  return <Root>{element}</Root>;
};