export interface CurrencyModel {
    rate: number;
    fullName: string;
    name: string;
}

export interface CurrencyConverter {
    amountFrom: number;
    amountTo: number;
    currencyFrom: string;
    currencyTo: string;
}
