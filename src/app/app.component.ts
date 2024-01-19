import {Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterOutlet} from "@angular/router";
import {MyTranslateModule} from "./shared/translate.module";
import {HeaderComponent} from "./components/header/header.component";
import {TranslateService} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";
import {CurrencyConverterComponent} from "./components/currency-converter/currency-converter.component";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        FormsModule,
        MyTranslateModule,
        HeaderComponent,
        CurrencyConverterComponent,
    ],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.less"
})
export class AppComponent {
    constructor(public translate: TranslateService) {
        translate.setDefaultLang("en");
    }
}
