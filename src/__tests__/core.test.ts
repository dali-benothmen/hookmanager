import { createHookManager } from "../core"
import { HookNotFoundError, DuplicateHookError } from "../errors"

describe("createHookManager", () => {
    it("should register and trigger hooks correctly", async () => {
        const hooks = createHookManager()
        const mockFn = jest.fn()

        hooks.register("test", mockFn)
        await hooks.on("test")

        expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it("should pass data to hooks", async () => {
        const hooks = createHookManager()
        const mockFn = jest.fn()
        const testData = { foo: "bar" }

        hooks.register("test", mockFn)
        await hooks.on("test", testData)

        expect(mockFn).toHaveBeenCalledWith(testData)
    })

    it("should throw when triggering non-existent hook", async () => {
        const hooks = createHookManager()

        await expect(hooks.on("nonExistent")).rejects.toThrow(HookNotFoundError)
    })

    it("should throw when registering duplicate hook", () => {
        const hooks = createHookManager()

        hooks.register("test", () => {})

        expect(() => {
            hooks.register("test", () => {})
        }).toThrow(DuplicateHookError)
    })

    it("should handle async hooks", async () => {
        const hooks = createHookManager()
        let value = 0

        hooks.register("test", async () => {
            await new Promise((resolve) => setTimeout(resolve, 10))
            value = 42
        })

        await hooks.on("test")

        expect(value).toBe(42)
    })

    it("should list registered hooks", () => {
        const hooks = createHookManager()

        hooks.register("hook1", () => {})
        hooks.register("hook2", () => {})

        expect(hooks.list()).toEqual(["hook1", "hook2"])
    })

    it("should check if hook exists", () => {
        const hooks = createHookManager()

        hooks.register("hook1", () => {})

        expect(hooks.has("hook1")).toBe(true)
        expect(hooks.has("hook2")).toBe(false)
    })

    it("should unregister hooks", () => {
        const hooks = createHookManager()

        hooks.register("hook1", () => {})
        expect(hooks.has("hook1")).toBe(true)

        hooks.unregister("hook1")
        expect(hooks.has("hook1")).toBe(false)
    })
})
