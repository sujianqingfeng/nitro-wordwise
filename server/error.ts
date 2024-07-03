export default defineNitroErrorHandler((error: Error, event: any) => {
	setResponseHeader(event, "Content-Type", "application/json")
	const data = JSON.stringify({
		status: 500,
		message: error.message,
	})
	return send(event, data)
})
