import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { TddMenuComponent } from './tdd/tdd-menu/tdd-menu.component';


const pagesRoutes: Routes = [
    {
        path: '', component: PagesComponent,
        children: [
            { path: 'menuTdd', component: TddMenuComponent},
            {path: '', redirectTo: '/menuTdd', pathMatch: 'full' }
        ]
    }
];

export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
