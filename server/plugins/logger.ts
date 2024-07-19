export default defineNitroPlugin((nitroApp) => {
	nitroApp.hooks.hook("error", async (error, { event }) => {
		console.error(`${event?.method} ${event?.path} ${error.name} `)
	})

	nitroApp.hooks.hook("beforeResponse", (e) => {
		const status = e.node.res.statusCode
		console.log(`${e.method} ${e.path} ${status} `)
	})
})
