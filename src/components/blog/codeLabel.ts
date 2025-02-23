import type { ShikiConfig } from "astro";
import { h } from "hastscript";

type ShikiTransfomer = Exclude<ShikiConfig["transformers"], undefined>[number];

const langIcons = [
	"astro",
	"c",
	"electron",
	"iced",
	"java",
	"javascript",
	"motion-canvas",
	"prisma",
	"rust",
	"socket.io",
	"solidjs",
	"sqlite",
	"svelte",
	"sveltekit",
	"tailwind",
	"typescript",
	"vite",
];

export const codeLabel: ShikiTransfomer = {
	pre(hast) {
		const labelText = new URLSearchParams(this.options.meta?.__raw).get(
			"label",
		);

		if (labelText) {
			const label = h("div", {
				class: "not-prose bg-moonlightOverlay absolute top-0 right-0 flex items-center gap-x-2 rounded-tr-md rounded-bl-lg px-2 py-1.5 max-sm:text-sm",
			});

			let lang = hast.properties.dataLanguage;

			if (lang === "js") {
				lang = "javascript";
			}

			if (typeof lang === "string" && langIcons.includes(lang)) {
				label.children.push(
					h("img", {
						src: `/stack/${lang}.svg`,
						alt: lang,
						title: lang,
						height: "20px",
						width: "20px",
					}),
				);
			} else {
				label.children.push(h("span", lang?.toString()));
			}

			label.children.push(h("span", labelText));

			return h("div", { class: "relative" }, hast, label);
		} else {
			return;
		}
	},
};
