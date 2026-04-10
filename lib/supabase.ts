import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://soohdpwdrozxsjcmbptv.supabase.co'
const supabaseKey = 'sb_publishable_UMsKHT3BizHizC-sG2fiDA_XeoNN3SE'

export const supabase = createClient(supabaseUrl, supabaseKey)