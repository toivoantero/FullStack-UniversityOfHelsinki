import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Countries from './components/Countries'
import axios from 'axios'

const App = () => {
  const [searchWord, setSearchWord] = useState(true)
  const [countries, setCountries] = useState([])
  const [countriesToShow, setCountriesToShow] = useState([])
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (searchWord) {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then(response => {
          setCountries(response.data)
        })
    }
  }, [searchWord])

  useEffect(() => {
    if (countriesToShow.length === 1) {
      axios
        .get(`http://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_WEATHER_API_KEY}&q=${countriesToShow[0].capital}`)
        .then(response => {
          setWeather(response.data)
        })
    }
  }, [countriesToShow])

  const handleSearch = (event) => {
    const newSearchWord = event.target.value
    const updatedCountries = countries.filter(c =>
      c.name.common.toLowerCase().includes(newSearchWord.toLowerCase())
    )
    if (newSearchWord == "") {
      setCountriesToShow([])
    } else {
      setCountriesToShow(updatedCountries)
    }
    setSearchWord(newSearchWord)
  }

  const handleShow = country => {
    setCountriesToShow(country)
  }

  return (
    <div>
      <Filter handleSearch={handleSearch} />
      <Countries countriesToShow={countriesToShow} handleShow={handleShow} weather={weather} />
    </div>
  )
}

export default App