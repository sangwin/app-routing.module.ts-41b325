
# Custom Preloading Strategy in Angular

## Overview

This project demonstrates how to implement a **custom route preloading strategy** in Angular using the `PreloadingStrategy` interface and RxJS.

Angular lazy loads modules when their routes are accessed. With a custom preloading strategy, selected modules can be loaded in the background after a specified delay, improving navigation performance when users visit those routes later.

## Features

- **Lazy Loading:** Loads feature modules only when required or preloaded.
- **Custom Preloading:** Preloads selected modules based on route configuration.
- **Configurable Delays:** Sets a different preload delay for each route.
- **Selective Preloading:** Uses route metadata to determine which modules should be preloaded.
- **RxJS Integration:** Uses `timer()` to delay module loading.

## Implementation

The routing configuration defines which modules should be preloaded and their respective delays.

```typescript
{
  path: 'admin',
  loadChildren: () =>
    import('./admin/admin.module').then(x => x.AdminModule),
  data: { preload: true, delay: 3000 }
}
```

The custom strategy checks the route's `data` property and loads the module after the specified delay.

```typescript
@Injectable()
export class CustomPreloadingStrategy implements PreloadingStrategy {
  preload(
    route: Route,
    load: () => Observable<any>
  ): Observable<any> {
    if (route.data && route.data['preload']) {
      const delay = route.data['delay'] ?? 0;

      return timer(delay).pipe(
        mergeMap(() => load())
      );
    }

    return of(null);
  }
}
```

## How It Works

1. **Route Configuration:** Each route specifies whether it should be preloaded using `data: { preload: true }`.
2. **Custom Strategy:** Angular invokes `CustomPreloadingStrategy` for eligible lazy-loaded routes.
3. **Delay Handling:** The `timer()` operator waits for the configured delay in milliseconds.
4. **Module Loading:** After the delay, the `load()` function loads the module.
5. **Selective Preloading:** Routes without `preload: true` are skipped.

## Example Configuration

| Route | Preloading | Delay |
|---|---|---|
| `/auth` | No | — |
| `/admin` | Yes | 3 seconds |
| `/dashboard` | Yes | 5 seconds |
| `/products` | No | — |

**Note:** The delays are measured from when Angular's preloading strategy processes each route, not necessarily from application startup. Routes may be processed sequentially, so delays should not be interpreted as exact application-wide loading times.

## Advantages

- Improves navigation to frequently accessed lazy-loaded routes.
- Allows fine-grained control over module preloading.
- Avoids preloading every feature module unnecessarily.
- Supports route-specific loading behavior.

## Important Notes

- Configure the strategy with `RouterModule.forRoot(routes, { preloadingStrategy: CustomPreloadingStrategy })`.
- Ensure `CustomPreloadingStrategy` is provided through Angular dependency injection if required by your Angular version and module configuration.
- The provided example uses `flatMap`, which is an alias for `mergeMap` in RxJS. Modern implementations commonly use `mergeMap`.
- Preloading downloads and evaluates code; it does not automatically activate the route.

## Reference

- [Angular PreloadingStrategy API](https://angular.dev/api/router/PreloadingStrategy)
- [Angular Route Loading Strategies](https://angular.dev/guide/routing/customizing-route-behavior)

## Author

**Sangwin Gawande**

Website: [https://sangw.in](https://sangw.in)

---

Cheers!!
