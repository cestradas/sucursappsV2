import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';

import { MenuBxiComponent } from './bxi/menu-bxi/menu-bxi.component';
import { MenutddComponent } from './tdd/menuTDD/menutdd.component';


const pagesRoutes: Routes = [
    {
       
        path: '', component: PagesComponent,
        children: [
            { path: 'menuTdd', component: MenutddComponent},
            { path: 'menuBXI', component: MenuBxiComponent}
            
        ]
        
    }
];
export class FeatureRoutingModule {}
export const PAGES_ROUTES = RouterModule.forRoot(pagesRoutes, {useHash: true});
// export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);

