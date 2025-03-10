import { HookManager, HookFunction, HookMap } from "./types"
import { HookNotFoundError, DuplicateHookError, HookError } from "./errors"

/**
 * Create a new HookManager instance
 * @returns A new HookManager instance
 */
export function createHookManager(): HookManager {
    const hooks: HookMap = new Map()

    return {
        register<T>(name: string, fn: HookFunction<T>): void {
            if (hooks.has(name)) {
                throw new DuplicateHookError(name)
            }
            hooks.set(name, fn)
        },

        unregister(name: string): boolean {
            return hooks.delete(name)
        },

        has(name: string): boolean {
            return hooks.has(name)
        },

        list(): string[] {
            return Array.from(hooks.keys())
        },

        async on<T>(name: string, data?: T): Promise<void> {
            const hook = hooks.get(name)

            if (!hook) {
                throw new HookNotFoundError(name)
            }

            try {
                // Handle both sync and async hook functions
                await Promise.resolve(hook(data))
            } catch (error) {
                // Re-throw the error with additional context
                if (error instanceof Error) {
                    throw new HookError(
                        `Error in hook "${name}": ${error.message}`
                    )
                } else {
                    throw new HookError(`Unknown error in hook "${name}"`)
                }
            }
        },
    }
}
