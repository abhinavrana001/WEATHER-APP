
function WeatherApp() {
    const [city, setCity] = React.useState("");
    const [temp, setTemp] = React.useState(null);
    const [error, setError] = React.useState("");

    const getWeather = async () => {
        if (!city) {
            setError("Please enter a city name!");
            return;
        }
        setError("");
        setTemp(null);

        try {
            // Step 1: Get city coordinates
            const geoRes = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
            );
            const geoData = await geoRes.json();

            if (!geoData.results || geoData.results.length === 0) {
                setError("City not found!");
                return;
            }

            const { latitude, longitude, name } = geoData.results[0];

            // Step 2: Get weather info
            const weatherRes = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
            );
            const weatherData = await weatherRes.json();

            setTemp({
                name,
                temperature: weatherData.current_weather.temperature,
            });
        } catch {
            setError("Error fetching weather data!");
        }
    };

    return (
        <div className="container">
            <h1> Weather App</h1>
            <div>
                <input
                    type="text"
                    placeholder="Enter city..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <button onClick={getWeather}>Search</button>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {temp && (
                <div className="weather-box">
                    <h2>{temp.name}</h2>
                    <p className="temp">{temp.temperature}°C</p>
                </div>
            )}
        </div>
    );
}

// Render to the screen
ReactDOM.createRoot(document.getElementById("root")).render(<WeatherApp />);
