async function getWeather() {
  const locationInput = document.getElementById("location");
  const weatherDisplay = document.querySelector(".weather-display");
  const loading = document.querySelector(".loading");
  const error = document.querySelector(".error");

  // Reset displays
  weatherDisplay.classList.remove("active");
  error.classList.remove("active");
  loading.classList.add("active");

  try {
    // Assuming your backend endpoint is at /api/weather
    const response = await fetch(
      `/api/weather?location=${encodeURIComponent(locationInput.value)}`
    );

    if (!response.ok) {
      throw new Error("Weather data not available");
    }

    const weatherData = await response.text();

    // Display the weather data
    weatherDisplay.textContent = weatherData;
    weatherDisplay.classList.add("active");
  } catch (err) {
    error.classList.add("active");
  } finally {
    loading.classList.remove("active");
  }
}

// Allow form submission with Enter key
document.getElementById("location").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    getWeather();
  }
});
