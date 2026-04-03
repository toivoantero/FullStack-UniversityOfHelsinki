const Filter = ({handleSearch}) => {
  
  return (
    <div>
      filter shown with
      <input
        onChange={handleSearch}>
      </input>
    </div>
  )
}

export default Filter