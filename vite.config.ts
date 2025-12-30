import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

function createAlias(aliasList: Record<string, string>) {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(aliasList)) {
    result[key] = fileURLToPath(new URL(value, import.meta.url))
  }
  return result
}

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'TencentCloudSDK',
      fileName: (format) => `tencent-cloud-sdk.${format === 'es' ? 'es' : 'cjs'}.js`,
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['crypto', 'node:crypto'],
      output: {
        globals: {}
      }
    }
  },
  resolve: {
    alias: {
      ...createAlias({
        "#src": "./src",
      })
    },
  }
})
