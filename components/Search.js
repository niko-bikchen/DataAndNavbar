const Search = () => {
  return (
    <div className="search__search-container">
      <input
        className="search__search-input"
        type="text"
        name="search-query"
        title="Search query input"
        placeholder='Search ("/" for hotkey)'
      />
      <i className="fas fa-search search__search-icon"></i>
    </div>
  );
};
