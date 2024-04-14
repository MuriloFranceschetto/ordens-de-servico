import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "",
        loadComponent: () => import('./pages/pages.component').then(c => c.PagesComponent),
        children: [
            {
                path: 'registrations',
                loadComponent: () => import('./pages/registrations/registrations.component').then(c => c.RegistrationsComponent),
            },
            {
                path: 'users',
                loadComponent: () => import('./pages/registrations/users/users.component').then(c => c.UsersComponent),
            },
            {
                path: 'subservices',
                loadComponent: () => import('./pages/registrations/subservices/subservices.component').then(c => c.SubservicesComponent),
            },
            {
                path: 'orders',
                loadComponent: () => import('./pages/orders/orders.component').then(c => c.OrdersComponent),
            },
            {
                path: 'order/:id',
                loadComponent: () => import('./shared/components/order/order.component').then(c => c.OrderComponent),
            },
        ]
    },
    {
        path: "login",
        loadComponent: () => import('./login/login.component').then(l => l.LoginComponent)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
