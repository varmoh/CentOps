import 'dotenv/config';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import checker from 'vite-plugin-checker';
import VitePluginSvgSpritemap from '@spiriit/vite-plugin-svg-spritemap';
import * as path from 'path';
import * as fs from 'node:fs';
import chokidar, { type FSWatcher } from 'chokidar';
import menu from './menu.json';

const iconsDir = 'src/icons';

// https://vite.dev/config/
export default defineConfig({
  base: process.env.REACT_APP_BASE ?? '/',
  server: {
    port: 8057,
    host: '0.0.0.0',
    allowedHosts: process.env.ALLOWED_HOSTS === 'true',
  },
  plugins: [
    react(),
    checker({
      typescript: true,
    }),
    tsconfigPaths(),
    VitePluginSvgSpritemap(`${iconsDir}/*.svg`, {
      prefix: false,
      injectSvgOnDev: true,
      svgo: {
        plugins: [
          {
            name: 'convertColors',
            params: {
              currentColor: true,
            },
          },
        ],
      },
    }),
    iconsJsonList(),
  ],
  define: {
    'process.env': {},
    'import.meta.env.REACT_APP_BASE': JSON.stringify(
      process.env.REACT_APP_BASE
    ),
    'import.meta.env.REACT_APP_SERVICE_ID': JSON.stringify(
      process.env.REACT_APP_SERVICE_ID
    ),
    'import.meta.env.REACT_APP_API_URL': JSON.stringify(
      process.env.REACT_APP_API_URL
    ),
    'import.meta.env.REACT_APP_PUBLIC_URL': JSON.stringify(
      process.env.REACT_APP_PUBLIC_URL
    ),
    'import.meta.env.REACT_APP_MENU_JSON': JSON.stringify(JSON.stringify(menu)),
    'import.meta.env.REACT_APP_PROJECT_LAYER': JSON.stringify(
      process.env.REACT_APP_PROJECT_LAYER
    ),
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '',
        loadPaths: [path.resolve(__dirname, 'src'), 'node_modules'],
      },
    },
  },
  optimizeDeps: {
    include: ['@fontsource/roboto'],
  },
  resolve: {
    alias: {
      // Create alias for @fontsource to resolve font files correctly
      '~@fontsource': path.resolve(__dirname, 'node_modules/@fontsource'),
    },
  },

  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name?.split('.').at(1);
          if (extType && /woff|woff2|eot|ttf/.test(extType)) {
            return 'assets/fonts/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
});

function iconsJsonList() {
  const absoluteInputPath = path.resolve(process.cwd(), iconsDir);
  const absoluteOutputPath = path.resolve(
    process.cwd(),
    `${iconsDir}/index.json`
  );
  let watcher: FSWatcher;

  function generateJson(filename?: string) {
    if (filename && path.extname(filename) !== '.svg') return;

    if (!fs.existsSync(absoluteInputPath)) return;

    const svgFiles = fs
      .readdirSync(absoluteInputPath)
      .filter((file) => file.endsWith('.svg'));

    fs.writeFileSync(
      absoluteOutputPath,
      JSON.stringify(
        svgFiles.reduce(
          (acc, filename) => ({
            ...acc,
            [path.basename(filename, '.svg')]: filename,
          }),
          {}
        ),
        null,
        2
      ) + '\n',
      'utf-8'
    );
    console.log(
      `[vite-plugin-scan-svg] JSON updated: ${svgFiles.length} icons`
    );
  }

  return {
    name: 'icons-dir-to-json',
    apply: 'serve',
    configureServer() {
      watcher = chokidar.watch(absoluteInputPath, {
        ignoreInitial: true,
        depth: 0,
      });
      watcher.on('ready', () => {
        watcher
          .on('add', generateJson)
          .on('unlink', generateJson)
          .on('change', generateJson);
      });
    },
    closeBundle() {
      if (watcher) {
        watcher.close();
      }
    },
    buildStart() {
      generateJson();
    },
  } as const;
}
