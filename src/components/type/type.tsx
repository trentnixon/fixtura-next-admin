import { cn } from "@/lib/utils";
import React from "react";

export type AccountType = {
  id: string;
  attributes: {
    Name: string;
  };
};

export const P = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p className={cn("my-2.5 text-gray-500 bodyCopy", className)}>{children}</p>
  );
};

// Small
export const S = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p className={cn("text-sm text-gray-500 bodyCopy", className)}>
      {children}
    </p>
  );
};

// Extra Small
export const Xs = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p className={cn("text-xs text-gray-500 bodyCopy", className)}>
      {children}
    </p>
  );
};

// bold
export const Bold = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span className={cn("my-2.5 font-bold inline-block", className)}>
      {children}
    </span>
  );
};
