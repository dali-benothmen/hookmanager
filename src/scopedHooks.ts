import { HookManager, HookFunction } from "./types"
import { createHookManager } from "./core"

/**
 * Create a scoped hook manager with a prefix
 * @param prefix The prefix to add to all hook names
 * @returns A new HookManager instance with scoped hooks
 */
export function createScopedHookManager(prefix: string): HookManager {
    const manager = createHookManager()

    return {
        register<T>(name: string, fn: HookFunction<T>): void {
            manager.register(`${prefix}:${name}`, fn)
        },

        unregister(name: string): boolean {
            return manager.unregister(`${prefix}:${name}`)
        },

        has(name: string): boolean {
            return manager.has(`${prefix}:${name}`)
        },

        list(): string[] {
            return manager
                .list()
                .filter((name) => name.startsWith(`${prefix}:`))
                .map((name) => name.substring(prefix.length + 1))
        },

        on<T>(name: string, data?: T): Promise<void> {
            return manager.on(`${prefix}:${name}`, data)
        },
    }
}
