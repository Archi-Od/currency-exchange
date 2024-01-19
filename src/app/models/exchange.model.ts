export interface ExchangeModel {
    currencyCodeA: number;
    currencyCodeB: number;
    rateBuy: number | string;
    rateSell: number | string;
    date: number;
    title: string;
}