/* empty css                                 */
import { a as createComponent, f as renderComponent, e as renderTemplate, m as maybeRenderHead, h as renderScript, b as addAttribute } from '../chunks/astro/server_ClMXSELU.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_LErIn-6O.mjs';
import { b as blogPosts } from '../chunks/blogPosts_B3vuK6ex.mjs';
export { renderers } from '../renderers.mjs';

const $$Blog = createComponent(($$result, $$props, $$slots) => {
  const categories = [
    { id: "all", name: "All Posts", count: blogPosts.length },
    { id: "privacy", name: "Privacy", count: blogPosts.filter((p) => p.category === "privacy").length },
    { id: "technology", name: "Technology", count: blogPosts.filter((p) => p.category === "technology").length },
    { id: "communication", name: "Communication", count: blogPosts.filter((p) => p.category === "communication").length }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Blog - PalChat" }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-16"> <div class="container mx-auto px-4"> <div class="max-w-4xl mx-auto text-center"> <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
Privacy-First Blog
</h1> <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
Share thoughts and ideas without the burden of accounts or data collection. 
          Every post is anonymous by design.
</p> </div> </div> </section>  <section class="py-16 bg-white"> <div class="container mx-auto px-4"> <div class="max-w-6xl mx-auto"> <!-- Simple Filters and Search --> <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6"> <div class="flex flex-wrap gap-2"> ${categories.map((category) => renderTemplate`<button${addAttribute(category.id, "data-category")}${addAttribute(["px-4 py-2 rounded-lg font-medium transition-all duration-300 category-filter", [
    category.id === "all" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
  ]], "class:list")}> ${category.name} (${category.count})
</button>`)} </div> <div class="relative w-full lg:w-80"> <input type="text" id="search-posts" placeholder="Search posts..." class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"> <svg class="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path> </svg> </div> </div> <!-- Simple Blog Posts Grid --> <div id="posts-grid" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8"> ${blogPosts.map((post) => renderTemplate`<article class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 post-card"${addAttribute(post.category, "data-category")}> <div class="p-6"> <!-- Post Header --> <div class="flex items-center justify-between mb-4"> <div class="flex items-center gap-2"> <span class="text-sm text-gray-500">${post.readTime}</span> <span class="text-gray-300">•</span> <span class="text-sm text-gray-500">${new Date(post.date).toLocaleDateString()}</span> </div> </div> <!-- Post Title and Content --> <h2 class="text-xl font-bold text-gray-900 mb-3"> <a${addAttribute(`/blog/${post.id}`, "href")} class="hover:text-blue-600 transition-colors duration-200"> ${post.title} </a> </h2> <p class="text-gray-600 mb-4 leading-relaxed"> ${post.excerpt} </p> <!-- Post Meta --> <div class="flex items-center justify-between mb-4"> <div class="flex items-center gap-4 text-sm text-gray-500"> <span class="font-medium">By ${post.author}</span> <span>•</span> <span>${post.wordCount} words</span> </div> </div> <!-- Tags --> <div class="flex flex-wrap gap-2"> ${post.tags.map((tag) => renderTemplate`<span class="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">${tag}</span>`)} </div> </div> </article>`)} </div> </div> </div> </section> ${renderScript($$result2, "/Users/charanpaldeol/palchat/palchat/myastosite/src/pages/blog.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/Users/charanpaldeol/palchat/palchat/myastosite/src/pages/blog.astro", void 0);

const $$file = "/Users/charanpaldeol/palchat/palchat/myastosite/src/pages/blog.astro";
const $$url = "/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Blog,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
