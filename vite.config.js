import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'node:process'

function buildVersionPlugin(build) {
  return {
    name: 'build-version',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: `${JSON.stringify(build)}\n`,
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(() => {
  const builtAt = new Date().toISOString()
  const version = process.env.VITE_APP_VERSION || `local-${builtAt}`
  const build = { version, builtAt }

  return {
    plugins: [react(), buildVersionPlugin(build)],
    define: {
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(version),
      'import.meta.env.VITE_APP_BUILD_TIME': JSON.stringify(builtAt),
    },
    server: {
      port: 5173,
      strictPort: true,
    },
  }
})
