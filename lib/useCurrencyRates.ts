"use client";

import { useState } from "react";

export interface CurrencyOption {
  code: string;
  symbol: string;
  label: string;
  rate: number; // rate FROM AED
}

export const CURRENCIES: CurrencyOption[] = [
  { code: "AED", symbol: "AED", label: "UAE Dirham",    rate: 1       },
  { code: "USD", symbol: "$",   label: "US Dollar",     rate: 0.272   },
  { code: "EUR", symbol: "€",   label: "Euro",          rate: 0.248   },
  { code: "GBP", symbol: "£",   label: "British Pound", rate: 0.211   },
];

export interface CurrencyState {
  selected: CurrencyOption;
  convert: (aedAmount: number) => string;
}

export function useCurrencyRates(): [CurrencyOption, (c: CurrencyOption) => void, CurrencyState] {
  const [selected, setSelected] = useState<CurrencyOption>(CURRENCIES[0]);

  const convert = (aedAmount: number): string =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(aedAmount * selected.rate);

  return [selected, setSelected, { selected, convert }];
}
