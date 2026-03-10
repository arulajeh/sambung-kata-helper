import { searchWords } from '@/lib/db'
import SearchForm from '@/components/SearchForm'
import ResultsList from '@/components/ResultsList'

interface HomePageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const start = typeof searchParams.start === 'string' ? searchParams.start : ''
  const end = typeof searchParams.end === 'string' ? searchParams.end : ''

  // Only search if at least one parameter is provided
  const hasSearch = start || end
  const results = hasSearch ? await searchWords({ start, end }) : []

  return (
    <div className="container">
      <header>
        <h1>Sambung Kata Helper</h1>
        <p className="subtitle">Cari kata untuk permainan sambung kata</p>
      </header>

      <main>
        <SearchForm initialStart={start} initialEnd={end} />
        
        {hasSearch && <ResultsList results={results} count={results.length} />}
      </main>

      <footer>
        <p>Simple tool for Indonesian word-chain games</p>
      </footer>
    </div>
  )
}
