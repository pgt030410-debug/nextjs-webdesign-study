'use server';

// Simple mock exchange rates since we are just demonstrating the capability
// In a real production app, we would fetch from Frankfurter API or similar
const MOCK_EXCHANGE_RATES: Record<string, number> = {
    KRW: 1,           // Base
    USD: 1 / 1350,    // 1 KRW = ~0.00074 USD
};

export async function getExchangeRate(targetCurrency: string): Promise<number> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return MOCK_EXCHANGE_RATES[targetCurrency.toUpperCase()] || 1;
}
