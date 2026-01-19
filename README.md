# buvette-front

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```



CartPage :
<img width="1894" height="806" alt="image" src="https://github.com/user-attachments/assets/4bdecf01-930e-4950-9365-ed89c708d712" />



## Organisation:
The frontend uses a Module-based structure to keep views and components manageable as the feature set grows.

  src/modules/client/: Contains the customer-facing dashboard, menu, and cart views.

  src/modules/employee/: Contains the staff-only dashboard and order management tools.

  src/components/shared/: Common UI elements (Buttons, Inputs, Modals) used by both roles.

  src/router/: Centralized routing with Navigation Guards to prevent unauthorized role access.

  src/stores/: Role-specific Pinia stores (cartStore.js for clients, orderQueueStore.js for workers).

