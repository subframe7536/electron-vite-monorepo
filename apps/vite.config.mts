import { rmSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron'
import uno from 'unocss/vite'
import solid from 'vite-plugin-solid'
import Route from '@generouted/solid-router/plugin'
import solidDevtools from 'solid-devtools/vite'
import pkg from './package.json'

export default defineConfig(({ command }) => {
  rmSync('dist-electron', { recursive: true, force: true })

  const isServe = command === 'serve'
  const isBuild = command === 'build'
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG

  return {
    plugins: [
      solid(),
      uno({
        configFile: '../uno.config.ts',
      }),
      Route(),
      solidDevtools(),
      electron([
        {
          entry: [
            './electron/main/index.ts',
            './electron/main/worker.ts',
          ],
          onstart(options) {
            if (process.env.VSCODE_DEBUG) {
              console.log(/* For `.vscode/.debug.script.mjs` */'[startup] Electron App')
            } else {
              options.startup()
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: false,
              reportCompressedSize: false,
              outDir: './dist-electron/main',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
                treeshake: true,
              },
            },
          },
        },
        {
          entry: './electron/preload/index.ts',
          onstart(options) {
            options.reload()
          },
          vite: {
            build: {
              reportCompressedSize: false,
              sourcemap: sourcemap ? 'inline' : undefined, // #332
              minify: isBuild,
              outDir: './dist-electron/preload',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              },
            },
          },
        },
      ]),
    ],
    resolve: {
      alias: {
        '@': join(__dirname, 'src'),
      },
    },
    server: process.env.VSCODE_DEBUG
      ? (() => {
          const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL)
          return {
            host: url.hostname,
            port: +url.port,
          }
        })()
      : undefined,
    optimizeDeps: {
      exclude: ['@generouted/solid-router', '@solid/router'],
    },
    clearScreen: false,
  }
})
