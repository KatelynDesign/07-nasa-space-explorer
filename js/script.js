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
const loadingMessage = document.getElementById('loading-message');
const didYouKnow = document.getElementById('did-you-know');

// List of beginner-friendly space facts
const spaceFacts = [
  "Did you know? The Sun is so big that about 1.3 million Earths could fit inside it!",
  "Did you know? One day on Venus is longer than one year on Venus.",
  "Did you know? Jupiter is the largest planet in our solar system.",
  "Did you know? The footprints left by astronauts on the Moon will last millions of years.",
  "Did you know? Saturn's rings are made mostly of ice and rock.",
  "Did you know? A light-year is the distance light travels in one year—about 6 trillion miles!",
  "Did you know? Mars is called the Red Planet because of its rusty color.",
  "Did you know? There are more stars in the universe than grains of sand on Earth.",
  "Did you know? Neptune has the strongest winds in the solar system.",
  "Did you know? The International Space Station travels around Earth every 90 minutes."
];

// Function to show a random space fact in the loading message
function showRandomSpaceFact() {
  // Pick a random fact from the array
  const randomIndex = Math.floor(Math.random() * spaceFacts.length);
  const fact = spaceFacts[randomIndex];
  // Display the fact in the loading message
  didYouKnow.textContent = fact;
  // Make sure the fact is visible
  didYouKnow.style.display = 'block';
}

// Function to hide the space fact
function hideSpaceFact() {
  didYouKnow.textContent = '';
  didYouKnow.style.display = 'none';
}

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

// This function displays images and videos in the gallery
function displayImages(images) {
  // Clear the gallery
  gallery.innerHTML = '';
  // Loop through each item and add to the gallery
  images.forEach(item => {
    // Create a div for each gallery item
    const itemDiv = document.createElement('div');
    itemDiv.className = 'gallery-item';

    // Check if the item is an image
    if (item.media_type === 'image') {
      // Create an image element
      const img = document.createElement('img');
      img.src = item.url;
      img.alt = item.title;
      // Add a click event to open the modal with image details
      img.addEventListener('click', () => {
        openModal(item);
      });
      itemDiv.appendChild(img);
    }

    // Check if the item is a video
    if (item.media_type === 'video') {
      // Create a placeholder for video (could be an icon or text)
      const videoPlaceholder = document.createElement('div');
      videoPlaceholder.style.width = '340px';
      videoPlaceholder.style.height = '230px';
      videoPlaceholder.style.display = 'flex';
      videoPlaceholder.style.alignItems = 'center';
      videoPlaceholder.style.justifyContent = 'center';
      videoPlaceholder.style.background = '#eee';
      videoPlaceholder.style.borderRadius = '10px';
      videoPlaceholder.style.marginBottom = '8px';

      // Add a play icon (simple emoji for beginners)
      videoPlaceholder.textContent = '▶️';

      itemDiv.appendChild(videoPlaceholder);

      // Create a "Watch Video" link
      const watchLink = document.createElement('a');
      watchLink.href = item.url;
      watchLink.textContent = 'Watch Video';
      watchLink.target = '_blank'; // Open in new tab by default
      watchLink.style.display = 'block';
      watchLink.style.textAlign = 'center';
      watchLink.style.margin = '10px 0';
      watchLink.style.fontWeight = 'bold';
      watchLink.style.color = '#0b3d91';
      watchLink.style.textDecoration = 'underline';
      // Optional: open in modal instead of new tab
      watchLink.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(item);
      });
      itemDiv.appendChild(watchLink);
    }

    // Create a title element
    const title = document.createElement('p');
    title.textContent = item.title;
    title.style.fontWeight = 'bold';
    title.style.margin = '14px 0 10px 0';
    title.style.fontSize = '16px';
    title.style.textAlign = 'center';

    // Create a date element (formatted)
    const date = document.createElement('p');
    date.textContent = formatDateLong(item.date);
    date.className = 'date-label';
    date.style.margin = '0 0 0 0';
    date.style.fontSize = '14px';
    date.style.color = '#666';
    date.style.textAlign = 'center';

    // Add title and date to the div
    itemDiv.appendChild(title);
    itemDiv.appendChild(date);

    // Add the div to the gallery
    gallery.appendChild(itemDiv);
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
function openModal(item) {
  createModal(); // Ensure modal exists

  // Clear previous content except close button
  while (modalContent.childNodes.length > 1) {
    modalContent.removeChild(modalContent.lastChild);
  }

  // If the item is an image, show the image
  if (item.media_type === 'image') {
    const fullImg = document.createElement('img');
    fullImg.src = item.hdurl || item.url;
    fullImg.alt = item.title;
    fullImg.style.maxWidth = '80vw';
    fullImg.style.maxHeight = '60vh';
    fullImg.style.borderRadius = '6px';
    fullImg.style.marginBottom = '18px';
    modalContent.appendChild(fullImg);
  }

  // If the item is a video, embed the video if possible
  if (item.media_type === 'video') {
    // Try to embed YouTube or Vimeo videos
    let embedUrl = '';
    if (item.url.includes('youtube.com') || item.url.includes('youtu.be')) {
      // Convert to embed URL for YouTube
      const videoId = item.url.split('v=')[1] || item.url.split('/').pop();
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (item.url.includes('vimeo.com')) {
      // Convert to embed URL for Vimeo
      const videoId = item.url.split('/').pop();
      embedUrl = `https://player.vimeo.com/video/${videoId}`;
    }

    if (embedUrl) {
      // Create iframe for video
      const iframe = document.createElement('iframe');
      iframe.src = embedUrl;
      iframe.width = '560';
      iframe.height = '315';
      iframe.frameBorder = '0';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.style.maxWidth = '80vw';
      iframe.style.maxHeight = '60vh';
      iframe.style.marginBottom = '18px';
      modalContent.appendChild(iframe);
    } else {
      // If can't embed, show a link
      const videoLink = document.createElement('a');
      videoLink.href = item.url;
      videoLink.textContent = 'Watch Video on NASA';
      videoLink.target = '_blank';
      videoLink.style.fontWeight = 'bold';
      videoLink.style.fontSize = '1.2em';
      videoLink.style.marginBottom = '18px';
      modalContent.appendChild(videoLink);
    }
  }

  // Title
  const title = document.createElement('h2');
  title.textContent = item.title;
  title.style.margin = '0 0 8px 0';
  title.style.fontSize = '1.5em';
  title.style.textAlign = 'center';

  // Date
  const date = document.createElement('p');
  date.textContent = formatDateLong(item.date);
  date.className = 'date-label';
  date.style.margin = '0 0 12px 0';
  date.style.fontWeight = 'bold';
  date.style.textAlign = 'center';

  // Explanation
  const explanation = document.createElement('p');
  explanation.textContent = item.explanation;
  explanation.style.fontSize = '1.15em';
  explanation.style.lineHeight = '1.5';
  explanation.style.margin = '0 0 8px 0';
  explanation.style.textAlign = 'left';

  // Add elements to modal content
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

  // Show loading message and random fact
  loadingMessage.style.display = 'flex';
  showRandomSpaceFact();
  gallery.innerHTML = '';
  placeholder.style.display = 'none';

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
    // Hide loading message and fact after images are shown
    loadingMessage.style.display = 'none';
    hideSpaceFact();
  } catch (error) {
    // Show error message
    gallery.innerHTML = `<p>Could not fetch images. Please try again later.</p>`;
    // Hide loading message and fact if there's an error
    loadingMessage.style.display = 'none';
    hideSpaceFact();
  }
});
