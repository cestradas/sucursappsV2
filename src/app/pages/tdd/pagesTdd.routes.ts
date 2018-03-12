import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from '../pages.component';
import { MenutddComponent } from './menuTDD/menutdd/menutdd.component';



const pageRoutesTDD: Routes = [
    {
        path: '', component: PagesComponent,
        children: [
            { path: 'menuTdd', component: MenutddComponent},
            {path: '', redirectTo: '/menuTdd', pathMatch: 'full' }
        ]
    }
];

export const PAGES_ROUTES_TDD = RouterModule.forChild( pageRoutesTDD );
