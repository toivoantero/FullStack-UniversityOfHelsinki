const Countries = ({ countriesToShow, handleShow, weather }) => {
    return (
        <div>
            {countriesToShow.length === 1 ?
                <div>
                    {countriesToShow.map(c => (
                        <div key={c.name.common}>
                            <h2 style={{ fontSize: '33px' }}>{c.name.common}</h2>
                            <p>Capital: {c.capital}</p>
                            <p>Area: {c.area}</p>
                            <h3>Languages:</h3>
                            <ul>
                                {Object.values(c.languages).map(l => (
                                    <li key={l}>{l}</li>
                                ))}
                            </ul>
                            <img src={c.flags.png} alt={`Flag of ${c.name.common}`} />
                        </div>
                    ))}
                </div>
                : countriesToShow.length <= 10 ?
                    <div>
                        {countriesToShow.map(c => (
                            <p key={c.name.common}>
                                {c.name.common}&nbsp;
                                <button onClick={() => handleShow([c])}>Show</button>
                            </p>

                        ))}
                    </div>
                    :
                    <p>Too many matches, specify another filter</p>}
            <div>
                {weather != null && countriesToShow.length === 1 ?
                    <div>
                        <h3>Weather in {weather.location.name}</h3>
                        <p>Temperature {weather.current.temp_c} celsius"</p>
                        <img src={weather.current.condition.icon}></img>
                        <p>Wind {weather.current.wind_kph} km/h"</p>
                    </div>
                    : ''}
            </div>
        </div>
    )
}

export default Countries
