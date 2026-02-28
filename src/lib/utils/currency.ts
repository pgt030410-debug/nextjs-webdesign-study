/**
 * Formats a number into Korean Won (KRW) currency string.
 * Uses the Intl.NumberFormat API for native localization.
 * 
 * @param value The amount to format.
 * @param showSymbol Whether to show the '₩' symbol. Default is true.
 * @returns Formatted currency string (e.g., "₩1,234,567" or "1,234,567")
 */
export function formatKRW(value: number | string | undefined | null, showSymbol: boolean = true): string {
    if (value === undefined || value === null) return showSymbol ? '₩0' : '0';

    const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : value;

    if (isNaN(numericValue)) return showSymbol ? '₩0' : '0';

    const formatted = new Intl.NumberFormat('ko-KR', {
        style: 'decimal',
        maximumFractionDigits: 0,
    }).format(numericValue);

    return showSymbol ? `₩${formatted}` : formatted;
}

/**
 * Parses a KRW formatted string back to a number.
 * Useful for handling input fields or raw data extraction.
 * 
 * @param value The KRW formatted string (e.g., "₩1,234,567")
 * @returns The parsed numeric value.
 */
export function parseKRW(value: string): number {
    if (!value) return 0;
    const parsed = parseFloat(value.replace(/[^0-9.-]+/g, ''));
    return isNaN(parsed) ? 0 : parsed;
}
