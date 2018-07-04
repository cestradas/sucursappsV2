import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { FinalComponent } from './final/final.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'final', component: FinalComponent },
    { path: '**', component: LoginComponent }

];

export class FeatureRoutingModule {}
export const APP_ROUTES = RouterModule.forRoot(routes, {useHash: true});
