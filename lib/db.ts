import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/dictionary'

// Create postgres client
const sql = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
})

export interface SearchParams {
  start?: string
  end?: string
}

export interface WordResult {
  word: string
}

export async function searchWords(params: SearchParams): Promise<WordResult[]> {
  const prefix = params.start?.trim().toLowerCase() || ''
  const suffix = params.end?.trim().toLowerCase() || ''

  // If both empty, return empty array (as per spec)
  if (!prefix && !suffix) {
    return []
  }

  const results = await sql<WordResult[]>`
    SELECT word
    FROM dictionary
    WHERE
      (${prefix} = '' OR word LIKE ${prefix} || '%')
    AND
      (${suffix} = '' OR word LIKE '%' || ${suffix})
    ORDER BY random()
    LIMIT 50
  `

  return results
}

export default sql
