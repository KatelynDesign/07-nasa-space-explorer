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
const placeholder = document.querySelector('.placeholder');

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

// Helper function to format date as "Month Dayth, Year"
function formatDateLong(dateString) {
  // Create a new Date object from the string
  const date = new Date(dateString);
  // Array of month names
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  // Get day with ordinal suffix (st, nd, rd, th)
  const day = date.getDate();
  let suffix = 'th';
  if (day % 10 === 1 && day !== 11) suffix = 'st';
  else if (day % 10 === 2 && day !== 12) suffix = 'nd';
  else if (day % 10 === 3 && day !== 13) suffix = 'rd';
  // Format: Month Dayth, Year
  return `${months[date.getMonth()]} ${day}${suffix}, ${date.getFullYear()}`;
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
      imgDiv.className = 'gallery-item';
      // Create an image element
      const img = document.createElement('img');
      img.src = image.url;
      img.alt = image.title;
      // Add a click event to open the modal with image details
      img.addEventListener('click', () => {
        openModal(image);
      });
      // Create a title element
      const title = document.createElement('p');
      title.textContent = image.title;
      title.style.fontWeight = 'bold';
      title.style.margin = '14px 0 10px 0'; // Add more space below the title
      title.style.fontSize = '16px';
      title.style.textAlign = 'center';
      // Create a date element (formatted)
      const date = document.createElement('p');
      date.textContent = formatDateLong(image.date);
      date.className = 'date-label'; // Add class for DM Mono font
      date.style.margin = '0 0 0 0';
      date.style.fontSize = '14px';
      date.style.color = '#666';
      date.style.textAlign = 'center';
      // Add image, title, and date to the div
      imgDiv.appendChild(img);
      imgDiv.appendChild(title);
      imgDiv.appendChild(date);
      // Add the div to the gallery
      gallery.appendChild(imgDiv);
    }
  });
}

// --- Modal code ---

// Create modal elements (only once)
let modal, modalContent, modalClose;
function createModal() {
  // Only create modal if it doesn't exist
  if (document.getElementById('imageModal')) return;
  // Create modal background
  modal = document.createElement('div');
  modal.id = 'imageModal';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100vw';
  modal.style.height = '100vh';
  modal.style.background = 'rgba(0,0,0,0.8)';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.zIndex = '1000';
  modal.style.visibility = 'hidden';

  // Modal content box
  modalContent = document.createElement('div');
  modalContent.style.background = '#fff';
  modalContent.style.borderRadius = '8px';
  modalContent.style.padding = '24px';
  modalContent.style.maxWidth = '90vw';
  modalContent.style.maxHeight = '90vh';
  modalContent.style.overflowY = 'auto';
  modalContent.style.boxShadow = '0 4px 24px rgba(0,0,0,0.2)';
  modalContent.style.position = 'relative';
  modalContent.style.display = 'flex';
  modalContent.style.flexDirection = 'column';
  modalContent.style.alignItems = 'center';

  // Close button
  modalClose = document.createElement('span');
  modalClose.textContent = '✖';
  modalClose.style.position = 'absolute';
  modalClose.style.top = '12px';
  modalClose.style.right = '18px';
  modalClose.style.fontSize = '28px';
  modalClose.style.cursor = 'pointer';
  modalClose.style.color = '#333';
  modalClose.title = 'Close';

  // Close modal on click
  modalClose.addEventListener('click', closeModal);
  // Close modal when clicking outside content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  modalContent.appendChild(modalClose);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}

// Function to open modal with image details
function openModal(image) {
  createModal(); // Ensure modal exists

  // Clear previous content except close button
  while (modalContent.childNodes.length > 1) {
    modalContent.removeChild(modalContent.lastChild);
  }

  // Full-size image
  const fullImg = document.createElement('img');
  fullImg.src = image.hdurl || image.url;
  fullImg.alt = image.title;
  fullImg.style.maxWidth = '80vw';
  fullImg.style.maxHeight = '60vh';
  fullImg.style.borderRadius = '6px';
  fullImg.style.marginBottom = '18px';

  // Title
  const title = document.createElement('h2');
  title.textContent = image.title;
  title.style.margin = '0 0 8px 0';
  title.style.fontSize = '1.5em';
  title.style.textAlign = 'center';

  // Date
  const date = document.createElement('p');
  date.textContent = formatDateLong(image.date);
  date.className = 'date-label'; // Use DM Mono for modal date
  date.style.margin = '0 0 12px 0';
  date.style.fontWeight = 'bold';
  date.style.textAlign = 'center';

  // Explanation
  const explanation = document.createElement('p');
  explanation.textContent = image.explanation;
  // No need to set font here; CSS uses Public Sans for modal explanation
  explanation.style.fontSize = '1.15em';
  explanation.style.lineHeight = '1.5';
  explanation.style.margin = '0 0 8px 0';
  explanation.style.textAlign = 'left';

  // Add elements to modal content
  modalContent.appendChild(fullImg);
  modalContent.appendChild(title);
  modalContent.appendChild(date);
  modalContent.appendChild(explanation);

  // Show modal
  modal.style.visibility = 'visible';
}

// Function to close modal
function closeModal() {
  if (modal) {
    modal.style.visibility = 'hidden';
  }
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
    // Hide the placeholder
    placeholder.style.display = 'none';
  } catch (error) {
    // Show error message
    gallery.innerHTML = `<p>Could not fetch images. Please try again later.</p>`;
  }
});
