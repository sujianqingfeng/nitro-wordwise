import logger from "~/utils/logger"

export default defineEventHandler((e) => {
	const { pathname } = getRequestURL(e)
	const status = getResponseStatus(e)
	logger.info(`${e.method} ${pathname} ${status} `)
})
