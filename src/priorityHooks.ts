import { HookFunction } from "./types"
import { HookNotFoundError, HookError } from "./errors"

export interface PriorityHookManager {
    register: <T = any>(
        name: string,
        fn: HookFunction<T>,
        priority?: number
    ) => void
    unregister: (name: string, fn?: HookFunction) => boolean
    has: (name: string) => boolean
    list: () => string[]
    on: <T = any>(name: string, data?: T) => Promise<void>
}

/**
 * Create a priority-based hook manager
 * @returns A hook manager with priority-based execution
 */
export function createPriorityHookManager(): PriorityHookManager {
    const hooks: Map<
        string,
        Array<{ priority: number; fn: HookFunction }>
    > = new Map()

    return {
        register<T>(
            name: string,
            fn: HookFunction<T>,
            priority: number = 10
        ): void {
            if (!hooks.has(name)) {
                hooks.set(name, [])
            }

            const hooksList = hooks.get(name)!
            hooksList.push({ priority, fn })

            // Sort hooks by priority (higher numbers execute first)
            hooksList.sort((a, b) => b.priority - a.priority)
        },

        unregister(name: string, fn?: HookFunction): boolean {
            if (!hooks.has(name)) {
                return false
            }

            if (fn) {
                const hooksList = hooks.get(name)!
                const initialLength = hooksList.length
                const newHooks = hooksList.filter((hook) => hook.fn !== fn)
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

        async on<T>(name: string, data?: T): Promise<void> {
            if (!hooks.has(name) || hooks.get(name)!.length === 0) {
                throw new HookNotFoundError(name)
            }

            const hooksList = hooks.get(name)!

            try {
                for (const hook of hooksList) {
                    await Promise.resolve(hook.fn(data))
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
