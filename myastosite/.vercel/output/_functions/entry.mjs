import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_DCfUNFpT.mjs';
import { manifest } from './manifest_Bh2S7n34.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/about.astro.mjs');
const _page2 = () => import('./pages/api/contact.astro.mjs');
const _page3 = () => import('./pages/api/test-email.astro.mjs');
const _page4 = () => import('./pages/blog/_id_.astro.mjs');
const _page5 = () => import('./pages/blog.astro.mjs');
const _page6 = () => import('./pages/contact.astro.mjs');
const _page7 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/about.astro", _page1],
    ["src/pages/api/contact.js", _page2],
    ["src/pages/api/test-email.js", _page3],
    ["src/pages/blog/[id].astro", _page4],
    ["src/pages/blog.astro", _page5],
    ["src/pages/contact.astro", _page6],
    ["src/pages/index.astro", _page7]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "2da90d11-5d29-4d50-aaa9-ba1ce67b3b87",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
