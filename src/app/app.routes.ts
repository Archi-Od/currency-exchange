import {Routes} from "@angular/router";
import {PageNotFoundComponent} from "./shared/page-not-found/page-not-found/page-not-found.component";
import {CurrencyContainerComponent} from "./components/currency-container/currency-container.component";

export const routes: Routes = [
    {path: "", component: CurrencyContainerComponent, pathMatch: "full"},
    {path: "**", component: PageNotFoundComponent},
];
