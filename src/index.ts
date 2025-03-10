export { createHookManager } from "./core"
export { createScopedHookManager } from "./scopedHooks"
export { createPriorityHookManager, PriorityHookManager } from "./priorityHooks"
export { createParallelHookManager, ParallelHookManager } from "./parallelHooks"

export { HookManager, HookFunction } from "./types"

export { HookError, HookNotFoundError, DuplicateHookError } from "./errors"

import { createHookManager } from "./core"
import { createScopedHookManager } from "./scopedHooks"
import { createPriorityHookManager } from "./priorityHooks"
import { createParallelHookManager } from "./parallelHooks"
import { HookError, HookNotFoundError, DuplicateHookError } from "./errors"

export default {
    createHookManager,
    createScopedHookManager,
    createPriorityHookManager,
    createParallelHookManager,
    HookError,
    HookNotFoundError,
    DuplicateHookError,
}
