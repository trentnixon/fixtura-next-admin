import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import InvoiceInlineAlert from "@/app/dashboard/orders/invoices/[invoiceRequestId]/components/InvoiceInlineAlert";

describe("InvoiceInlineAlert", () => {
  it("renders warning severity with title and body", () => {
    const { container } = render(
      <InvoiceInlineAlert severity="warning" title="Warning title">
        Warning body
      </InvoiceInlineAlert>
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("border-amber-200", "bg-amber-50");
    expect(screen.getByText("Warning title")).toBeInTheDocument();
    expect(screen.getByText("Warning body")).toBeInTheDocument();
    expect(container.querySelector(".text-amber-900\\/90")).toBeTruthy();
  });

  it("renders error severity with title and body", () => {
    render(
      <InvoiceInlineAlert severity="error" title="Error title">
        Error body
      </InvoiceInlineAlert>
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("border-destructive/30", "bg-destructive/10");
    expect(screen.getByText("Error title")).toBeInTheDocument();
    expect(screen.getByText("Error body")).toBeInTheDocument();
  });

  it("omits body when children are not provided", () => {
    render(<InvoiceInlineAlert severity="warning" title="Title only" />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Title only")).toBeInTheDocument();
    expect(screen.queryByText("Warning body")).not.toBeInTheDocument();
  });
});
