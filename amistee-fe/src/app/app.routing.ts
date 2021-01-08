import { Routes } from '@angular/router'
import { Crm01Component } from './crm01/crm01.component'
import { Crm02Component } from './crm02/crm02.component'
export const AppRoutes: Routes = [{
    path: 'crm_v01',
    component: Crm01Component
},
{
    path: 'crm_v02',
    component: Crm02Component
},{ path: '',  redirectTo: '/crm_v01', pathMatch: 'full' },]