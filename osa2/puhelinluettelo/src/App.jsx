import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [personsToShow, setPersonsToShow] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
        setPersonsToShow(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    if (persons.map(p => p.name).includes(personObject.name)) {
      if (persons.map(p => p.number).includes(personObject.number)) {
        alert(`${personObject.name} is already added to phonebook`)
        return
      }
      if (confirm(personObject.name + " is already added to phonebook, replace the old number with a new one?")) {
        const person = persons.find(p => p.name === personObject.name)
        const changedPerson = { ...person, number: newNumber }

        personService
          .update(changedPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== changedPerson.id ? p : returnedPerson))
            setPersonsToShow(persons.map(p => p.id !== changedPerson.id ? p : returnedPerson))
            setNotificationMessage({
              content: `${personObject.name} phone number changed`,
              type: 'success'
            })
            setTimeout(() => {
              setNotificationMessage(null)
            }, 4000)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setNotificationMessage({
              content: `Information of ${personObject.name} has already been removed from server`,
              type: 'error'
            })
            setTimeout(() => {
              setNotificationMessage(null)
            }, 4000)
            setPersons(persons.filter(p => p.id !== changedPerson.id))
            setPersonsToShow(persons.filter(p => p.id !== changedPerson.id))
          })
      }
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setPersonsToShow(persons.concat(returnedPerson))
          setNotificationMessage({
            content: `Added ${personObject.name}`,
            type: 'success'
          })
          setTimeout(() => {
            setNotificationMessage(null)
          }, 4000)
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const handleDelete = (id) => {
    if (confirm("Delete " + persons.find(p => p.id === id).name + "?")) {
      const deletedPerson = persons.find(p => p.id === id).name
      personService.remove(id)
      setPersons(persons.filter(p => p.id !== id))
      setPersonsToShow(persons.filter(p => p.id !== id))
      setNotificationMessage({
        content: `Deleted ${deletedPerson}`,
        type: 'success'
      })
      setTimeout(() => {
        setNotificationMessage(null)
      }, 4000)
    } else {
      return
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
    const searchWord = event.target.value
    const updatedPersons = persons.filter(person =>
      person.name.toLowerCase().includes(searchWord.toLowerCase())
    )
    setPersonsToShow(updatedPersons)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} />
      <Filter handleSearch={handleSearch} />
      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App