import type { APIContext } from "astro";
import { html } from "satori-html";
import satori from "satori";
import sharp from "sharp";
import { getCollection } from "astro:content";

export async function getStaticPaths() {
	const posts = (await getCollection("blog")).map((post) => {
		return {
			params: {
				name: post.slug,
			},
			props: {
				title: post.data.title,
			},
		};
	});

	return posts;
}

export async function GET(context: APIContext) {
	const inter = await fetch(
		"https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff",
	).then((res) => res.arrayBuffer());

	// Array.from({ length: 10 }, () => [Math.round(Math.random() * 968), Math.round(Math.random() * 508)]);
	const fishPositions = [
		[71, 179],
		[71, 370],
		[278, 161],
		[939, 66],
		[737, 92],
		[575, 450],
		[27, 50],
		[700, 368],
		[506, 88],
		[273, 341],
	];

	const markup = html(`<div
		style="background-color: rgb(17, 18, 22)"
		tw="flex w-full h-full items-center justify-center"
	>
		<h1 tw="text-white absolute bottom-0 mb-[240px]">
			${context.props.title}
		</h1>
		<h1 tw="absolute bottom-1 text-white">skeary.me</h1>
		${fishPositions.map(([x, y]) => {
			return `<h1 tw="text-white text-xl absolute opacity-50" style="left: ${x}px; top: ${y}px;">><></h1>`;
		})}
	</div>`);

	const svg = await satori(markup, {
		width: 968,
		height: 508,
		fonts: [
			{
				name: "Inter",
				data: inter,
				weight: 400,
				style: "normal",
			},
		],
	});

	const png = sharp(Buffer.from(svg)).png();
	const response = await png.toBuffer();

	return new Response(response, {
		status: 200,
		headers: {
			"Content-Type": "image/png",
		},
	});
}
