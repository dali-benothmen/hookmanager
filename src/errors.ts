export class HookError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "HookError"
    }
}

export class HookNotFoundError extends HookError {
    constructor(hookName: string) {
        super(`Hook "${hookName}" is not registered`)
        this.name = "HookNotFoundError"
    }
}

export class DuplicateHookError extends HookError {
    constructor(hookName: string) {
        super(`Hook "${hookName}" is already registered`)
        this.name = "DuplicateHookError"
    }
}
