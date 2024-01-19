export interface CurrencyModel {
    rate: number;
    fullName: string;
    name: string;
    symbol: string;
}

export interface CurrencyConverter {
    amountFrom: number;
    amountTo: number;
    currencyFrom: string;
    currencyTo: string;
}
