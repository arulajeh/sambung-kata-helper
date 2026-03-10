'use client'

import { useState } from 'react'

interface SearchFormProps {
  initialStart?: string
  initialEnd?: string
}

export default function SearchForm({ initialStart = '', initialEnd = '' }: SearchFormProps) {
  const [start, setStart] = useState(initialStart)
  const [end, setEnd] = useState(initialEnd)

  return (
    <form method="GET" action="/" className="search-form">
      <div className="form-row">
        <label htmlFor="start">Start With:</label>
        <input
          type="text"
          id="start"
          name="start"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          placeholder="e.g. p"
          maxLength={20}
        />
      </div>
      
      <div className="form-row">
        <label htmlFor="end">End With:</label>
        <input
          type="text"
          id="end"
          name="end"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          placeholder="e.g. ng"
          maxLength={20}
        />
      </div>
      
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  )
}
