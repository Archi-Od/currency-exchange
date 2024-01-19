import {ChangeDetectorRef, Component, DestroyRef, OnInit} from "@angular/core";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {CurrencyService} from "../../services/currency.service";
import {CurrencyConverter, CurrencyModel} from "../../models/currency.model";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {TranslateModule} from "@ngx-translate/core";
import {MatInputModule} from "@angular/material/input";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatFormFieldModule} from "@angular/material/form-field";
import {finalize, map, Observable, startWith, switchMap} from "rxjs";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatOptionSelectionChange} from "@angular/material/core";
import {CurrencyInputComponent} from "./currency-input/currency-input.component";

export type IForm<T> = {
    [K in keyof T]?: any;
}

@Component({
    selector: "app-currency-container",
    standalone: true,
    imports: [
        NgIf,
        FormsModule,
        TranslateModule,
        ReactiveFormsModule,
        MatInputModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        AsyncPipe,
        NgForOf,
        CurrencyInputComponent
    ],
    providers: [CurrencyService],
    templateUrl: "./currency-converter.component.html",
    styleUrl: "./currency-converter.component.less"
})
export class CurrencyConverterComponent implements OnInit {
    public _loading: boolean = true;

    public currencyRateFrom?: number;
    public currencyRateTo?: number;
    public calculatedRateFrom?: number | string;
    public calculatedRateTo?: number | string;

    public formGroup: FormGroup;
    public filteredCurrenciesFrom?: Observable<CurrencyModel[]>;
    public filteredCurrenciesTo?: Observable<CurrencyModel[]>;

    public resultInfo: string = "";
    private currencies: CurrencyModel[] = [];

    constructor(
        private currencyService: CurrencyService,
        private destroy$: DestroyRef,
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder) {
        this.formGroup = this.fb.group<IForm<CurrencyConverter>>({
            amountFrom: [1, [Validators.required, Validators.min(0)]],
            amountTo: [null, Validators.min(0)],
            currencyFrom: [null, Validators.required],
            currencyTo: [null, Validators.required]
        });
    }

    public ngOnInit(): void {
        this.currencyService.getCountriesCurrency().pipe(
            switchMap(countriesData =>
                this.currencyService.getLatestCurrencyData().pipe(
                    map(exchangeRateData => ({countriesData, exchangeRateData}))
                )
            ),
            map(({countriesData, exchangeRateData}) => {
                const currencies: CurrencyModel[] = [];

                for (const key in exchangeRateData.rates) {
                    const value = exchangeRateData.rates[key];
                    const currency: CurrencyModel = {rate: value, fullName: "", name: key};
                    currencies.push(currency);
                }

                countriesData.forEach((country: any) => {
                    const name = Object.keys(country.currencies)[0];
                    const index = currencies.findIndex((element) => element.name === name);
                    if (index !== -1) {
                        currencies[index] = {
                            ...currencies[index],
                            fullName: country.currencies[name].name,
                        };
                    }
                });

                return currencies;
            }),
            finalize(() => {
                this._loading = false;
                this.cdr.detectChanges();
            }),
            takeUntilDestroyed(this.destroy$),
        ).subscribe(result => {
            this.currencies = result;
        });

        this.filteredCurrenciesFrom = this.createFilteredCountriesObservable("currencyFrom");
        this.filteredCurrenciesTo = this.createFilteredCountriesObservable("currencyTo");

        this.formGroup.valueChanges.pipe(
            takeUntilDestroyed(this.destroy$)
        ).subscribe((formData: CurrencyConverter) => {
            if (this.currencyRateFrom && this.currencyRateTo) {
                const rate = this.getRate();
                const result = (formData.amountFrom * rate).toFixed(2);
                if (formData.amountFrom) {
                    this.calculatedRateTo = result;
                }
                this.getResultInfoRate(formData);
            }
        })

        this.formGroup.controls["amountFrom"].valueChanges.pipe(
            takeUntilDestroyed(this.destroy$)
        ).subscribe(value => {
            if (this.formGroup.value.currencyFrom && this.formGroup.value.currencyTo && value) {
                const rate = this.getRate();
                this.calculatedRateTo = (value * rate).toFixed(2);
            }
        })

        this.formGroup.controls["amountTo"].valueChanges.pipe(
            takeUntilDestroyed(this.destroy$)
        ).subscribe(value => {
            if (this.formGroup.value.currencyFrom && this.formGroup.value.currencyTo && value) {
                const rate = this.getReverseRate();
                this.calculatedRateFrom = (value * rate).toFixed(2);
            }
            if (!value) {
                this.calculatedRateFrom = 1;
            }
        })
    }

    public onSelectChange(event: MatOptionSelectionChange, isFromRate: boolean = false): void {
        const country = event.source.value;
        if (isFromRate) {
            this.currencyRateFrom = this.currencies.find(el => el.name === country)?.rate;
        } else {
            this.currencyRateTo = this.currencies.find(el => el.name === country)?.rate;
        }
    }

    private getRate(): number {
        return (this.currencyRateTo ?? 1) / (this.currencyRateFrom ?? 1);
    }

    private getReverseRate(): number {
        return (this.currencyRateFrom ?? 1) / (this.currencyRateTo ?? 1);
    }

    private getResultInfoRate(formData: CurrencyConverter): void {
        const {currencyFrom, currencyTo} = formData
        this.resultInfo = String("1.00 " + currencyFrom + " = " + this.getRate().toFixed(2) + " " + currencyTo + "\n" +
            "1.00 " + currencyTo + " = " + (1 / this.getRate()).toFixed(2) + " " + currencyFrom);
    }

    private createFilteredCountriesObservable(controlName: string): Observable<CurrencyModel[]> {
        return this.formGroup.controls[controlName].valueChanges.pipe(
            startWith(""),
            map(search => this.filterCountries(search))
        );
    }

    private filterCountries(name: string): CurrencyModel[] {
        if (name) {
            return this.currencies.filter(country => country.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
        } else {
            return this.currencies.slice();
        }
    }

}
