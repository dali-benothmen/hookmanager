import { defineConfig } from "tsup"

export default defineConfig({
    entry: ["src/**/*.ts", "!src/__tests__/**"],
    format: ["cjs", "esm"],
    dts: true,
})
