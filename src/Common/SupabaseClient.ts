import { createClient } from '@supabase/supabase-js'

export default createClient(
  'https://nptlldvxqlpsqftjchty.supabase.co',
  process.env.SUPABASE_KEY
)
