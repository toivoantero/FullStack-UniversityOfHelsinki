const Persons = ({ personsToShow, handleDelete }) => {
  return (
    <div>
      {personsToShow.map(person => (
        <p key={person.id}>
          {person.name}: {person.number}&nbsp;
          <button onClick={() => handleDelete(person.id)}>delete</button>
        </p>
      ))}
    </div>
  )
}

export default Persons
