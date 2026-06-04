PS C:\Users\KHAN GADGET\Documents\horizon_ai_app_builder> npm run build

> horizon-ai-app-builder@0.1.0 build
> next build

  ▲ Next.js 14.2.10

   Creating an optimized production build ...
 ✓ Compiled successfully

./src/app/layout.tsx
25:9  Warning: Custom fonts not added in `pages/_document.js` will only load for a single page. This is discouraged. See: https://nextjs.org/docs/messages/no-page-custom-font  @next/next/no-page-custom-font

info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/basic-features/eslint#disabling-rules
   Linting and checking validity of types  .Failed to compile.

./src/app/orders/page.tsx:294:36
Type error: Property 'isMore' does not exist on type '{ name: string; qty: number; price: number; icon: string; gradient: string; iconColor: string; } | { name: string; qty: number; price: number; icon: string; gradient: string; iconColor: string; isMore?: undefined; } | { ...; }'.
  Property 'isMore' does not exist on type '{ name: string; qty: number; price: number; icon: string; gradient: string; iconColor: string; }'.

  292 |                           <div>
  293 |                             <p className="font-medium text-[11px] md:text-[12px] text-on-surface leading-tight">{item.name}</p>
> 294 |                             {!item.isMore && <p className="text-[9px] md:text-[10px] text-on-surface-variant">×{item.qty} · ৳{item.price}</p>}
      |                                    ^
  295 |                             {item.isMore && <p className="text-[9px] md:text-[10px] text-on-surface-variant">item</p>}
  296 |                           </div>
  297 |                         </div>