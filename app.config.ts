import environment from "./environment";

const LIGHT_SPLASH = {
  image: "./assets/images/splash-light.png",
  backgroundColor: "#FFFFFF",
};
const DARK_SPLASH = {
  image: "./assets/images/splash-dark.png",
  backgroundColor: "#000000",
};

const SHARED_SPLASH = {
  splash: {
    ...LIGHT_SPLASH,
    dark: {
      ...DARK_SPLASH,
    },
  },
};

module.exports = ({ config }: any) => {
  const envExtra = environment.env;
  return {
    name: "CashGlide",
    slug: "cashglide",
    ...config,
    splash: LIGHT_SPLASH,
    ios: {
      ...config.ios,
      ...SHARED_SPLASH,
    },
    android: {
      ...config.android,
      ...SHARED_SPLASH,
    },
    extra: {
      ...config.extra,
      ...envExtra,
    },
  };
};
