// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Get references to DOM elements
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const getImagesButton = document.querySelector('.filters button');
const gallery = document.getElementById('gallery');

// NASA APOD API key and endpoint
const API_KEY = 'mIOWblhfqMda7RckAdDlE8PiTg9El8fXSRKqKlEh';
const API_URL = 'https://api.nasa.gov/planetary/apod';

// This function fetches APOD data for a date range
async function fetchAPODImages(startDate, endDate) {
  // Build the API URL with start_date and end_date
  const url = `${API_URL}?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;
  // Fetch data from NASA API
  const response = await fetch(url);
  // Parse the JSON data
  const data = await response.json();
  return data;
}

// This function displays images in the gallery
function displayImages(images) {
  // Clear the gallery
  gallery.innerHTML = '';
  // Loop through each image and add to the gallery
  images.forEach(image => {
    // Only show images (not videos)
    if (image.media_type === 'image') {
      // Create a div for each image
      const imgDiv = document.createElement('div');
      imgDiv.className = 'gallery-item'; // Use the correct class for CSS grid
      // Create an image element
      const img = document.createElement('img');
      img.src = image.url;
      img.alt = image.title;
      // Create a caption
      const caption = document.createElement('p');
      caption.textContent = `${image.title} (${image.date})`;
      // Add image and caption to the div
      imgDiv.appendChild(img);
      imgDiv.appendChild(caption);
      // Add the div to the gallery
      gallery.appendChild(imgDiv);
    }
  });
}

// This function handles the button click
getImagesButton.addEventListener('click', async () => {
  // Get the selected start and end dates
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;

  // Check if both dates are selected
  if (!startDate || !endDate) {
    alert('Please select both start and end dates.');
    return;
  }

  // Calculate the 9-day range starting from startDate
  const start = new Date(startDate);
  const dates = [];
  for (let i = 0; i < 9; i++) {
    // Add each date in YYYY-MM-DD format
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    // Stop if date is after endDate
    if (date > new Date(endDate)) break;
    dates.push(date.toISOString().slice(0, 10));
  }

  // If no dates to fetch, show a message
  if (dates.length === 0) {
    alert('No dates in range.');
    return;
  }

  // Fetch images for the date range
  try {
    // If only one date, fetch single image
    let images;
    if (dates.length === 1) {
      images = [await fetchAPODImages(dates[0], dates[0])];
    } else {
      images = await fetchAPODImages(dates[0], dates[dates.length - 1]);
    }
    // Display the images
    displayImages(images);
  } catch (error) {
    // Show error message
    gallery.innerHTML = `<p>Could not fetch images. Please try again later.</p>`;
  }
});
