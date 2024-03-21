import React, { useState } from 'react';

type SearchResult = {
  id: string;
  title: string;
  url: string;
  description: string;
  category: 'VIDEOS' | 'PLAYLISTS' | 'BLOG_POSTS';
};

interface SearchFormProps {
}

const SearchForm: React.FC<SearchFormProps> = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showNoResultsFeedback, setShowNoResultsFeedback] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setShowNoResultsFeedback(true)
    fetch(`/api/data?search=${query}`)
      .then(response => response.json())
      .then(data => {
        setResults(data);
        setLoading(false);
      });
  }

  const isButtonDisabled = loading || query.length === 0;

  const categories = {
    "VIDEOS" : {image: "/images/video.svg"},
    "PLAYLISTS" : {image: "/images/playlist.svg"},
    "BLOG_POSTS" : {image: "/images/blog.svg"}
  }
  

  const Results = () => {
    if(results.length > 0){
      return (
        <div className="results">
          {results.map((result, index) => {
            const category = result.category
            return (
              <div key={index} className="result-item">
                <a href={result.url} target="_blank" rel="noreferrer">
                  <div className={`result-content ${category.toLocaleLowerCase()}`}>
                    <div className="category-icon"><img src={categories[category].image} alt={result.category} title={result.category} /></div>
                      <div>
                        <h3>{result.title}</h3>
                        <p>{result.description}</p>
                      </div>
                  </div>
                </a>
              </div>
            )
          })}
        </div>
      )      
    }else if(showNoResultsFeedback){
      return(
        <div className="no-results">There are no results matching your query</div>
      )
    }

    return <></>
  }

  return (
    <>
      <div className="search-form">
        <form onSubmit={handleSubmit}>
          <div className="search-action">
            <input type="text" placeholder="I'm looking for..." value={query} onChange={(event) => setQuery(event.target.value)} />
            <button type="submit" disabled={isButtonDisabled}>Search</button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <Results />
      )}
    </>
  );
}

export default SearchForm;