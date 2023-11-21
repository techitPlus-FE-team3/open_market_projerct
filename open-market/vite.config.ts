import * as path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgrPlugin from "vite-plugin-svgr";
import viteImagemin from "@vheemstra/vite-plugin-imagemin";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminWebp from "imagemin-webp";

export default defineConfig({
	plugins: [
		react(),
		svgrPlugin(),
		viteImagemin({
			plugins: {
				jpg: imageminMozjpeg(),
			},
			makeWebp: {
				plugins: {
					jpg: imageminWebp(),
				},
			},
		}),
	],
	server: {
		port: 3000,
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
