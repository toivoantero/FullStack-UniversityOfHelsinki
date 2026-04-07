const Filter = ({handleSearch}) => {
  
  return (
    <div>
      find countries&nbsp;
      <input
        onChange={handleSearch}>
      </input>
    </div>
  )
}

export default Filter