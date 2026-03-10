import { WordResult } from '@/lib/db'

interface ResultsListProps {
  results: WordResult[]
  count: number
}

export default function ResultsList({ results, count }: ResultsListProps) {
  if (count === 0) {
    return (
      <div className="results-section">
        <p className="no-results">No results found. Try different search terms.</p>
      </div>
    )
  }

  return (
    <div className="results-section">
      <p className="results-count">Found {count} words:</p>
      <ul className="results-list">
        {results.map((item, index) => (
          <li key={index}>{item.word}</li>
        ))}
      </ul>
    </div>
  )
}
