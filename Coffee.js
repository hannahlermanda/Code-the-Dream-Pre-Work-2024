let hotCoffees = []; //Array to hold hot coffee data
let icedCoffees = []; //Array to hold iced coffee data

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

function translateIngredients(ingredients) {
    return ingredients.map(ingredient => ingredientTranslations[ingredient] || ingredient).join(', ');
}

//Fetch coffee data from the API
function fetchCoffees() {
    Promise.all([
        fetch('https://api.sampleapis.com/coffee/hot'),
        fetch('https://api.sampleapis.com/coffee/iced')
    ])
    .then(responses => Promise.all(responses.map(res => res.json())))
    .then(data => {
        hotCoffees = data[0]; // Hot coffee data
        icedCoffees = data[1]; // Iced coffee data
        console.log('Hot Coffees:', hotCoffees);
        console.log('Iced Coffees:', icedCoffees);
    })
    .catch(error => console.error('Error fetching coffees:', error));
}

//Show coffee name, image, and ingredients
function displayCoffee(coffee) {
    document.getElementById('coffee-name').innerText = coffee.title; //Coffee name
    document.getElementById('coffee-image').src = coffee.image; //Coffee image
    document.getElementById('coffee-ingredients').innerText = `Ingredients: ${translateIngredients(coffee.ingredients)}`; //Coffee ingredients translated from Swedish
}

//Fetch weather data based on location
function fetchWeather(selectedLocation) {
    const [latitude, longitude] = selectedLocation.split(',');

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,is_day&temperature_unit=fahrenheit&timezone=auto&forecast_days=1`)
        .then(response => response.json())
        .then(data => {
            const temperature = data.current.temperature_2m; //Get current temperature
            const apparentTemperature = data.current.apparent_temperature; //Get apparent temperature
            const isDay = data.current.is_day; // True if it's daytime
            displayWeather(temperature, apparentTemperature, isDay);
            recommendCoffee(temperature); // Call recommendCoffee function (recommends coffee based on temperature)
        })
        .catch(error => console.error('Error:', error));
}

//Recommend coffee based on temperature
function recommendCoffee(temperature) {
    if (temperature > 75) {
        const randomIndex = Math.floor(Math.random() * icedCoffees.length);
        displayCoffee(icedCoffees[randomIndex]); //Random iced coffee if temperature is above 75°F
    } else {
        const randomIndex = Math.floor(Math.random() * hotCoffees.length);
        displayCoffee(hotCoffees[randomIndex]); //Random hot coffee if temperature is 75°F or below
    }
}

//Display the weather
function displayWeather(temperature, apparentTemperature, isDay) {
    const dayNightStatus = isDay ? 'Daytime' : 'Nighttime';
    document.getElementById('weather-info').innerText = `Current Temperature: ${temperature}°F (Feels like: ${apparentTemperature}°F, ${dayNightStatus})`;
}

// Event listener for the recommendation button
document.getElementById('recommend-button').addEventListener('click', () => {
    const selectedLocation = document.getElementById('location-select').value;
    fetchWeather(selectedLocation);
});

// Initial fetch to load coffee data
fetchCoffees();
