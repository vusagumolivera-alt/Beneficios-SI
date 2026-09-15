import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const SUPABASE_URL = 'https://bcyrcyugumzfqbdlosyt.supabase.co'
const SUPABASE_KEY = process.env.SUPA_KEY

if (!SUPABASE_KEY) {
  console.error('Falta la clave. Corré: SUPA_KEY=tu_clave node scripts/upload-logos.mjs')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
const LOGOS_DIR = '/tmp/logos_para_subir'
const files = readdirSync(LOGOS_DIR)

console.log(`Subiendo ${files.length} logos...`)

for (const file of files) {
  const filePath = join(LOGOS_DIR, file)
  const content = readFileSync(filePath)
  const mimeType = file.endsWith('.jpg') ? 'image/jpeg' : 'image/png'
  const { error } = await supabase.storage
    .from('logos')
    .upload(file, content, { contentType: mimeType, upsert: true })
  if (error) console.error(`✗ ${file}: ${error.message}`)
  else console.log(`✓ ${file}`)
}
console.log('Listo.')
