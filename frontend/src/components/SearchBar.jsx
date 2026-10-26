export const SearchBar = ({ searchTerm, setSearchTerm, placeholderText }) => {
  return (
    <div className="row g-2 mb-4">
      {/* Búsqueda por texto */}
      <div className="col-12 col-md-4">
        <input
          type="text"
          className="form-control"
          placeholder={placeholderText}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          maxLength={100}
        />
      </div>
    </div>
  );
};