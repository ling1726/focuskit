import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  target: [
    "chrome84",
    "edge84",
    "firefox75",
    "safari14.1",
  ],
  format: ["esm", "cjs"],
  external: ['react', '@focuskit/vanilla'],
})