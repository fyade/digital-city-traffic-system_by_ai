import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from "path";
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import compressPlugin from "vite-plugin-compression";
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Inspect from "vite-plugin-inspect";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { visualizer } from "rollup-plugin-visualizer";
import { adminConfig, dashboardConfig, geoserverConfig } from "@dcts/config";

const root = process.cwd()
// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  const config = adminConfig.currentConfig();
  const dashboardCurrentConfig = dashboardConfig.currentConfig();
  return {
    define: {
      'import.meta.env.MODE': JSON.stringify(mode),
    },
    plugins: [
      Inspect(),
      visualizer(),
      vue(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(root, 'src/assets/icon')],
        symbolId: '[name]'
      }),
      compressPlugin({
        threshold: 1024 * 50 // 大于这个值的压缩
      }),
      AutoImport({
        resolvers: [
          IconsResolver({
            prefix: 'Icon',
          })
        ],
        dts: path.resolve(root, '.d.ts/auto-imports.d.ts')
      }),
      Components({
        resolvers: [
          IconsResolver({
            enabledCollections: ['ep'],
          })
        ],
        dts: path.resolve(root, '.d.ts/components.d.ts')
      }),
      Icons({
        autoInstall: true,
      }),
    ],
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src'),
        '~': path.join(__dirname),
      }
    },
    server: {
      host: '0.0.0.0',
      port: dashboardCurrentConfig.port,
      proxy: {
        [config.VITE_API_PREFIX]: {
          target: config.VITE_BASEURL,
          changeOrigin: true,
          rewrite: path => path.substring(config.VITE_API_PREFIX.length)
        },
        [config.VITE_API_FILE_PREFIX]: {
          target: config.VITE_FILE_BASEURL,
          changeOrigin: true,
          rewrite: path => path.substring(config.VITE_API_FILE_PREFIX.length)
        },
        [geoserverConfig.VITE_API_PREFIX]: {
          target: geoserverConfig.VITE_BASEURL,
          changeOrigin: true,
          rewrite: path => path.substring(geoserverConfig.VITE_API_PREFIX.length)
        }
      }
    },
    build: {
      assetsDir: `./${dashboardConfig.currentVersion}`
    }
  }
})
