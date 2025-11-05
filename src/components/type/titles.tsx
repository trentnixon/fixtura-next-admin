import { cn } from "@/lib/utils";
import React from "react";

export type AccountType = {
  id: string;
  attributes: {
    Name: string;
  };
};

/**
 * Title Component
 *
 * Main page title - largest heading (3xl). Use for the primary heading on a page.
 *
 * @example
 * ```tsx
 * <Title>Dashboard</Title>
 * ```
 */
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

/**
 * PageTitle Component
 *
 * Alias for Title - semantic naming for main page titles.
 * Use for consistency when referring to page-level titles.
 */
export const PageTitle = Title;

/**
 * Subtitle Component
 *
 * Secondary heading (xl). Use for subsections or secondary page titles.
 *
 * @example
 * ```tsx
 * <Subtitle>Account Overview</Subtitle>
 * ```
 */
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

/**
 * ByLine Component
 *
 * Small descriptive text (sm). Use for subtitles, captions, or metadata.
 *
 * @example
 * ```tsx
 * <ByLine>Last updated: {date}</ByLine>
 * ```
 */
export const ByLine = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <p className={cn("text-sm text-slate-700", className)}>{children}</p>;
};

/**
 * SectionTitle Component
 *
 * Section heading (lg). Use for major sections within a page.
 *
 * @example
 * ```tsx
 * <SectionTitle>Analytics Overview</SectionTitle>
 * ```
 */
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

/**
 * SubsectionTitle Component
 *
 * Smaller section heading (base). Use for nested sections or subsections.
 *
 * @example
 * ```tsx
 * <SubsectionTitle>Performance Metrics</SubsectionTitle>
 * ```
 */
export const SubsectionTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h4 className={cn("text-base text-slate-700 font-semibold", className)}>
      {children}
    </h4>
  );
};

/**
 * Label Component
 *
 * Form label or small bold text (sm). Use for form labels or small headings.
 *
 * @example
 * ```tsx
 * <Label>Email Address</Label>
 * ```
 */
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

/**
 * H1 Component
 *
 * Heading level 1 (2xl). Alternative to Title with slightly smaller size.
 */
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

/**
 * H2 Component
 *
 * Heading level 2 (xl). Use for secondary headings.
 */
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

/**
 * H3 Component
 *
 * Heading level 3 (lg). Use for section headings.
 */
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

/**
 * H4 Component
 *
 * Heading level 4 (base). Use for subsection headings.
 */
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
