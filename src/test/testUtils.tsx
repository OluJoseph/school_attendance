import { cleanup, render, RenderOptions } from "@testing-library/react";
import React, { FC, ReactElement } from "react";
import fs from "fs";
import { BrowserRouter } from "react-router-dom";

// gotten from stack overflow
// creates a custom render component that wraps the react-testing-library render
// renders a custom UI with the css generated from the tailwind classes used
const wrapper: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <BrowserRouter>{children}</BrowserRouter>; // this wraps all test components with Router
};

afterEach(cleanup);

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => {
  const view = render(ui, { wrapper, ...options });

  const style = document.createElement("style");
  style.innerHTML = fs.readFileSync("src/test/index.css", "utf8");
  document.head.appendChild(style);

  return view;
};

export * from "@testing-library/react";
export { customRender as render };
