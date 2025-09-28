import type { SocialObjects } from "@/lib/types";

export const GA_ID_PLACEHOLDER = "G-Z172WTEVZD";

export const ANALYTICS = {
  googleAnalyticsId: import.meta.env.PUBLIC_GOOGLE_ANALYTICS_ID ?? GA_ID_PLACEHOLDER,
} as const;

export const SITE = {
  website: "https://sharenote.xyz",
  author: "soprinter",
  desc: "Sharenote docs: an FEP where miners mint sharenotes from shares to link verifiable work with likes, views, boosts, and collaboratively customize block templates.",
  title: "Sharenote",
  ogImage: "og-image.png",
  repo: "https://github.com/soprinter/sharenote",
};

export const LOCALE = {
  lang: "en", // html lang code. Set this empty and default will be "en"
  langTag: ["en-US"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const menu_items: { title: string; href: string }[] = [
  // {
  //   title: "Home",
  //   href: "/",
  // },
];

// Just works with top-level folders and files. For files, don't add extension as it looks for the slug, and not the file name.
export const side_nav_menu_order: string[] = [
  // Top-level docs order matches yay.mdx TOC
  "introduction",
  "motivation-and-goals",
  "how-sharenote-works",
  "architecture",
  "workflow-wbet-stage",
  "benefits-and-use-cases",
  "getting-started",
  "draft-fep-and-nip-development",
  "faqs",
  "resources",
];

// Don't delete anything. You can use 'true' or 'false'.
// These are global settings
export const docconfig = {
  hide_table_of_contents: false,
  hide_breadcrumbs: false,
  hide_side_navigations: false,
  hide_datetime: false,
  hide_time: true,
  hide_search: false,
  hide_repo_button: false,
  hide_author: true,
};

// Set your social. It will appear in footer. Don't change the `name` value.
export const Socials: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/soprinter/",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
];
