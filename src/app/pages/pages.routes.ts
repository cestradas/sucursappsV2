import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { MenutddComponent } from './tdd/menuTDD/menutdd/menutdd.component';
import { MenuBxiComponent } from './bxi/menu-bxi/menu-bxi.component';


const pagesRoutes: Routes = [
    {
        path: '', component: PagesComponent,
        children: [
            { path: 'menuTdd', component: MenutddComponent},
            { path: 'menuBXI', component: MenuBxiComponent},
            {path: '', redirectTo: '/menuTdd', pathMatch: 'full' }
        ]
    }
];

export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
