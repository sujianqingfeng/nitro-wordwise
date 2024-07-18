export function createBaseResponse(data: string | object | null = null) {
	return {
		data,
	}
}

export function createPaginationResponse(data: {
	data: any[]
	page: number
	pageSize: number
	total: number
	totalPage: number
}) {
	return createBaseResponse(data)
}
