import { NgModule, Injectable } from '@angular/core';
import { RouterModule, Routes, PreloadingStrategy, Route } from '@angular/router';

import { Observable, of, timer } from 'rxjs';
import { flatMap } from 'rxjs/operators'

// Modules will current route will load immediately
const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(x => x.AuthModule),
    // component: AuthComponent // This also can be done
    // This Module will be Eagerly loaded whenever application is initialized 
    // as it's default route else, it's lazy loaded
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(x => x.AdminModule),
    data: { preload: true, delay: 3000 } // Will load after delay of 6 seconds
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(x => x.DashboardModule),
    data: { preload: true, delay: 5000 } // Will load after delay of 5 seconds
  },
  {
    path: 'products',
    loadChildren: () => import('./products/products.module').then(x => x.ProductsModule)
    // This Module will be Lazy loaded whenever /products route is accessed
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth'
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      { preloadingStrategy: CustomPreloadingStrategy } // Adding Custom Preloading Strategy class
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }


@Injectable()
export class CustomPreloadingStrategy implements PreloadingStrategy {

    preload(route: Route, loadMe: () => Observable<any>): Observable<any> {

        // Get the route and check the 'preload' key on data object
        if (route.data && route.data['preload']) {
            const delay: number = route.data['delay']; // Get the delay in milliseconds
            console.log('Will preload module on route *[' + route.path + ']* with specified delay of *[' + delay + ']*');
            // Add a time to load the module on delay
            return timer(delay).pipe(
                flatMap(_ => {
                    console.log('Loaded *[' + route.path + ']* module after delay of *[' + delay + ']*');
                    return loadMe(); // Loading the Module
                }));
        } else {
            console.log('no preload for the path *[' + route.path + ']*');
            return of(null);
        }
    }

}
