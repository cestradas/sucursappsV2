import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';


const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '**', component: LoginComponent }

];

export class FeatureRoutingModule {}
export const APP_ROUTES = RouterModule.forRoot(routes, {useHash: true});
