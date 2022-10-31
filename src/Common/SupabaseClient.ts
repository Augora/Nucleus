import { createClient } from '@supabase/supabase-js'
import { Database } from '../../Types/database.types'

export default createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY + ',dnjsqd'
)
