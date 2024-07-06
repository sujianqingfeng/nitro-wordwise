export default defineEventHandler((e) => {
	const { pathname } = getRequestURL(e)
	const status = getResponseStatus(e)
	console.info(`${e.method} ${pathname} ${status} `)
})
