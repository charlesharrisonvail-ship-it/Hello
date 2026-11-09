/*
 * Harrison Development: central brand and contact configuration.
 * Every public value on the site comes from here. Edit this file only.
 *
 * RULE: if a value is unknown, leave it as an empty string. The site will omit it.
 * Never type an invented phone, email, address, license number or endpoint here.
 * Each value's verification status is tracked in docs/VERIFICATION.md.
 */
window.HD_CONFIG = {
  brandName: "Harrison Development",
  descriptor: "Development Marketing & Sales",
  tagline: "Mountain-market expertise. Intelligent marketing. Strategic sales.",

  // Proposed attribution. Pending managing-broker review (see LAUNCH-CHECKLIST.md).
  attribution: "Led by Charles Harrison. Real estate brokerage services provided through Epique Realty.",

  // Credentials, in the order Charles requested. User-provided; confirm active status,
  // spelling and permission to use before publication.
  credentials: ["RSPS", "MRP", "REALTOR®", "Ai Pro", "AiRE Instructor"],

  // Taken from Charles's own email signature; he approved using them (2026-11-08)
  // as user-provided, pending broker review.
  contact: {
    phone: "970-904-0600",
    email: "charlesharrison@epique.me"
  },

  // Existing professional page (user-provided).
  professionalSite: "https://charlesharrison.epiquerealty.com/",

  serviceArea: "Colorado and the Rocky Mountain region",

  // Business and website operator details for the privacy page. UNKNOWN until Charles confirms.
  // Do not claim LLC status, and do not invent a street address.
  operator: {
    legalName: "",
    mailingAddress: ""
  },

  // Contact form delivery.
  //  - formEndpoint: URL of an approved endpoint (HTTPS). Empty = the form stays in preview-only mode.
  //  - mailtoFallback: when true, a valid form offers a clearly labelled button that opens the
  //    visitor's own email app. It does not send anything by itself.
  formEndpoint: "",
  mailtoFallback: true,

  // Accent color: "yellow" (neon yellow, default) or "pink" (neon pink).
  accent: "yellow",

  // Staging safety: the preview ribbon is shown until set to false at an authorized launch.
  // Also remove the robots noindex meta tag and robots.txt Disallow at launch.
  previewBanner: true
};
