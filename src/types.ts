export type HookFunction<T = any> = (data?: T) => void | Promise<void>
export type HookMap = Map<string, HookFunction>

export interface HookManager {
    /**
     * Register a new hook
     * @param name The name of the hook
     * @param fn The function to execute when the hook is triggered
     * @throws {DuplicateHookError} If a hook with the same name is already registered
     */
    register<T = any>(name: string, fn: HookFunction<T>): void

    /**
     * Unregister a hook
     * @param name The name of the hook to unregister
     * @returns True if the hook was unregistered, false if it wasn't registered
     */
    unregister(name: string): boolean

    /**
     * Check if a hook is registered
     * @param name The name of the hook to check
     * @returns True if the hook is registered, false otherwise
     */
    has(name: string): boolean

    /**
     * List all registered hooks
     * @returns An array of hook names
     */
    list(): string[]

    /**
     * Trigger a hook
     * @param name The name of the hook to trigger
     * @param data Optional data to pass to the hook function
     * @throws {HookNotFoundError} If the hook is not registered
     * @returns Promise that resolves when the hook execution is complete
     */
    on<T = any>(name: string, data?: T): Promise<void>
}
