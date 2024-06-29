import { useAuth } from "~/utils/auth"

export default defineEventHandler((e) => {
	const user = useAuth()

	return createBaseResponse({
		id: user.id,
		email: user.email,
		name: user.user_metadata.name,
	})
})
