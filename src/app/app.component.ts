import {Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterOutlet} from "@angular/router";
import {MyTranslateModule} from "./shared/translate.module";
import {HeaderComponent} from "./components/header/header.component";
import {TranslateService} from "@ngx-translate/core";
import {CurrencySelectorComponent} from "./components/currency-selector/currency-selector.component";
import {CurrencyContainerComponent} from "./components/currency-container/currency-container.component";
import {FormsModule} from "@angular/forms";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        FormsModule,
        MyTranslateModule,
        HeaderComponent,
        CurrencySelectorComponent,
        CurrencyContainerComponent,
    ],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.less"
})
export class AppComponent {
    constructor(public translate: TranslateService) {
        translate.setDefaultLang("en");
    }
}
