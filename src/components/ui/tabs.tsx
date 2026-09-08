"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const tabsListVariants = cva(
  "inline-flex h-9 items-center justify-center rounded-full p-2 text-muted-foreground",
  {
    variants: {
      variant: {
        default: "bg-muted",
        primary: "bg-brandPrimary-50 border border-brandPrimary-200",
        secondary: "bg-brandSecondary-50 border border-brandSecondary-200",
        accent: "bg-brandAccent-50 border border-brandAccent-200",
        sectionInverse:
          "bg-sidebar border border-sidebar-border text-sidebar-foreground shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> &
    VariantProps<typeof tabsListVariants>
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListVariants({ variant }), className)}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
        section:
          "gap-3 text-sidebar hover:bg-sidebar hover:text-white active:bg-sidebar active:text-white data-[state=active]:bg-sidebar data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:hover:bg-sidebar data-[state=active]:hover:text-white [&_svg]:shrink-0 [&_svg]:text-current",
        sectionInverse:
          "gap-2 px-2.5 py-1 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white active:bg-sidebar-accent active:text-white data-[state=active]:bg-white data-[state=active]:text-sidebar data-[state=active]:shadow-none data-[state=active]:hover:bg-white data-[state=active]:hover:text-sidebar [&_svg]:shrink-0 [&_svg]:text-current",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> &
    VariantProps<typeof tabsTriggerVariants>
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant }), className)}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants, tabsTriggerVariants };
