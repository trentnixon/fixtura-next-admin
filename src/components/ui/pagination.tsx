"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

const paginationContainerVariants = cva(
  "inline-flex items-center justify-center rounded-full p-2",
  {
    variants: {
      variant: {
        default: "bg-muted",
        primary: "bg-brandPrimary-50 border border-brandPrimary-200",
        secondary: "bg-brandSecondary-50 border border-brandSecondary-200",
        accent: "bg-brandAccent-50 border border-brandAccent-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const PaginationContext = React.createContext<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
} | null>(null);

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  children: React.ReactNode;
  variant?: VariantProps<typeof paginationContainerVariants>["variant"];
  className?: string;
  showPages?: number; // Number of page buttons to show
}

const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      children,
      variant = "default",
      className,
    },
    ref
  ) => {
    return (
      <PaginationContext.Provider
        value={{ currentPage, totalPages, onPageChange }}
      >
        <div
          ref={ref}
          className={cn(paginationContainerVariants({ variant }), className)}
        >
          {children}
        </div>
      </PaginationContext.Provider>
    );
  }
);
Pagination.displayName = "Pagination";

const PaginationContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof paginationContainerVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(paginationContainerVariants({ variant }), className)}
    {...props}
  />
));
PaginationContainer.displayName = "PaginationContainer";

const PaginationPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    showLabel?: boolean;
  }
>(({ className, showLabel = true, ...props }, ref) => {
  const context = React.useContext(PaginationContext);
  if (!context) {
    throw new Error("PaginationPrevious must be used within Pagination");
  }

  const { currentPage, onPageChange } = context;

  return (
    <Button
      ref={ref}
      variant="outline"
      size="sm"
      onClick={() => onPageChange(Math.max(1, currentPage - 1))}
      disabled={currentPage === 1}
      className={cn("rounded-full", className)}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      {showLabel && "Previous"}
    </Button>
  );
});
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    showLabel?: boolean;
  }
>(({ className, showLabel = true, ...props }, ref) => {
  const context = React.useContext(PaginationContext);
  if (!context) {
    throw new Error("PaginationNext must be used within Pagination");
  }

  const { currentPage, totalPages, onPageChange } = context;

  return (
    <Button
      ref={ref}
      variant="outline"
      size="sm"
      onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
      disabled={currentPage === totalPages}
      className={cn("rounded-full", className)}
      {...props}
    >
      {showLabel && "Next"}
      <ChevronRight className="h-4 w-4" />
    </Button>
  );
});
PaginationNext.displayName = "PaginationNext";

const PaginationPage = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    page: number;
  }
>(({ className, page, ...props }, ref) => {
  const context = React.useContext(PaginationContext);
  if (!context) {
    throw new Error("PaginationPage must be used within Pagination");
  }

  const { currentPage, onPageChange } = context;

  return (
    <Button
      ref={ref}
      variant={currentPage === page ? "default" : "outline"}
      size="sm"
      onClick={() => onPageChange(page)}
      className={cn("w-8 rounded-full", className)}
      {...props}
    >
      {page}
    </Button>
  );
});
PaginationPage.displayName = "PaginationPage";

const PaginationEllipsis = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn("px-2 text-sm text-muted-foreground", className)}
      {...props}
    >
      ...
    </span>
  );
});
PaginationEllipsis.displayName = "PaginationEllipsis";

interface PaginationPagesProps {
  showPages?: number;
  className?: string;
}

const PaginationPages = React.forwardRef<HTMLDivElement, PaginationPagesProps>(
  ({ showPages = 5, className, ...props }, ref) => {
    const context = React.useContext(PaginationContext);
    if (!context) {
      throw new Error("PaginationPages must be used within Pagination");
    }

    const { currentPage, totalPages } = context;

    const pages: (number | "ellipsis")[] = [];
    const maxVisible = showPages;

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of visible range
      const start = Math.max(2, currentPage - Math.floor(maxVisible / 2));
      const end = Math.min(totalPages - 1, start + maxVisible - 3);

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push("ellipsis");
      }

      // Add visible pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push("ellipsis");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-1", className)}
        {...props}
      >
        {pages.map((page, index) => {
          if (page === "ellipsis") {
            return <PaginationEllipsis key={`ellipsis-${index}`} />;
          }
          return <PaginationPage key={page} page={page} />;
        })}
      </div>
    );
  }
);
PaginationPages.displayName = "PaginationPages";

const PaginationInfo = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & {
    format?: "short" | "long"; // "Page 1 of 10" or "1-10 of 100"
    totalItems?: number;
    itemsPerPage?: number;
  }
>(
  (
    { className, format = "short", totalItems, itemsPerPage = 10, ...props },
    ref
  ) => {
    const context = React.useContext(PaginationContext);
    if (!context) {
      throw new Error("PaginationInfo must be used within Pagination");
    }

    const { currentPage, totalPages } = context;

    let text = "";
    if (format === "short") {
      text = `Page ${currentPage} of ${totalPages}`;
    } else if (format === "long" && totalItems) {
      const start = (currentPage - 1) * itemsPerPage + 1;
      const end = Math.min(currentPage * itemsPerPage, totalItems);
      text = `Showing ${start}-${end} of ${totalItems} results`;
    }

    return (
      <span
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      >
        {text}
      </span>
    );
  }
);
PaginationInfo.displayName = "PaginationInfo";

export {
  Pagination,
  PaginationContainer,
  PaginationPrevious,
  PaginationNext,
  PaginationPage,
  PaginationPages,
  PaginationEllipsis,
  PaginationInfo,
  paginationContainerVariants,
};
