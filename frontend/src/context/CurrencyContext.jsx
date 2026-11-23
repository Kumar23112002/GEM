import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export const BASE_CURRENCY = 'AED';

export const CURRENCY_SYMBOLS = {
  AED: 'AED ',
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  SAR: 'SAR ',
};

export const CURRENCIES = [
  { code: 'AED', symbol: 'AED ', name: 'UAE Dirham', flag: '🇦🇪', label: 'Global / AED (د.إ)', isBase: true },
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', label: 'Global / USD ($)' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', label: 'Global / EUR (€)' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', label: 'Global / GBP (£)' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', label: 'Global / INR (₹)' },
  { code: 'SAR', symbol: 'SAR ', name: 'Saudi Riyal', flag: '🇸🇦', label: 'Global / SAR (﷼)' },
];

// Fallback rates relative to 1 AED (official peg: 1 USD = 3.6725 AED; 1 USD = 3.75 SAR)
const DEFAULT_RATES_FROM_AED = {
  AED: 1.0,
  USD: 0.27229,
  EUR: 0.24721,
  GBP: 0.20615,
  INR: 25.51,
  SAR: 1.0211,
};

const STORAGE_KEY_CURRENCY = 'gem_currency';
const STORAGE_KEY_RATES = 'gem_frankfurter_rates';
const STORAGE_KEY_INIT = 'gem_base_aed_v1';

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  // Initialize currency code: default to AED (base currency)
  const [currencyCode, setCurrencyCode] = useState(() => {
    try {
      // One-time initialization to switch default to AED as base currency
      if (localStorage.getItem(STORAGE_KEY_INIT) !== 'true') {
        localStorage.setItem(STORAGE_KEY_INIT, 'true');
        localStorage.setItem(STORAGE_KEY_CURRENCY, 'AED');
        return 'AED';
      }
      const saved = localStorage.getItem(STORAGE_KEY_CURRENCY);
      if (saved && saved !== 'SGD' && CURRENCIES.some((c) => c.code === saved)) {
        return saved;
      }
      return 'AED';
    } catch (e) {
      return 'AED';
    }
  });

  // Rates relative to 1 AED
  const [ratesFromAED, setRatesFromAED] = useState(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY_RATES);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.rates && parsed.rates.AED) {
          return { ...DEFAULT_RATES_FROM_AED, ...parsed.rates };
        }
      }
    } catch (e) {
      // ignore
    }
    return DEFAULT_RATES_FROM_AED;
  });

  const [lastUpdated, setLastUpdated] = useState(null);
  const [rateSource, setRateSource] = useState('Frankfurter API');

  // Fetch live rates from Frankfurter API
  const fetchLiveRates = useCallback(async () => {
    try {
      // 1. Primary: Frankfurter v2 API with base=AED
      try {
        const res = await fetch('https://api.frankfurter.dev/v2/rates?base=AED&quotes=INR,USD,EUR,GBP,SAR', {
          headers: { Accept: 'application/json' },
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const newRates = { AED: 1.0 };
            data.forEach((item) => {
              if (item.quote && typeof item.rate === 'number') {
                newRates[item.quote] = item.rate;
              }
            });
            setRatesFromAED(newRates);
            setLastUpdated(new Date());
            setRateSource('Frankfurter API v2 (base=AED)');
            try {
              localStorage.setItem(
                STORAGE_KEY_RATES,
                JSON.stringify({ base: 'AED', rates: newRates, timestamp: Date.now() })
              );
            } catch (err) {}
            return;
          }
        }
      } catch (e) {
        console.warn('Frankfurter v2 failed, trying fallback...', e);
      }

      // 2. Secondary fallback: Frankfurter v1 API with base=USD (convert to AED peg 3.6725)
      try {
        const res = await fetch('https://api.frankfurter.dev/v1/latest?base=USD', {
          headers: { Accept: 'application/json' },
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.rates) {
            const usdRates = data.rates;
            const AED_PEG = 3.6725;
            const newRates = {
              AED: 1.0,
              USD: 1 / AED_PEG,
              EUR: (usdRates.EUR || 0.91) / AED_PEG,
              GBP: (usdRates.GBP || 0.758) / AED_PEG,
              INR: (usdRates.INR || 93.48) / AED_PEG,
              SAR: 3.75 / AED_PEG,
            };
            setRatesFromAED(newRates);
            setLastUpdated(new Date());
            setRateSource('Frankfurter API v1 (USD Pegged)');
            try {
              localStorage.setItem(
                STORAGE_KEY_RATES,
                JSON.stringify({ base: 'AED', rates: newRates, timestamp: Date.now() })
              );
            } catch (err) {}
            return;
          }
        }
      } catch (e) {
        console.warn('Frankfurter v1 fallback failed', e);
      }
    } catch (err) {
      console.error('Error fetching live rates from Frankfurter:', err);
    }
  }, []);

  useEffect(() => {
    fetchLiveRates();

    // Periodic refresh every 10 minutes
    const interval = setInterval(fetchLiveRates, 10 * 60 * 1000);

    // Refresh when user returns to tab
    const handleFocus = () => fetchLiveRates();
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchLiveRates]);

  // Dynamic currencies with live calculated rates
  const currencies = useMemo(() => {
    const inrPerAED = ratesFromAED.INR || DEFAULT_RATES_FROM_AED.INR || 25.51;
    return CURRENCIES.map((c) => {
      const rateFromAED = ratesFromAED[c.code] || DEFAULT_RATES_FROM_AED[c.code] || 1;
      // Multiplier from catalog base (INR) to target currency
      const rateFromINR = rateFromAED / inrPerAED;
      return {
        ...c,
        rate: rateFromINR,
        rateFromAED,
      };
    });
  }, [ratesFromAED]);

  const currentCurrency = currencies.find((c) => c.code === currencyCode) || currencies[0];

  const changeCurrency = (code) => {
    if (!CURRENCIES.some((c) => c.code === code)) return;
    setCurrencyCode(code);
    try {
      localStorage.setItem(STORAGE_KEY_CURRENCY, code);
    } catch (e) {
      console.error('Storage error:', e);
    }
  };

  const convertPrice = useCallback(
    (amount, fromCurrency = 'AED', toCurrency = currentCurrency?.code || 'AED') => {
      if (amount == null || isNaN(amount)) return 0;
      const num = Number(amount);
      const from = (fromCurrency || 'AED').toUpperCase();
      const to = (toCurrency || currentCurrency?.code || 'AED').toUpperCase();

      if (from === to) return num;

      const fromRate = ratesFromAED[from] || DEFAULT_RATES_FROM_AED[from] || 1;
      const toRate = ratesFromAED[to] || DEFAULT_RATES_FROM_AED[to] || 1;

      // Convert from source currency to AED base, then to target currency
      const inAED = num / fromRate;
      return inAED * toRate;
    },
    [currentCurrency?.code, ratesFromAED]
  );

  const formatPrice = useCallback(
    (amount, fromCurrency = 'AED') => {
      if (amount == null || isNaN(amount)) return '';
      const num = Number(amount);
      const toCode = currentCurrency?.code || 'AED';
      const converted = convertPrice(num, fromCurrency, toCode);

      if (toCode === 'INR') {
        return `₹${Math.round(converted).toLocaleString('en-IN')}`;
      }

      const isSmall = converted < 100 && converted % 1 !== 0;
      return `${currentCurrency?.symbol || 'AED '}${converted.toLocaleString('en-US', {
        minimumFractionDigits: isSmall ? 2 : (converted % 1 === 0 ? 0 : 2),
        maximumFractionDigits: 2,
      })}`;
    },
    [currentCurrency, convertPrice]
  );

  const formatRawPrice = useCallback(
    (amount) => {
      return formatPrice(amount, currentCurrency?.code || 'AED');
    },
    [formatPrice, currentCurrency?.code]
  );

  const getCurrencySymbol = useCallback((code) => {
    const key = (code || 'AED').toUpperCase();
    return CURRENCY_SYMBOLS[key] || `${key} `;
  }, []);

  return (
    <CurrencyContext.Provider
      value={{
        currency: currencyCode,
        currentCurrency,
        changeCurrency,
        formatPrice,
        formatRawPrice,
        convertPrice,
        getCurrencySymbol,
        currencies,
        baseCurrency: BASE_CURRENCY,
        ratesFromAED,
        lastUpdated,
        rateSource,
        refreshRates: fetchLiveRates,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
