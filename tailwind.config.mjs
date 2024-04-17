/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				// https://www.michaelandreuzza.com/vscode/sequoia/
				moonlightBase: "#0F1014",
				moonlightInterface: "#111216",
				moonlightOverlay: "#131317",
				moonlightSoft: "#43444D",
				moonlightSlight: "#575861",
				moonlightText: "#868690",
				moonlightFocusLow: "#121216",
				moonlightFocusMedium: "#1A1B1F",
				moonlightFocusHigh: "#1F1F24",

				moonlightWhite: "#fdfdfe",
				moonlightStone: "#9898a6",
				moonlightOrange: "#ffbb88",
				moonlightPink: "#f58ee0",
				moonlightIndigo: "#c58fff",
				moonlightBlue: "#8eb6f5",

				monochromeKashmir: "#626983",
				monochromeSlate: "#7C829D",
				monochromeLogan: "#999EB2",
				monochromeCadet: "#B6BAC8",
				monochromeCat: "#D3D5DE",
				monochromeCloud: "#E2E4ED",
			},
			fontFamily: {
				sans: "Inter Variable, sans-serif",
				mono: "JetBrains Mono Variable, monospace"
			}
		},
	},
	plugins: [],
}
