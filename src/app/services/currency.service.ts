import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ExchangeModel} from "../models/exchange.model";

@Injectable({
    providedIn: "root",
})
export class CurrencyService {

    constructor(private http: HttpClient) {
    }

    public getLatestCurrencyData(): Observable<any> {
        return this.http.get<any>("https://open.er-api.com/v6/latest/USD");
    }

    public getExchangeRate(): Observable<ExchangeModel[]> {
        return this.http.get<ExchangeModel[]>("https://api.monobank.ua/bank/currency");
    }

    public getCountriesCurrency(): Observable<any> {
        return this.http.get<any>("https://restcountries.com/v3.1/all?fields=currencies")
    }

}


