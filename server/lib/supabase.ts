import { createClient } from "@supabase/supabase-js"

const URL = process.env.NITRO_SUPABASE_URL
const KEY = process.env.NITRO_SUPABASE_KEY

const supabase = createClient(URL, KEY)

export default supabase
