//Array to hold hot coffee data
let hotCoffees = [];
//Array to hold iced coffee data
let icedCoffees = [];

//Swedish to English ingredient translation
const ingredientTranslations = {
    "Mjölk": "Milk",
    "Kaffe": "Coffee",
    "coffee": "Coffee",
    "Socker": "Sugar",
    "Socker*": "Sugar",
    "Sugar*": "Sugar",
    "Grädde": "Cream",
    "Cream*": "Cream",
    "Choklad ": "Chocolate",
    "Choklad": "Chocolate",
    "Vanilj": "Vanilla",
    "Kanel": "Cinnamon",
    "Citronsaft": "Lemon juice",
    "Is": "Ice",
    "Rum": "Rum",
    "Rum*": "Rum",
    "Kardemumma": "Cardamom",
    "Karamellsås": "Caramel sauce",
    "Te": "Tea",
    "Karamellsirap": "Caramel syrup",
    "Foam": "Foam",
    "Ångad mjölk": "Steamed milk", 
    "Sirap": "Syrup",
    "Hett vatten": "Hot water",
    "Ingefära": "Ginger",
    "Matcha-pulver": "Matcha powder",
    "Kolsyrat vatten": "Sparkling water",
    "Honung": "Honey",
    "Färska Apelsiner": "Fresh oranges",
    "Vispgrädde*": "Whipped cream",
    "Vispgrädde": "Whipped cream",
    "Whip*": "Whipped cream"
};
 //Translate from Swedish to English function
function translateIngredients(ingredients) {
    return ingredients.map(ingredient => ingredientTranslations[ingredient] || ingredient).join(', ');
}

// Fetch coffee data from the API
function fetchCoffees() {
    Promise.all([
        fetch('https://api.sampleapis.com/coffee/hot'),
        fetch('https://api.sampleapis.com/coffee/iced')
    ])
    .then(responses => Promise.all(responses.map(res => res.json())))
    .then(data => {
        // Hot coffee data
        hotCoffees = data[0]; 
        // Iced coffee data
        icedCoffees = data[1];
        console.log('Hot Coffees:', hotCoffees);
        console.log('Iced Coffees:', icedCoffees);
    })
    .catch(error => console.error('Error fetching coffees:', error));
}

// Show coffee name, image, and ingredients
function displayCoffee(coffee) {
     // Coffee name
    document.getElementById('coffee-name').innerText = coffee.title;
     // Coffee image
    document.getElementById('coffee-image').src = coffee.image;
    // Coffee ingredients translated from Swedish
    document.getElementById('coffee-ingredients').innerText = `Ingredients: ${translateIngredients(coffee.ingredients)}`; 
}

// Fetch weather data based on location
function fetchWeather(selectedLocation) {
    const [latitude, longitude] = selectedLocation.split(',');

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,is_day&temperature_unit=fahrenheit&timezone=auto&forecast_days=1`)
        .then(response => response.json())
        .then(data => {
            // Get current temperature
            const temperature = data.current.temperature_2m; 
            // Get apparent temperature
            const apparentTemperature = data.current.apparent_temperature;
            // True if it's daytime
            const isDay = data.current.is_day;
            displayWeather(temperature, apparentTemperature, isDay);
            // Call recommendCoffee function (recommends coffee based on temperature)
            recommendCoffee(temperature);
        })
        .catch(error => console.error('Error:', error));
}

// Recommend coffee based on temperature
function recommendCoffee(temperature) {
    if (temperature > 75) {
        const randomIndex = Math.floor(Math.random() * icedCoffees.length);
        // Random iced coffee if temperature is above 75°F
        displayCoffee(icedCoffees[randomIndex]); 
    } else {
        const randomIndex = Math.floor(Math.random() * hotCoffees.length);
        // Random hot coffee if temperature is 75°F or below
        displayCoffee(hotCoffees[randomIndex]); 
    }
}

// Display the weather
function displayWeather(temperature, apparentTemperature, isDay) {
    const dayNightStatus = isDay ? 'Daytime' : 'Nighttime';
    document.getElementById('weather-info').innerText = `Current Temperature: ${temperature}°F (Feels like: ${apparentTemperature}°F, ${dayNightStatus})`;
}

// Show the result screen and hide the welcome screen
function showResultScreen() {
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';
}

// Show the welcome screen and hide the result screen
function goBackToWelcomeScreen() {
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('welcome-screen').style.display = 'block';
}

// Event listener for the "Give me my drink!" button
document.getElementById('recommend-button').addEventListener('click', () => {
    const selectedLocation = document.getElementById('location-select').value;
    fetchWeather(selectedLocation);
    showResultScreen();
});

// Event listener for the "Go Back" button
document.getElementById('go-back-button').addEventListener('click', goBackToWelcomeScreen);

// Initial fetch to load coffee data
fetchCoffees();