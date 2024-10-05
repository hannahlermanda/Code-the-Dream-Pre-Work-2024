let breeds = []; // Array to hold the fetched breed
let currentBreedIndex = 0; // Index to track the current breed

// Fetch data from The Dog API
fetch('https://api.thedogapi.com/v1/breeds', {
    headers: {
        'x-api-key': 'real api' 
    }
})
.then(response => response.json())
.then(data => {
    breeds = data; //Store the breeds in the array
    showBreed(); //Show breed
})
.catch(error => {
    console.error('Error fetching data from The Dog API:', error);
});

//Display the current breed
function showBreed() {
    const breedNameElement = document.getElementById('breed-name');
    const breedImageElement = document.getElementById('breed-image');

    // Get the current breed data
    const breed = breeds[currentBreedIndex];

    // Update the name and image in the HTML page
    breedNameElement.textContent = breed.name;
    breedImageElement.src = breed.image.url;
    breedImageElement.alt = breed.name; // Set the alt text for accessibility
}

// Add event listener to the "Next" button
const nextButton = document.getElementById('next-button');
nextButton.addEventListener('click', () => {
    // Increment the breed index, looping back to the beginning if necessary
    currentBreedIndex = (currentBreedIndex + 1) % breeds.length;

    // Show the next breed
    showBreed();
});
