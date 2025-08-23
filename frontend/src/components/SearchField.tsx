import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '@styles/components-styles/SearchField.css';

export default function SearchField() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="searchTextFieldContainer">
      <form style={{width:"fit-content", display:'flex', justifyContent:'center'}} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search"
          className="searchTextField"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
    </div>
  );
}
