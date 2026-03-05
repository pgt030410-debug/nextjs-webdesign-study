/**
 * Formats a number into a currency string (KRW, USD).
 * Uses the Intl.NumberFormat API for native localization.
 * 
 * @param value The amount to format (base is KRW).
 * @param currencyCode The currency to format to ('KRW', 'USD'). Default is 'KRW'.
 * @param exchangeRate The exchange rate from KRW to the target currency. Default is 1.
 * @returns Formatted currency string
 */
export function formatCurrency(value: number | string | undefined | null, currencyCode: string = 'KRW', exchangeRate: number = 1): string {
    if (value === undefined || value === null) return formatZero(currencyCode);

    const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : value;

    if (isNaN(numericValue)) return formatZero(currencyCode);

    const convertedValue = numericValue * exchangeRate;
    const fractionDigits = currencyCode === 'USD' ? 2 : 0;

    return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: currencyCode,
        maximumFractionDigits: fractionDigits,
        minimumFractionDigits: fractionDigits,
    }).format(convertedValue);
}

function formatZero(currencyCode: string): string {
    return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: currencyCode,
        maximumFractionDigits: currencyCode === 'USD' ? 2 : 0,
    }).format(0);
}

// Keep formatKRW for legacy compatibility during refactor, wrapping formatCurrency
export function formatKRW(value: number | string | undefined | null, showSymbol: boolean = true): string {
    const formatted = formatCurrency(value, 'KRW', 1);
    return showSymbol ? formatted : formatted.replace('₩', '').trim();
}

/**
 * Parses a numeric formatted string back to a number.
 */
export function parseCurrency(value: string): number {
    if (!value) return 0;
    const parsed = parseFloat(value.replace(/[^0-9.-]+/g, ''));
    return isNaN(parsed) ? 0 : parsed;
}
