import db, { schema } from "~/lib/drizzle"
import { useAuth } from "./auth"
import { eq } from "drizzle-orm"

export async function useProfile() {
	const { id } = useAuth()

	const profile = await db.query.profiles.findFirst({
		where: eq(schema.profiles.userId, id),
	})

	if (profile) {
		return profile
	}

	const newProfile = await db
		.insert(schema.profiles)
		.values({
			userId: id,
		})
		.returning()

	return newProfile[0]
}
