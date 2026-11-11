import React, { createContext, useContext, useState } from 'react';

export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 1.0, flag: '🇮🇳', label: 'Global / INR (₹)' },
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.01156, flag: '🇺🇸', label: 'Global / USD ($)' },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.01075, flag: '🇪🇺', label: 'Global / EUR (€)' },
  { code: 'AED', symbol: 'AED ', name: 'UAE Dirham', rate: 0.04255, flag: '🇦🇪', label: 'Global / AED (د.إ)' },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.00909, flag: '🇬🇧', label: 'Global / GBP (£)' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rate: 0.01562, flag: '🇸🇬', label: 'Global / SGD (S$)' },
  { code: 'SAR', symbol: 'SAR ', name: 'Saudi Riyal', rate: 0.04348, flag: '🇸🇦', label: 'Global / SAR (﷼)' },
];

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currencyCode, setCurrencyCode] = useState(() => {
    try {
      return localStorage.getItem('gem_currency') || 'INR';
    } catch (e) {
      return 'INR';
    }
  });

  const currentCurrency = CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0];

  const changeCurrency = (code) => {
    setCurrencyCode(code);
    try {
      localStorage.setItem('gem_currency', code);
    } catch (e) {
      console.error('Storage error:', e);
    }
  };

  const convertPrice = (amountInINR) => {
    if (amountInINR == null || isNaN(amountInINR)) return 0;
    return Number(amountInINR) * currentCurrency.rate;
  };

  const formatPrice = (amountInINR) => {
    if (amountInINR == null || isNaN(amountInINR)) return '';
    const num = Number(amountInINR);
    if (currentCurrency.code === 'INR') {
      return `₹${Math.round(num).toLocaleString('en-IN')}`;
    }
    const converted = num * currentCurrency.rate;
    const isSmall = converted < 100 && converted % 1 !== 0;
    return `${currentCurrency.symbol}${converted.toLocaleString('en-US', {
      minimumFractionDigits: isSmall ? 2 : (converted % 1 === 0 ? 0 : 2),
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency: currencyCode,
        currentCurrency,
        changeCurrency,
        formatPrice,
        convertPrice,
        currencies: CURRENCIES
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);

