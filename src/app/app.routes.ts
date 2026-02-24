import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { MainCatalog } from './components/catalog/main-catalog/main-catalog';

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'manage-catalog',
        component: MainCatalog
    }
];
