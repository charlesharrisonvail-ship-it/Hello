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

  // Charles is licensed across the entire state of Colorado (user-provided 2026-11-09;
  // confirm on the Division of Real Estate record). Brokerage services are described as Colorado only.
  // Portrait for the About section. Put a real photo of Charles at assets/brand/charles-portrait.jpg
  // (or .webp) and set src to that path. Empty = the About section simply shows no portrait.
  // Never use a generated likeness of Charles.
  // Portrait chosen and supplied by Charles on 2026-11-09 (cropped 4:5 from his image). The earlier
  // HeyGen-frame headshot was rejected.
  portrait: {
    src: "assets/brand/charles-portrait.jpg",
    alt: "Portrait of Charles Harrison"
  },

  serviceArea: "Colorado statewide, with a focus on the mountain markets",

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

  // Online scheduling. Paste the public link to a booking page (for example a Google Calendar
  // appointment schedule or a Calendly page). Empty = the site says scheduling is not set up
  // yet and asks visitors to request a time through the form. Never invent a link.
  // TEMPORARY (Charles, 2026-11-09): this is his Epique booking page, titled "Schedule a 20 minute
  // Epique breakdown". Replace it with a Harrison Development appointment schedule when he makes one.
  bookingUrl: "https://calendar.app.google/zejpSpwL6aDy3VAaA",

  // Concept studies (Dowd Junction, Red Mountain Ranch). They are independent, unsolicited
  // studies built on public information. Set to false to hide the whole section, for example
  // while a pitch is still awaiting a reply. See docs/LAUNCH-CHECKLIST.md before publishing.
  showConcepts: true,

  // Staging safety: the preview ribbon is shown until set to false at an authorized launch.
  // Also remove the robots noindex meta tag and robots.txt Disallow at launch.
  previewBanner: true
};
