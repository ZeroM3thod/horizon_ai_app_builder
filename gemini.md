PS C:\Users\KHAN GADGET\Documents\horizon_ai_app_builder> npm run build

> horizon-ai-app-builder@0.1.0 build
> next build

  ▲ Next.js 14.2.10

   Creating an optimized production build ...
 ✓ Compiled successfully

Failed to compile.

./src/app/(store)/products/page.tsx
96:10  Error: 'cartCount' is assigned a value but never used.  @typescript-eslint/no-unused-vars
99:10  Error: 'runners' is assigned a value but never used.  @typescript-eslint/no-unused-vars
100:9  Error: 'cartIconRef' is assigned a value but never used.  @typescript-eslint/no-unused-vars

./src/app/layout.tsx
29:9  Warning: Custom fonts not added in `pages/_document.js` will only load for a single page. This is discouraged. See: https://nextjs.org/docs/messages/no-page-custom-font  @next/next/no-page-custom-font
33:9  Warning: Custom fonts not added in `pages/_document.js` will only load for a single page. This is discouraged. See: https://nextjs.org/docs/messages/no-page-custom-font  @next/next/no-page-custom-font

info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/basic-features/eslint#disabling-rules
PS C:\Users\KHAN GADGET\Documents\horizon_ai_app_builder> 