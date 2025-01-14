import React from "react";

export type AccountType = {
  id: string;
  attributes: {
    Name: string;
  };
};

export const P = ({ children }: { children: React.ReactNode }) => {
  return <p className="my-2.5 text-gray-500 bodyCopy">{children}</p>;
};

// Small
export const S = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-sm text-gray-500 bodyCopy">{children}</p>;
};

// Extra Small
export const Xs = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-xs text-gray-500 bodyCopy">{children}</p>;
};

// bold
export const Bold = ({ children }: { children: React.ReactNode }) => {
  return <span className="my-2.5 font-bold inline-block">{children}</span>;
};
