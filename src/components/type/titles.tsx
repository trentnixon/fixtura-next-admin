import { cn } from "@/lib/utils";
import React from "react";

export type AccountType = {
  id: string;
  attributes: {
    Name: string;
  };
};

// Title
export const Title = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h1 className={cn("text-3xl text-slate-800 font-bold title", className)}>
      {children}
    </h1>
  );
};

// Subtitle
export const Subtitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h2 className={cn("text-xl text-slate-700 font-bold title", className)}>
      {children}
    </h2>
  );
};

// byLine
export const ByLine = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <p className={cn("text-sm text-slate-700", className)}>{children}</p>;
};

// Section Title
export const SectionTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3 className={cn("text-lg text-slate-700 font-bold title", className)}>
      {children}
    </h3>
  );
};

// Label
export const Label = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <label className={cn("text-sm text-slate-700 font-bold", className)}>
      {children}
    </label>
  );
};

// H1
export const H1 = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h1 className={cn("text-2xl text-slate-700 font-bold title", className)}>
      {children}
    </h1>
  );
};

// H2
export const H2 = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h2 className={cn("text-xl text-slate-700 font-bold title", className)}>
      {children}
    </h2>
  );
};

// H3
export const H3 = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3 className={cn("text-lg text-slate-700 font-bold title", className)}>
      {children}
    </h3>
  );
};

// H4
export const H4 = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h4 className={cn("text-base text-slate-700 font-bold title", className)}>
      {children}
    </h4>
  );
};
