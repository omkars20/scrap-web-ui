// QueryForm.js

// components/QueryForm.js
import React, { useState } from 'react';

const QueryForm = ({ onSubmit }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query);
      setQuery(''); // Clear input after submission
    }
  };

  return (
    <form onSubmit={handleSubmit} className="text-center mt-5">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your query (e.g., restaurants near Mumbai)"
        className="border p-2 w-1/2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 ml-2">
        Search
      </button>
    </form>
  );
};

export default QueryForm;






