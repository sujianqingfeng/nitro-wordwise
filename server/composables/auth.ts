import type { User } from "@supabase/supabase-js"

export function useAuth() {
	const e = useEvent()

	const user = e.context.user

	if (!user) {
		throw createError("No authorization header")
	}

	return user as User
}
