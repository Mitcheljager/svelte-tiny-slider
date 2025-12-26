import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => ({
	plugins: [sveltekit(), tailwindcss()],
	test: {
		include: ["src/**/*.{test,spec}.{js,ts}"]
	},
	resolve: {
		conditions: mode === "test" ? ["browser"] : []
	}
}));
