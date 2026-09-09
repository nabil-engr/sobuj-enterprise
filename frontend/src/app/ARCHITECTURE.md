# Frontend architecture

The application follows feature-first boundaries:

- `core/`: singleton services, guards, interceptors, configuration, and domain contracts.
- `features/`: independently routed business areas. Each feature owns its route configuration and UI.
- `app.routes.ts`: composition root; it only mounts lazy feature routes.
- `app.component.ts`: application shell shared by all routes.

## Dependency direction

Features may depend on `core`. `core` must not import from a feature. Features should not import implementation details from another feature; shared UI should move into a future `shared/` directory once it has at least two consumers.

## Domain contracts

Models are grouped by business domain under `core/models`. Consumers import from the public `core/models` barrel instead of individual legacy files.

## Routing

Every feature exposes a `<feature>.routes.ts` file. Page components are loaded with `loadComponent`, keeping admin, account, authentication, checkout, product detail, and storefront code out of the initial bundle until needed.
