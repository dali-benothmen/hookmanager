import { HookFunction } from "./types"
import { HookNotFoundError, HookError } from "./errors"

export interface ParallelHookManager {
    register: <T = any>(name: string, fn: HookFunction<T>) => void
    unregister: (name: string, fn?: HookFunction) => boolean
    has: (name: string) => boolean
    list: () => string[]
    on: <T = any>(name: string, data?: T, parallel?: boolean) => Promise<void>
}

/**
 * Create a hook manager that can run hooks in parallel
 * @returns A hook manager with parallel execution capability
 */
export function createParallelHookManager(): ParallelHookManager {
    const hooks: Map<string, Array<HookFunction>> = new Map()

    return {
        register<T>(name: string, fn: HookFunction<T>): void {
            if (!hooks.has(name)) {
                hooks.set(name, [])
            }

            hooks.get(name)!.push(fn)
        },

        unregister(name: string, fn?: HookFunction): boolean {
            if (!hooks.has(name)) {
                return false
            }

            if (fn) {
                const hooksList = hooks.get(name)!
                const initialLength = hooksList.length
                const newHooks = hooksList.filter((hook) => hook !== fn)
                hooks.set(name, newHooks)

                if (newHooks.length === 0) {
                    hooks.delete(name)
                }

                return initialLength !== newHooks.length
            } else {
                return hooks.delete(name)
            }
        },

        has(name: string): boolean {
            return hooks.has(name) && hooks.get(name)!.length > 0
        },

        list(): string[] {
            return Array.from(hooks.keys())
        },

        async on<T>(
            name: string,
            data?: T,
            parallel: boolean = false
        ): Promise<void> {
            if (!hooks.has(name) || hooks.get(name)!.length === 0) {
                throw new HookNotFoundError(name)
            }

            const hooksList = hooks.get(name)!

            try {
                if (parallel) {
                    await Promise.all(
                        hooksList.map((hook) => Promise.resolve(hook(data)))
                    )
                } else {
                    for (const hook of hooksList) {
                        await Promise.resolve(hook(data))
                    }
                }
            } catch (error) {
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
