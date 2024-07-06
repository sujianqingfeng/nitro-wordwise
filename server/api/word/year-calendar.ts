export default defineEventHandler(async () => {
	const data = {
		"2024-01-01": {
			count: 44,
		},
	}

	return createBaseResponse(data)
})
