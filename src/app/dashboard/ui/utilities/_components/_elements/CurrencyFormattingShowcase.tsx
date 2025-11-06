"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import CodeExample from "./CodeExample";

/**
 * Currency Formatting Showcase
 *
 * Displays currency formatting patterns
 */
export default function CurrencyFormattingShowcase() {
  const formatCurrency = (
    amount: number,
    currency: string = "USD",
    locale: string = "en-US"
  ): string => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(amount);
  };

  const amounts = [
    { value: 1234.56, currency: "USD", locale: "en-US", label: "US Dollar" },
    { value: 1234.56, currency: "EUR", locale: "en-US", label: "Euro" },
    {
      value: 1234.56,
      currency: "GBP",
      locale: "en-GB",
      label: "British Pound",
    },
    { value: 1234.56, currency: "JPY", locale: "ja-JP", label: "Japanese Yen" },
    {
      value: 1234.56,
      currency: "AUD",
      locale: "en-AU",
      label: "Australian Dollar",
    },
  ];

  return (
    <SectionContainer
      title="Currency Formatting"
      description="Format numbers as currency with locale support"
    >
      <div className="space-y-6">
        <ElementContainer title="Currency Formats">
          <div className="space-y-2">
            {amounts.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-sm font-mono">
                  {formatCurrency(item.value, item.currency, item.locale)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <CodeExample
              code={`const formatCurrency = (
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
};

<span>{formatCurrency(1234.56, "USD", "en-US")}</span>
<span>{formatCurrency(1234.56, "EUR", "en-US")}</span>
<span>{formatCurrency(1234.56, "GBP", "en-GB")}</span>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Currency Variations">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground mb-1">
                Small Amount
              </div>
              <div className="text-2xl font-bold">
                {formatCurrency(12.99, "USD")}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground mb-1">
                Medium Amount
              </div>
              <div className="text-2xl font-bold">
                {formatCurrency(1234.56, "USD")}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground mb-1">
                Large Amount
              </div>
              <div className="text-2xl font-bold">
                {formatCurrency(1234567.89, "USD")}
              </div>
            </div>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<div className="text-2xl font-bold">
  {formatCurrency(12.99, "USD")}
</div>
<div className="text-2xl font-bold">
  {formatCurrency(1234.56, "USD")}
</div>
<div className="text-2xl font-bold">
  {formatCurrency(1234567.89, "USD")}
</div>`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}
