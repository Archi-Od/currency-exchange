import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from "@angular/core";
import {MatInputModule} from "@angular/material/input";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {AsyncPipe, NgForOf} from "@angular/common";
import {AbstractControl, FormControl, ReactiveFormsModule} from "@angular/forms";
import {Observable} from "rxjs";
import {CurrencyModel} from "../../../../models/currency.model";
import {MatOptionSelectionChange} from "@angular/material/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {TranslateModule} from "@ngx-translate/core";

@Component({
    selector: "app-currency-input",
    standalone: true,
    imports: [
        MatInputModule,
        NgForOf,
        ReactiveFormsModule,
        AsyncPipe,
        MatInputModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        TranslateModule,
    ],
    templateUrl: "./currency-input.component.html",
    styleUrl: "./currency-input.component.less",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyInputComponent {
    @Input() placeholder!: string;
    @Input() selectorControl?: any;
    @Input() amountControl?: any;
    @Input() calculatedRate?: number | string;
    @Input() filteredCurrencies?: Observable<CurrencyModel[]>;

    @Output() selectRate: EventEmitter<MatOptionSelectionChange> = new EventEmitter<MatOptionSelectionChange>();

}
