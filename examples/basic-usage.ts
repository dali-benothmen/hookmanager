import { createHookManager } from "../src"

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
async function runExample() {
    await hooks.on("start")
    await hooks.on("startFetchingUserData")
    console.log("All start hooks executed!")
    await hooks.on("finishFetching")
}

runExample().catch(console.error)
