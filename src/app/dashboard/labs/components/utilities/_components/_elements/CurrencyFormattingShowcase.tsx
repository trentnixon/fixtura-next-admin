"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { SubsectionTitle } from "@/components/type/titles";
import ComponentRef from "./ComponentRef";
import { UTILITY_TOKENS } from "./utilityTokens";

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

const currencyAmounts = [
  { value: 1234.56, currency: "USD", locale: "en-US", label: "US Dollar" },
  { value: 1234.56, currency: "EUR", locale: "en-US", label: "Euro" },
  { value: 1234.56, currency: "GBP", locale: "en-GB", label: "British Pound" },
  { value: 1234.56, currency: "JPY", locale: "ja-JP", label: "Japanese Yen" },
  { value: 1234.56, currency: "AUD", locale: "en-AU", label: "Australian Dollar" },
];

/**
 * Currency formatting showcase — multi-currency and amount scale patterns
 */
export default function CurrencyFormattingShowcase() {
  return (
    <SectionContainer
      title="Currency Formatting"
      description="Format numbers as currency with locale support"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Currency Formats</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              Intl.NumberFormat · locale
            </span>
          </div>
          <div className="space-y-2">
            {currencyAmounts.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-sm font-mono">
                  {formatCurrency(item.value, item.currency, item.locale)}
                </span>
              </div>
            ))}
          </div>
          <ComponentRef token={UTILITY_TOKENS.currency.formats} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Amount Scale</SubsectionTitle>
            <span className="text-xs text-muted-foreground">small · medium · large</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground mb-1">Small Amount</div>
              <div className="text-2xl font-bold">{formatCurrency(12.99, "USD")}</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground mb-1">Medium Amount</div>
              <div className="text-2xl font-bold">{formatCurrency(1234.56, "USD")}</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground mb-1">Large Amount</div>
              <div className="text-2xl font-bold">{formatCurrency(1234567.89, "USD")}</div>
            </div>
          </div>
          <ComponentRef token={UTILITY_TOKENS.currency.variations} />
        </div>
      </div>
    </SectionContainer>
  );
}
