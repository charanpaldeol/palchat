import 'kleur/colors';
import { i as decodeKey } from './chunks/astro/server_ClMXSELU.mjs';
import 'clsx';
import 'cookie';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_Bhrm8elH.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/charanpaldeol/palchat/palchat/myastosite/","cacheDir":"file:///Users/charanpaldeol/palchat/palchat/myastosite/node_modules/.astro/","outDir":"file:///Users/charanpaldeol/palchat/palchat/myastosite/dist/","srcDir":"file:///Users/charanpaldeol/palchat/palchat/myastosite/src/","publicDir":"file:///Users/charanpaldeol/palchat/palchat/myastosite/public/","buildClientDir":"file:///Users/charanpaldeol/palchat/palchat/myastosite/dist/client/","buildServerDir":"file:///Users/charanpaldeol/palchat/palchat/myastosite/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.CyByHO65.css"}],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/contact","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/contact\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/contact.js","pathname":"/api/contact","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/test-email","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/test-email\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"test-email","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/test-email.js","pathname":"/api/test-email","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.CyByHO65.css"}],"routeData":{"route":"/blog/[id]","isIndex":false,"type":"page","pattern":"^\\/blog\\/([^/]+?)\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/blog/[id].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.CyByHO65.css"}],"routeData":{"route":"/blog","isIndex":false,"type":"page","pattern":"^\\/blog\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog.astro","pathname":"/blog","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.CyByHO65.css"}],"routeData":{"route":"/contact","isIndex":false,"type":"page","pattern":"^\\/contact\\/?$","segments":[[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact.astro","pathname":"/contact","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.CyByHO65.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"site":"https://www.palchat.org","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/charanpaldeol/palchat/palchat/myastosite/src/pages/about.astro",{"propagation":"none","containsHead":true}],["/Users/charanpaldeol/palchat/palchat/myastosite/src/pages/blog.astro",{"propagation":"none","containsHead":true}],["/Users/charanpaldeol/palchat/palchat/myastosite/src/pages/blog/[id].astro",{"propagation":"none","containsHead":true}],["/Users/charanpaldeol/palchat/palchat/myastosite/src/pages/contact.astro",{"propagation":"none","containsHead":true}],["/Users/charanpaldeol/palchat/palchat/myastosite/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astro-page:src/pages/about@_@astro":"pages/about.astro.mjs","\u0000@astro-page:src/pages/api/contact@_@js":"pages/api/contact.astro.mjs","\u0000@astro-page:src/pages/api/test-email@_@js":"pages/api/test-email.astro.mjs","\u0000@astro-page:src/pages/blog/[id]@_@astro":"pages/blog/_id_.astro.mjs","\u0000@astro-page:src/pages/blog@_@astro":"pages/blog.astro.mjs","\u0000@astro-page:src/pages/contact@_@astro":"pages/contact.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","/Users/charanpaldeol/palchat/palchat/myastosite/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_BlajZP0U.mjs","\u0000@astrojs-manifest":"manifest_Bh2S7n34.mjs","@astrojs/react/client.js":"_astro/client.bnNPSdWK.js","/Users/charanpaldeol/palchat/palchat/myastosite/src/pages/blog.astro?astro&type=script&index=0&lang.ts":"_astro/blog.astro_astro_type_script_index_0_lang.BEIevdOT.js","/Users/charanpaldeol/palchat/palchat/myastosite/src/pages/contact.astro?astro&type=script&index=0&lang.ts":"_astro/contact.astro_astro_type_script_index_0_lang.7z5_BLQp.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/Users/charanpaldeol/palchat/palchat/myastosite/src/pages/blog.astro?astro&type=script&index=0&lang.ts","document.addEventListener(\"DOMContentLoaded\",function(){document.querySelectorAll(\".category-filter\").forEach(o=>{o.addEventListener(\"click\",function(){const t=this.dataset.category;document.querySelectorAll(\".category-filter\").forEach(e=>{e.classList.remove(\"bg-blue-100\",\"text-blue-800\"),e.classList.add(\"bg-gray-100\",\"text-gray-700\",\"hover:bg-gray-200\")}),this.classList.remove(\"bg-gray-100\",\"text-gray-700\",\"hover:bg-gray-200\"),this.classList.add(\"bg-blue-100\",\"text-blue-800\"),document.querySelectorAll(\".post-card\").forEach(e=>{t===\"all\"||e.dataset.category===t?e.style.display=\"block\":e.style.display=\"none\"})})});const c=document.getElementById(\"search-posts\");c&&c.addEventListener(\"input\",function(){const o=this.value.toLowerCase();document.querySelectorAll(\".post-card\").forEach(t=>{const e=t.querySelector(\"h2\"),l=t.querySelector(\"p\"),r=t.querySelectorAll(\".text-xs\"),n=e?e.textContent.toLowerCase():\"\",a=l?l.textContent.toLowerCase():\"\",i=Array.from(r).map(s=>s.textContent.toLowerCase()),u=n.includes(o)||a.includes(o)||i.some(s=>s.includes(o));t.style.display=u?\"block\":\"none\"})})});"],["/Users/charanpaldeol/palchat/palchat/myastosite/src/pages/contact.astro?astro&type=script&index=0&lang.ts","document.addEventListener(\"DOMContentLoaded\",function(){const a=document.getElementById(\"contact-form\"),s=document.getElementById(\"submit-btn\"),d=document.getElementById(\"submit-text\"),r=document.getElementById(\"message-container\"),i=document.getElementById(\"success-message\"),l=document.getElementById(\"error-message\"),g=document.getElementById(\"success-text\"),f=document.getElementById(\"error-text\");function n(t,e){r.classList.add(\"hidden\"),i.classList.add(\"hidden\"),l.classList.add(\"hidden\"),r.classList.remove(\"hidden\"),t===\"success\"?(g.textContent=e,i.classList.remove(\"hidden\")):(f.textContent=e,l.classList.remove(\"hidden\")),setTimeout(()=>{r.classList.add(\"hidden\")},5e3)}function m(t){t?(s.disabled=!0,d.textContent=\"Sending...\",s.classList.add(\"opacity-75\",\"cursor-not-allowed\")):(s.disabled=!1,d.textContent=\"Send Suggestion\",s.classList.remove(\"opacity-75\",\"cursor-not-allowed\"))}a.addEventListener(\"submit\",async function(t){t.preventDefault();const e=new FormData(a),c={name:e.get(\"name\")||\"\",subject:e.get(\"subject\"),message:e.get(\"message\")};if(!c.subject||!c.message){n(\"error\",\"Please fill in all required fields.\");return}m(!0);try{const o=await fetch(\"/api/contact\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify(c)}),u=await o.json();o.ok?(n(\"success\",u.message||\"Your message has been sent successfully!\"),a.reset()):n(\"error\",u.error||\"Failed to send message. Please try again.\")}catch(o){console.error(\"Form submission error:\",o),n(\"error\",\"Network error. Please check your connection and try again.\")}finally{m(!1)}})});"]],"assets":["/_astro/about.CyByHO65.css","/favicon.svg","/_astro/client.bnNPSdWK.js","/assets/palchatlogo.png"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"FlOLMWOO5iXrK1oMToa7Qf6QIJ1Bh7GN4EuEFUoHJF0="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
