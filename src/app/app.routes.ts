import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { MenuBxiComponent } from "./pages/bxi/menu-bxi/menu-bxi.component";
import { MenutddComponent } from "./tdd/menuTDD/menutdd/menutdd.component";


const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'menuBXI', component: MenuBxiComponent},
    { path: 'menuTDD', component: MenutddComponent },
    { path: '**', component: LoginComponent }

];

export class FeatureRoutingModule {}
export const APP_ROUTES = RouterModule.forRoot(routes, {useHash: true});
