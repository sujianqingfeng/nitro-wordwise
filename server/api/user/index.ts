import { useAuth } from "~/composables/auth"

export default defineEventHandler(() => {
	const { id, email, user_metadata } = useAuth()

	return createBaseResponse({
		id,
		email,
		name: user_metadata.name,
		avatar: user_metadata.avatar_url,
	})
})
