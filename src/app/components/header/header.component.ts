import {Component, DestroyRef, OnInit} from "@angular/core";
import {MyTranslateModule} from "../../shared/translate.module";
import {CurrencyService} from "../../services/currency.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ExchangeModel} from "../../models/exchange.model";
import {NgForOf, NgIf} from "@angular/common";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

const CURRENCY_CODE_HRYVNIA = 980;
const CURRENCY_CODE_EURO = 978;
const CURRENCY_CODE_USD = 840;

const currencyCodeToTitleMap = new Map<number, string>([
    [CURRENCY_CODE_USD, "currency.usd"],
    [CURRENCY_CODE_EURO, "currency.eur"]
]);

@Component({
    selector: "app-header",
    standalone: true,
    imports: [
        MyTranslateModule,
        NgForOf,
        NgIf,
        MatProgressSpinnerModule
    ],
    providers: [CurrencyService],
    templateUrl: "./header.component.html",
    styleUrl: "./header.component.less"
})

export class HeaderComponent implements OnInit {
    public rates: ExchangeModel[] = [];

    constructor(private currencyService: CurrencyService,
                private destroy$: DestroyRef) {
    }

    public ngOnInit(): void {
        this.currencyService.getExchangeRate().pipe(
            takeUntilDestroyed(this.destroy$),
        ).subscribe(data => {
            this.rates = data.filter(item =>
                (item.currencyCodeA === CURRENCY_CODE_USD && item.currencyCodeB === CURRENCY_CODE_HRYVNIA) ||
                (item.currencyCodeA === CURRENCY_CODE_EURO && item.currencyCodeB === CURRENCY_CODE_HRYVNIA)
            ).map(el => ({
                ...el,
                rateBuy: Number(el.rateBuy).toFixed(2),
                rateSell: Number(el.rateSell).toFixed(2),
                title: currencyCodeToTitleMap.get(el.currencyCodeA) || ""
            }));
        })
    }
}
