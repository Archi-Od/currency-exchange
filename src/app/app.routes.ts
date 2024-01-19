import {Routes} from "@angular/router";
import {PageNotFoundComponent} from "./shared/page-not-found/page-not-found/page-not-found.component";
import {CurrencyConverterComponent} from "./components/currency-container/currency-converter.component";

export const routes: Routes = [
    {path: "", component: CurrencyConverterComponent, pathMatch: "full"},
    {path: "**", component: PageNotFoundComponent},
];
