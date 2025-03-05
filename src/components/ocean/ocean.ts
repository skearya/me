import REGL from "regl";
import frag from "./frag.glsl?raw";
import vert from "./vert.glsl?raw";

export function oceanScript() {
	const oceanComponent = document.getElementById("ocean-component")!;
	const settingsToggle = document.getElementById("settings-toggle")!;
	const settingsContent = document.getElementById("settings-content")!;
	const settings =
		document.querySelectorAll<HTMLInputElement>("input.setting")!;
	const fishContainer = document.getElementById("fish-container")!;

	const lockedHeight = oceanComponent.dataset.lockedHeight === "true";

	const regl = REGL("#waves-container");

	let scrollY = -400;

	const drawWaves = regl<
		{
			iTime: number;
			iResolution: REGL.Vec2;
			scrollPos: number;
			scrollHeight: number;
		},
		{},
		{
			time: number;
		}
	>({
		vert,
		frag,
		attributes: {
			position: regl.buffer([
				[1, 1],
				[-1, 1],
				[-1, -1],
				[-1, -1],
				[1, -1],
				[1, 1],
			]),
		},
		uniforms: {
			iTime: (_context, props) => props.time / 1000,
			iResolution: (context) => [
				context.drawingBufferWidth,
				context.drawingBufferHeight,
			],
			scrollPos: () =>
				(scrollY = lerp(
					scrollY,
					lockedHeight ? oceanComponent.scrollTop : window.scrollY,
					0.1,
				)),
			scrollHeight: oceanComponent.scrollHeight,
		},
		count: 6,
	});

	const colors = {
		white: "#FFFFFF",
		blue: "#497EE9",
		cyan: "#5CD8E6",
		pink: "#D56CC3",
	};

	let fish: {
		opacity: number;
		ltr: boolean;
		speed: number;
		x: number;
		y: number;
		ref: HTMLSpanElement;
	}[] = [];

	let requestAnimationFrameId: number | undefined = undefined;
	let lastTime = performance.now();
	let interval = performance.now();
	let pausedTime = 0;
	let fishSpawned = 0;

	let spawnTime = 1000;
	let disableRtl = false;
	let variableSpeed = true;
	let crashBrowserProbably = false;

	settingsToggle.addEventListener("click", () => {
		settingsContent.classList.toggle("hidden");
	});

	settings.forEach((setting) => {
		setting.addEventListener("change", () => {
			const name = setting.getAttribute("name")!;

			switch (name) {
				case "spawn rate":
					spawnTime = parseInt(setting.value);
					break;
				case "ltr only":
					disableRtl = Boolean(setting.checked);
					break;
				case "variable speed":
					variableSpeed = Boolean(setting.checked);
					break;
				case "crash browser":
					if (Boolean(setting.checked)) {
						if (window.confirm("are you sure you want this")) {
							crashBrowserProbably = true;
						} else {
							setting.checked = false;
						}
					} else {
						crashBrowserProbably = false;
					}
					break;
			}
		});
	});

	requestAnimationFrameId = requestAnimationFrame(animate);

	function spawnFish(scrollHeight: number) {
		const span = document.createElement("span");

		const random = Math.random();
		let ltr = disableRtl ? true : Math.random() < 0.5;

		if (random < 0.7) {
			span.textContent = ltr ? "><>" : "<><";
			span.style.color =
				fishSpawned % 10 == 0 ? colors.pink : colors.white;

			fishSpawned += 1;
		} else if (random < 0.85) {
			span.textContent = "~";
			span.style.color = colors.blue;
			ltr = true;
		} else {
			span.textContent = "ᵒ";
			span.style.color = colors.cyan;
			ltr = true;
		}

		const x = ltr ? 0 : window.innerWidth;
		const y = randomIntFromInterval(10, scrollHeight - 10);

		Object.assign(span.style, {
			position: "absolute",
			top: `${y}px`,
			left: "0px",
			whiteSpace: "nowrap",
			opacity: "0%",
			pointerEvents: "none",
			fontSize: `${randomIntFromInterval(12, 32)}px`,
			transform: `translateX(${x}px)`,
		});

		fish.push({
			ltr,
			opacity: 0,
			speed: Math.random(),
			x,
			y,
			ref: span,
		});

		fishContainer.appendChild(span);

		interval = performance.now();
	}

	function animate(time: number) {
		time -= pausedTime;

		// regl (waves)
		regl.poll();

		regl.clear({
			color: [0, 0, 0, 0],
			depth: 1,
		});

		drawWaves({ time });

		regl._gl.flush();

		// dom translations (fish)
		const scrollHeight = oceanComponent.scrollHeight;

		if ((time - interval) / spawnTime > 1) {
			spawnFish(scrollHeight);
		}

		if (crashBrowserProbably) {
			for (let i = 0; i < 1000; i++) {
				spawnFish(scrollHeight);
			}
		}

		const elapsed = time - lastTime;
		const windowWidth = window.innerWidth;

		fish = fish.filter((f) => {
			if (f.x < -10 || f.x > windowWidth || f.y > scrollHeight) {
				f.ref.remove();
				return false;
			} else {
				return true;
			}
		});

		for (const f of fish) {
			f.x +=
				0.1 +
				(elapsed / 10) *
					(variableSpeed ? f.speed : 1) *
					(f.ltr ? 1 : -1);

			f.ref.style.transform = `translateX(${f.x}px)`;

			f.opacity = f.opacity + (elapsed / windowWidth) * 100;

			if (f.opacity < 100) {
				f.ref.style.opacity = `${f.opacity}%`;
			}
		}

		lastTime = time;
		requestAnimationFrameId = requestAnimationFrame(animate);
	}

	return {
		stop: () => {
			if (requestAnimationFrameId === undefined) {
				return;
			}

			cancelAnimationFrame(requestAnimationFrameId);
			requestAnimationFrameId = undefined;
		},
		resume: () => {
			if (requestAnimationFrameId !== undefined) {
				return;
			}

			pausedTime = performance.now() - lastTime;
			requestAnimationFrameId = requestAnimationFrame(animate);
		},
	};
}

function randomIntFromInterval(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function lerp(start: number, end: number, amount: number) {
	return (1 - amount) * start + amount * end;
}
