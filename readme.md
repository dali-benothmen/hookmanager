# HookHive

Effortlessly manage and execute lifecycle hooks in your JavaScript and TypeScript applications.

[![npm version](https://img.shields.io/npm/v/hookhive.svg)](https://www.npmjs.com/package/hookhive)
[![license](https://img.shields.io/npm/l/hookhive.svg)](https://github.com/egoist/tsup/blob/main/LICENSE)

## 📘 Description

`HookHive` is a lightweight and flexible utility for creating, managing, and executing hooks in your projects. Whether you need to run callbacks during specific events, implement plugin-like systems, or manage side effects, `HookHive` makes it easy to set up and orchestrate hooks with minimal overhead.

Perfect for libraries, frameworks, or even standalone projects that need extensibility and modular logic!

## 🚀 Features

-   **Dynamic Hook Registration:** Easily add, remove, and list hooks at runtime.
-   **Sync & Async Support:** Handle both synchronous and asynchronous hooks effortlessly.
-   **Execution Control:** Choose whether to run hooks in series or parallel.
-   **Scoped Hooks:** Create isolated hook managers for different parts of your app.
-   **Priority-Based Execution:** Set hook priorities to control execution order.
-   **Error Handling:** Catch and handle errors within hooks without crashing your app.

## 🔧 Installation

```bash
npm install hookhive
```

or with yarn:

```bash
yarn add hookhive
```

## 📚 Basic Usage

```typescript
import { createHookManager } from "hookhive"

// Create a new hook manager
const hooks = createHookManager()

// Register hooks
hooks.register("start", () => {
    console.log("App is starting...")
})

hooks.register("startFetchingUserData", async () => {
    await new Promise((res) => setTimeout(res, 1000))
    console.log("Async startup task completed.")
})

hooks.register("finishFetching", () => {
    console.log("App has finished.")
})

// Trigger hooks
hooks.on("start")
hooks.on("startFetchingUserData").then(() => {
    console.log("All start hooks executed!")
    hooks.on("finishFetching")
})

// Output:
// App is starting...
// Async startup task completed.
// All start hooks executed!
// App has finished.
```

## 🛠️ Advanced Usage

### Unregistering Hooks

```typescript
// Register a hook
hooks.register("start", () => console.log("Start hook"))

// Unregister the hook
hooks.unregister("start")

// This will throw a HookNotFoundError
try {
    hooks.on("start")
} catch (error) {
    console.error(error.message) // "Hook "start" is not registered"
}
```

### Passing Data to Hooks

```typescript
// Register a hook that expects data
hooks.register("saveUserData", (userData) => {
    console.log(`Saving user data for ${userData.name}`)
    // saveUserData(userData);
})

// Trigger the hook with data
hooks.on("saveUserData", { name: "John", age: 25 })
```

### Creating Reusable Hooks

**logger.js**

```typescript
export const createLoggerHook = (message) => {
    return () => console.log(`[LOG]: ${message}`)
}
```

**validate.js**

```typescript
import Joi from "joi"

export const createValidationHook = (schema) => {
    return (data) => {
        const result = schema.validate(data)
        if (result.error) {
            console.error("Validation failed:", result.error.details)
        }
        return result
    }
}
```

**app.js**

```typescript
import { createHookManager } from "hookhive"
import { createLoggerHook } from "./logger.js"
import { createValidationHook } from "./validate.js"
import Joi from "joi"

const hooks = createHookManager()

// Reusable hooks
const logStart = createLoggerHook("App started")
const validateUser = createValidationHook(
    Joi.object({ name: Joi.string().required(), age: Joi.number().min(18) })
)

// Register reusable hooks
hooks.register("start", logStart)
hooks.register("userSignup", validateUser)

// Trigger hooks
hooks.on("start")
hooks.on("userSignup", { name: "Alice", age: 25 })
hooks.on("userSignup", { name: "", age: 15 }) // Fails validation
```

## 🧩 Advanced Features

### Scoped Hook Manager

Create isolated hook managers with prefixed hook names:

```typescript
import { createScopedHookManager } from "hookhive"

// Create a scoped hook manager for user-related hooks
const userHooks = createScopedHookManager("user")

// Register hooks - internally these will be prefixed with "user:"
userHooks.register("login", (userData) => {
    console.log(`User ${userData.username} logged in`)
})

userHooks.register("logout", (userData) => {
    console.log(`User ${userData.username} logged out`)
})

// Trigger hooks
userHooks.on("login", { username: "alice" })
// Internally triggers "user:login"

// List hooks - prefixes are removed in the result
console.log(userHooks.list()) // ['login', 'logout']
```

### Priority-Based Hook Manager

Control the execution order of multiple hooks for the same event:

```typescript
import { createPriorityHookManager } from "hookhive"

const hooks = createPriorityHookManager()

// Register hooks with different priorities
hooks.register("init", () => console.log("Low priority task"), 5)
hooks.register("init", () => console.log("High priority task"), 20)
hooks.register("init", () => console.log("Medium priority task"), 10)

// Trigger hooks - they'll execute in order of priority (high to low)
hooks.on("init")

// Output:
// High priority task
// Medium priority task
// Low priority task
```

### Parallel Hook Manager

Run hooks concurrently for better performance:

```typescript
import { createParallelHookManager } from "hookhive"

const hooks = createParallelHookManager()

// Register multiple hooks
hooks.register("fetchData", async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Fetched user data")
})

hooks.register("fetchData", async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log("Fetched product data")
})

hooks.register("fetchData", async () => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    console.log("Fetched settings data")
})

// Sequential execution (default) - takes about 3.3 seconds
console.log("Starting sequential execution...")
await hooks.on("fetchData")
console.log("Sequential execution complete")

// Parallel execution - takes about 1.5 seconds
console.log("Starting parallel execution...")
await hooks.on("fetchData", undefined, true)
console.log("Parallel execution complete")
```

## 🔍 API Reference

### Core Functions

#### `createHookManager()`

Creates a basic hook manager.

```typescript
const hooks = createHookManager()
```

#### `createScopedHookManager(prefix: string)`

Creates a hook manager with scoped hook names.

```typescript
const userHooks = createScopedHookManager("user")
```

#### `createPriorityHookManager()`

Creates a hook manager that executes hooks based on priority.

```typescript
const hooks = createPriorityHookManager()
```

#### `createParallelHookManager()`

Creates a hook manager that can execute hooks in parallel.

```typescript
const hooks = createParallelHookManager()
```

### Hook Manager Methods

#### `register<T>(name: string, fn: HookFunction<T>, priority?: number): void`

Registers a new hook. The `priority` parameter is only available with `createPriorityHookManager`.

```typescript
hooks.register("eventName", (data) => {
    /* hook implementation */
})
```

#### `unregister(name: string, fn?: HookFunction): boolean`

Unregisters a hook. Returns `true` if successful, `false` if the hook wasn't registered.

```typescript
hooks.unregister("eventName")
```

#### `has(name: string): boolean`

Checks if a hook is registered.

```typescript
if (hooks.has("eventName")) {
    // Hook exists
}
```

#### `list(): string[]`

Lists all registered hooks.

```typescript
const hookNames = hooks.list()
```

#### `on<T>(name: string, data?: T, parallel?: boolean): Promise<void>`

Triggers a hook. The `parallel` parameter is only available with `createParallelHookManager`.

```typescript
await hooks.on("eventName", {
    /* optional data */
})
```

### Error Types

#### `HookError`

Base error class for all hook-related errors.

#### `HookNotFoundError`

Thrown when trying to trigger a hook that isn't registered.

#### `DuplicateHookError`

Thrown when trying to register a hook with a name that's already taken.

## 🧪 Error Handling

```typescript
import { HookNotFoundError, DuplicateHookError } from "hookhive"

try {
    // Try to trigger a non-existent hook
    await hooks.on("nonExistentHook")
} catch (error) {
    if (error instanceof HookNotFoundError) {
        console.error("Hook not found:", error.message)
    } else {
        console.error("Unexpected error:", error)
    }
}

try {
    // Try to register the same hook twice
    hooks.register("start", () => console.log("First handler"))
    hooks.register("start", () => console.log("Second handler"))
} catch (error) {
    if (error instanceof DuplicateHookError) {
        console.error("Duplicate hook:", error.message)
    } else {
        console.error("Unexpected error:", error)
    }
}
```

## 📋 TypeScript Support

HookManager is written in TypeScript and provides full type definitions:

```typescript
import { createHookManager, HookFunction } from "hookhive"

// Define a type for your hook data
interface UserData {
    id: string
    name: string
    age: number
}

// Create a hook manager
const hooks = createHookManager()

// Register a typed hook
hooks.register<UserData>("userCreated", (user) => {
    // 'user' is typed as UserData
    console.log(`User ${user.name} created with ID ${user.id}`)
})

// Trigger the hook with type-checked data
hooks.on<UserData>("userCreated", {
    id: "123",
    name: "Alice",
    age: 30,
})
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
