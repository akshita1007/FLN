export const Colors = {
  primary: {
    lighter: "#D0ECFE",
    light: "#73BAFB",
    main: "#1877F2",
    dark: "#0C44AE",
    darker: "#042174",
    contrastText: "#FFFFFF",
    Extra: "#f3f4f6",
  },
  secondary: {
    lighter: "#EFD6FF",
    light: "#C684FF",
    main: "#8E33FF",
    dark: "#5119B7",
    darker: "#27097A",
    contrastText: "#FFFFFF",
  },
  info: {
    lighter: "#CAFDF5",
    light: "#61F3F3",
    main: "#00B8D9",
    dark: "#006C9C",
    darker: "#003768",
    contrastText: "#FFFFFF",
  },
  success: {
    lighter: "#D3FCD2",
    light: "#77ED8B",
    main: "#22C55E",
    dark: "#118D57",
    darker: "#065E49",
    contrastText: "#ffffff",
  },
  warning: {
    lighter: "#FFF5CC",
    light: "#FFD666",
    main: "#FFAB00",
    dark: "#B76E00",
    darker: "#7A4100",
    contrastText: "#1C252E",
  },
  error: {
    lighter: "#FFE9D5",
    light: "#FFAC82",
    main: "#FF5630",
    dark: "#B71D18",
    darker: "#7A0916",
    contrastText: "#FFFFFF",
  },
  grey: {
    g50: "#FCFDFD",
    g100: "#F9FAFB",
    g200: "#F4F6F8",
    g300: "#DFE3E8",
    g350: "#E0E0E0",
    g400: "#C4CDD5",
    g500: "#919EAB",
    g600: "#637381",
    g700: "#454F5B",
    g800: "#1C252E",
    g900: "#141A21",
  },
  palettes: {
    pal: "linear-gradient(121deg, rgb(215, 19, 88) 18%, rgb(208, 192, 192) 91%)",
    pal2: "linear-gradient(182deg, rgb(190, 230, 201) 18%, rgb(66, 143, 100) 92%)",
    pal3: "linear-gradient(110deg, rgb(83, 152, 237) 20%, rgb(47, 121, 179) 98%)",
    pal4: "linear-gradient(168deg, rgb(129, 207, 53) 21%, rgb(86, 115, 127) 98%)",
    pal5: "linear-gradient(55deg, rgb(240, 241, 168) 1%, rgb(132, 129, 75) 91%)",
  },
  common: {
    black: "#000000",
    white: "#FFFFFF",
  },

  bg: {
    bg1: "#f9fafb",
    bg2: "#f3f4f6",
    bg3: "#6366f1",
    bg4: "#2563eb",
    bg5: "#1d4ed8",
  },

  extra: {
    e1: "#73bafb",
    e2: "#ffffff",
    e3: "#27272a",
    e4: "#374151",
    e5: "#6b7280",
    e6: "#d6d3d1",
    e7: "#525252",
    e8: "#f0f9ff",
  },

  gradient: {
    shades: "linear-gradient(90deg, #2563eb, #38bdf8)",
    shades1: "linear-gradient(90deg, #ea580c, #dc2626)",
  },

  onHover: {
    shades: "linear-gradient(90deg, #38bdf8, #2563eb)",
    shades1: "linear-gradient(90deg, #c084fc, #818cf8)",
  },
};

export default function getColorByNumber(colorNum) {
  const colorKeys = Object.keys(Colors);
  const selectedColor = Colors[colorKeys[colorNum - 1]];

  if (!selectedColor) {
    return null;
  }

  return {
    lighter: selectedColor.lighter,
    light: selectedColor.light,
    main: selectedColor.main,
    dark: selectedColor.dark,
    darker: selectedColor.darker,
    contrastText: selectedColor.contrastText,
  };
}
