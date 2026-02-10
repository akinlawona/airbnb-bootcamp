import React from "react";

type Props = {
  children: React.ReactNode;
};

const Container = ({ children }: Props) => {
  return <div className="max-w-8xl mx-auto px-6 py-3">{children}</div>;
};

export default Container;
