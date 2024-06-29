export default defineEventHandler((e) => {
	const { pathname } = getRequestURL(e)
	const status = getResponseStatus(e)
	console.log(status, pathname)
})
