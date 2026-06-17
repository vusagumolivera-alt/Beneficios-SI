import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const supabase = createClient(
  'https://bcyrcyugumzfqbdlosyt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjeXJjeXVndW16ZnFiZGxvc3l0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTE4MDQ4MiwiZXhwIjoyMDk2NzU2NDgyfQ.dU1PKNJar2MU6cQ3T_BCJ_yFC1EbowjeLTPXtrdMhMA'
)

const LOGOS_DIR = '/Users/juanolivera/Desktop/logos comercios '

const BASE_URL = 'https://bcyrcyugumzfqbdlosyt.supabase.co/storage/v1/object/public/logos'

async function main() {
  const { error: bucketError } = await supabase.storage.createBucket('logos', { public: true })
  if (bucketError && !bucketError.message.includes('already exists')) {
    console.error('Bucket error:', bucketError.message)
  } else {
    console.log('Bucket listo')
  }

  const files = readdirSync(LOGOS_DIR).filter(f => f.endsWith('.png'))

  for (const file of files) {
    const data = readFileSync(join(LOGOS_DIR, file))
    const name = file.replace(/ /g, '-').toLowerCase()
    const { error } = await supabase.storage.from('logos').upload(name, data, {
      contentType: 'image/png',
      upsert: true,
    })
    if (error) {
      console.error(`❌ ${file}: ${error.message}`)
    } else {
      console.log(`✅ ${name}  →  ${BASE_URL}/${name}`)
    }
  }
  console.log('\nListo!')
}

main()
