import React from "react";

const Page = (props: any) => {
  return (
    <div className="h-screen flex flex-col w-full pb-10 z-0">{props.children}</div>
  );
};

export default Page;
