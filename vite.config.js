import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";
import path from 'path';
import svgr from "vite-plugin-svgr";
export default defineConfig({

	plugins: [react(), svgr()],
	resolve: {

		alias: {
			components: path.resolve(__dirname, 'src/components'),
			assets: path.resolve(__dirname, 'src/assets'),
			recoilStore: path.resolve(__dirname, 'src/recoilStore'),
			config: path.resolve(__dirname, 'src/config.jsx'),
			routes: path.resolve(__dirname, 'src/routes.jsx'),
			routes_user: path.resolve(__dirname, 'src/routes_user.jsx'),
			LoadingScreenNDL: path.resolve(__dirname, 'src/LoadingScreenNDL'),
			TailwindTheme: path.resolve(__dirname, 'src/TailwindTheme.jsx'),
			Hooks: path.resolve(__dirname, 'src/Hooks')

		}

	}

});
