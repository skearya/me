import type { ShikiConfig } from "astro";

type ShikiTransfomer = Exclude<ShikiConfig["transformers"], undefined>[number];

export const removePrettierIgnore: ShikiTransfomer = {
	preprocess(code) {
		return code
			.split("\n")
			.filter((line) => !line.includes("prettier-ignore"))
			.join("\n");
	},
};
