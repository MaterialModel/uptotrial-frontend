/* eslint-disable import/no-extraneous-dependencies */
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import type { PluginOption } from 'vite';
import { defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';
import type { VitePWAOptions } from 'vite-plugin-pwa';
import { VitePWA } from 'vite-plugin-pwa';
import tsConfigPaths from 'vite-tsconfig-paths';

const pwaOptions: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
  manifest: {
    short_name: 'UpToTrial',
    name: 'Vite React App Template',
    lang: 'en',
    start_url: '/',
    background_color: '#FFFFFF',
    theme_color: '#FFFFFF',
    dir: 'ltr',
    display: 'standalone',
    prefer_related_applications: false,
    icons: [
      {
        src: '/assets/uptotrial.svg',
        purpose: 'any',
        sizes: '48x48 72x72 96x96 128x128 256x256',
      },
    ],
  },
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  // Function to get the value from process.env or fallback to loaded env
  const getEnvVariable = (key: string): string | undefined => {
    if (process.env[key] !== undefined) {
      return process.env[key];
    }
    if (env[key] !== undefined) {
      return env[key];
    }
    return undefined;
  };

  const apiUrl = getEnvVariable('VITE_API_URL');
  console.info(`Using API URL: ${apiUrl}`);

  // Ensure that the VITE_API_URL is available in process.env
  process.env.VITE_API_URL = apiUrl;

  return {
    plugins: [
      reactRouter(),
      tailwindcss(),
      checker({
        typescript: true,
        biome: true,
      }),
      tsConfigPaths(),
      visualizer({ template: 'sunburst' }) as unknown as PluginOption,
      VitePWA(pwaOptions),
    ],
    define: {
      'process.env.VITE_API_URL': JSON.stringify(apiUrl),
    },
    ssr: {
      noExternal: ['react-helmet-async', '@theme-toggles/react'], // temporary
    },
    server: {
      open: true,
    },
  };
});
