/* empty css                                 */
import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, f as renderComponent, F as Fragment, e as renderTemplate } from '../chunks/astro/server_ClMXSELU.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_LErIn-6O.mjs';
import 'clsx';
export { renderers } from '../renderers.mjs';

const $$Astro$4 = createAstro("https://www.palchat.org");
const $$HeroSection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$HeroSection;
  const {
    title = "Technology that serves humanity, not profit",
    subtitle = "We envision a world where digital platforms are collectively owned by the communities that use them. Where value flows back to people, not corporations.",
    primaryButtonText = "Our Vision",
    primaryButtonLink = "#vision",
    secondaryButtonText = "Our Mission",
    secondaryButtonLink = "#mission"
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="hero-section"> <div class="component-container"> <div class="hero-container"> <h1 class="hero-title"> ${title.includes("humanity, not profit") ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`
Technology that serves
<span class="hero-title-gradient">humanity, not profit</span> ` })}` : title} </h1> <p class="hero-subtitle"> ${subtitle} </p> <div class="hero-buttons"> <a${addAttribute(primaryButtonLink, "href")} class="hero-primary-button"> ${primaryButtonText} </a> <a${addAttribute(secondaryButtonLink, "href")} class="hero-secondary-button"> ${secondaryButtonText} </a> </div> </div> </div> </section>`;
}, "/Users/charanpaldeol/palchat/palchat/myastosite/src/components/HeroSection.astro", void 0);

const $$Astro$3 = createAstro("https://www.palchat.org");
const $$VisionSection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$VisionSection;
  const {
    title = "Our Vision",
    subtitle = "A digital world where communities own the platforms they use, where transparency is the norm, and where technology serves human flourishing.",
    backgroundColor = "vision-section",
    visionItems = [
      {
        title: "Collective Ownership",
        description: "Communities own and govern the platforms they use",
        icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
        iconColor: "vision-icon-blue",
        bgColor: "vision-icon-bg-blue"
      },
      {
        title: "Transparency",
        description: "Open algorithms, clear policies, and accountable governance",
        icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
        iconColor: "vision-icon-green",
        bgColor: "vision-icon-bg-green"
      },
      {
        title: "Human Flourishing",
        description: "Technology that uplifts humanity, not exploits it",
        icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
        iconColor: "vision-icon-purple",
        bgColor: "vision-icon-bg-purple"
      }
    ]
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section id="vision"${addAttribute(backgroundColor, "class")}> <div class="component-container"> <div class="vision-container"> <div class="vision-header"> <h2 class="vision-title"> ${title} </h2> <p class="vision-subtitle"> ${subtitle} </p> </div> <div class="vision-grid"> ${visionItems.map((item) => renderTemplate`<div class="vision-item"> <div${addAttribute(`vision-icon-container ${item.bgColor}`, "class")}> <svg${addAttribute(`vision-icon ${item.iconColor}`, "class")} fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${addAttribute(item.icon, "d")}></path> </svg> </div> <h3 class="vision-item-title">${item.title}</h3> <p class="vision-item-description">${item.description}</p> </div>`)} </div> </div> </div> </section>`;
}, "/Users/charanpaldeol/palchat/palchat/myastosite/src/components/VisionSection.astro", void 0);

const $$Astro$2 = createAstro("https://www.palchat.org");
const $$MissionSection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$MissionSection;
  const {
    title = "Our Mission",
    subtitle = "To educate, inspire, and empower communities to take control of their digital lives and create technology that truly serves human flourishing.",
    backgroundColor = "mission-section",
    missionItems = [
      {
        title: "Educate",
        description: "Raise awareness about how digital systems shape our lives and the importance of digital sovereignty.",
        bulletPoints: [
          "Understanding surveillance capitalism",
          "Digital privacy and data rights",
          "Alternative ownership models"
        ],
        accentColor: "mission-accent-blue"
      },
      {
        title: "Empower",
        description: "Provide tools, knowledge, and community support to help people take action.",
        bulletPoints: [
          "Building alternative platforms",
          "Community governance models",
          "Digital sovereignty practices"
        ],
        accentColor: "mission-accent-green"
      }
    ]
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section id="mission"${addAttribute(backgroundColor, "class")}> <div class="component-container"> <div class="mission-container"> <div class="mission-header"> <h2 class="mission-title"> ${title} </h2> <p class="mission-subtitle"> ${subtitle} </p> </div> <div class="mission-grid"> ${missionItems.map((item) => renderTemplate`<div class="mission-card"> <h3 class="mission-card-title">${item.title}</h3> <p class="mission-card-description"> ${item.description} </p> <div class="mission-bullet-list"> ${item.bulletPoints.map((point) => renderTemplate`<div class="mission-bullet-item"> <div${addAttribute(`mission-bullet-dot ${item.accentColor}`, "class")}></div> <span class="mission-bullet-text">${point}</span> </div>`)} </div> </div>`)} </div> </div> </div> </section>`;
}, "/Users/charanpaldeol/palchat/palchat/myastosite/src/components/MissionSection.astro", void 0);

const $$Astro$1 = createAstro("https://www.palchat.org");
const $$ValuesSection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ValuesSection;
  const {
    title = "Our Values",
    subtitle = "These core values guide everything we do.",
    backgroundColor = "values-section",
    cardBackgroundColor = "values-card",
    values = [
      {
        title: "Digital Sovereignty",
        description: "Full control over your digital presence and data"
      },
      {
        title: "Collective Ownership",
        description: "Communities own the platforms they use"
      },
      {
        title: "Privacy by Design",
        description: "Privacy as a default, not an afterthought"
      },
      {
        title: "Transparency",
        description: "Openness in technology and intention"
      },
      {
        title: "Community First",
        description: "Prioritizing people over profit"
      },
      {
        title: "Human Flourishing",
        description: "Technology that uplifts humanity"
      }
    ]
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section${addAttribute(backgroundColor, "class")}> <div class="component-container"> <div class="values-container"> <div class="values-header"> <h2 class="values-title"> ${title} </h2> <p class="values-subtitle"> ${subtitle} </p> </div> <div class="values-grid"> ${values.map((value) => renderTemplate`<div${addAttribute(cardBackgroundColor, "class")}> <h3 class="values-card-title">${value.title}</h3> <p class="values-card-description">${value.description}</p> </div>`)} </div> </div> </div> </section>`;
}, "/Users/charanpaldeol/palchat/palchat/myastosite/src/components/ValuesSection.astro", void 0);

const $$Astro = createAstro("https://www.palchat.org");
const $$CTASection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CTASection;
  const {
    title = "Join the Movement",
    subtitle = "Be part of building a better digital future.",
    primaryButtonText = "Get Involved",
    primaryButtonLink = "/contact",
    secondaryButtonText = "Learn More",
    secondaryButtonLink = "/about",
    backgroundColor = "cta-section"
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section${addAttribute(backgroundColor, "class")}> <div class="component-container"> <div class="cta-container"> <h2 class="cta-title"> ${title} </h2> <p class="cta-subtitle"> ${subtitle} </p> <div class="cta-buttons"> <a${addAttribute(primaryButtonLink, "href")} class="cta-primary-button"> ${primaryButtonText} </a> <a${addAttribute(secondaryButtonLink, "href")} class="cta-secondary-button"> ${secondaryButtonText} </a> </div> </div> </div> </section>`;
}, "/Users/charanpaldeol/palchat/palchat/myastosite/src/components/CTASection.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "PalChat - Technology that serves humanity, not profit" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "HeroSection", $$HeroSection, {})} ${renderComponent($$result2, "VisionSection", $$VisionSection, {})} ${renderComponent($$result2, "MissionSection", $$MissionSection, {})} ${renderComponent($$result2, "ValuesSection", $$ValuesSection, {})} ${renderComponent($$result2, "CTASection", $$CTASection, {})} ` })}`;
}, "/Users/charanpaldeol/palchat/palchat/myastosite/src/pages/index.astro", void 0);

const $$file = "/Users/charanpaldeol/palchat/palchat/myastosite/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
