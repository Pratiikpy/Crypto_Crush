const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");

const config = {
  miniapp: {
    version: "1",
    name: "Crypto Crush Confession",
    subtitle: "Anonymous Valentine Confessions",
    description:
      "Send anonymous Valentine's confessions to your crush for 0.1 USDC. They'll never know... unless you reveal yourself.",
    tagline: "Confess your crypto crush",
    homeUrl: APP_URL,
    webhookUrl: `${APP_URL}/api/webhook`,
    iconUrl: `${APP_URL}/icon.png`,
    splashImageUrl: `${APP_URL}/splash.png`,
    splashBackgroundColor: "#1a0a1e",
    heroImageUrl: `${APP_URL}/hero.png`,
    ogTitle: "Crypto Crush Confession",
    ogDescription:
      "Someone sent you an anonymous confession... Pay 0.1 USDC to send yours.",
    ogImageUrl: `${APP_URL}/og.png`,
    primaryCategory: "social",
    tags: ["valentine", "confession", "anonymous", "crush", "love"],
    noindex: false,
  },
};

export default config;
