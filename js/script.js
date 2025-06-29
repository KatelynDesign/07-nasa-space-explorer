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

    // --- Shared media container for both image and video ---
    let mediaDiv;
    if (item.media_type === 'image') {
      // Create a div for media
      mediaDiv = document.createElement('div');
      mediaDiv.className = 'gallery-media';
      // Create an image element
      const img = document.createElement('img');
      img.src = item.url;
      img.alt = item.title;
      img.style.cursor = 'pointer';
      // Add a click event to open the modal with image details
      img.addEventListener('click', () => {
        openModal(item);
      });
      // Also open modal if user clicks anywhere on the card
      itemDiv.addEventListener('click', (e) => {
        // Only trigger if not clicking a link (for video)
        if (e.target.tagName !== 'A') openModal(item);
      });
      mediaDiv.appendChild(img);
      itemDiv.appendChild(mediaDiv);
    }

    if (item.media_type === 'video') {
      // Create a div for media
      mediaDiv = document.createElement('div');
      mediaDiv.className = 'nasa-video-card';
      // Add a NASA worm logo watermark (bottom right)
      const logo = document.createElement('img');
      logo.src = 'img/nasa-worm-logo.png';
      logo.alt = 'NASA Logo';
      logo.style.position = 'absolute';
      logo.style.bottom = '8px';
      logo.style.right = '8px';
      logo.style.width = '36px';
      logo.style.opacity = '0.85';
      mediaDiv.appendChild(logo);
      // Add a play icon using SVG (white triangle, NASA style)
      const playIcon = document.createElement('div');
      playIcon.innerHTML = `
        <svg width="64" height="64" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="32" fill="var(--nasa-red)" />
          <polygon points="26,20 48,32 26,44" fill="var(--nasa-white)"/>
        </svg>
      `;
      playIcon.style.zIndex = '2';
      playIcon.style.position = 'relative';
      mediaDiv.appendChild(playIcon);
      itemDiv.appendChild(mediaDiv);

      // Also open modal if user clicks anywhere on the card except the link
      itemDiv.addEventListener('click', (e) => {
        if (e.target.tagName !== 'A') openModal(item);
      });
    }

    // --- Card Title (same for both) ---
    const title = document.createElement('div');
    title.className = 'card-title';
    title.textContent = item.title;
    itemDiv.appendChild(title);

    // --- Card Date (same for both) ---
    const date = document.createElement('div');
    date.className = 'card-date';
    date.textContent = formatDateLong(item.date);
    itemDiv.appendChild(date);

    // --- Video link for video cards only ---
    if (item.media_type === 'video') {
      const watchLink = document.createElement('a');
      watchLink.href = item.url;
      watchLink.textContent = 'Watch Video';
      watchLink.target = '_blank';
      watchLink.className = 'card-link';
      // Optional: open in modal instead of new tab
      watchLink.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(item);
      });
      itemDiv.appendChild(watchLink);
    }

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
  modalContent.style.borderRadius = '14px';
  modalContent.style.padding = '32px 24px 28px 24px';
  modalContent.style.maxWidth = '95vw';
  modalContent.style.maxHeight = '90vh';
  modalContent.style.overflowY = 'auto';
  modalContent.style.boxShadow = '0 4px 24px rgba(11,61,145,0.18)';
  modalContent.style.position = 'relative';
  modalContent.style.display = 'flex';
  modalContent.style.flexDirection = 'column';
  modalContent.style.alignItems = 'center';

  // Close button
  modalClose = document.createElement('span');
  modalClose.textContent = '✖';
  modalClose.style.position = 'absolute';
  modalClose.style.top = '16px';
  modalClose.style.right = '24px';
  modalClose.style.fontSize = '2em';
  modalClose.style.cursor = 'pointer';
  modalClose.style.color = 'var(--nasa-red)';
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

  // Show a larger image or video
  if (item.media_type === 'image') {
    const fullImg = document.createElement('img');
    fullImg.src = item.hdurl || item.url;
    fullImg.alt = item.title;
    fullImg.style.maxWidth = '90vw';
    fullImg.style.maxHeight = '60vh';
    fullImg.style.borderRadius = '10px';
    fullImg.style.marginBottom = '22px';
    modalContent.appendChild(fullImg);
  }

  if (item.media_type === 'video') {
    // Try to embed YouTube or Vimeo videos
    let embedUrl = '';
    if (item.url.includes('youtube.com') || item.url.includes('youtu.be')) {
      const videoId = item.url.split('v=')[1] || item.url.split('/').pop();
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (item.url.includes('vimeo.com')) {
      const videoId = item.url.split('/').pop();
      embedUrl = `https://player.vimeo.com/video/${videoId}`;
    }
    if (embedUrl) {
      const iframe = document.createElement('iframe');
      iframe.src = embedUrl;
      iframe.width = '560';
      iframe.height = '315';
      iframe.frameBorder = '0';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.style.maxWidth = '90vw';
      iframe.style.maxHeight = '60vh';
      iframe.style.marginBottom = '22px';
      modalContent.appendChild(iframe);
    } else {
      const videoLink = document.createElement('a');
      videoLink.href = item.url;
      videoLink.textContent = 'Watch Video on NASA';
      videoLink.target = '_blank';
      videoLink.style.fontWeight = 'bold';
      videoLink.style.fontSize = '1.2em';
      videoLink.style.marginBottom = '22px';
      modalContent.appendChild(videoLink);
    }
  }

  // Title (full)
  const title = document.createElement('h2');
  title.textContent = item.title;
  title.style.margin = '0 0 12px 0';
  title.style.fontSize = '1.6em';
  title.style.textAlign = 'center';
  title.style.fontFamily = "'Inter', Helvetica, Arial, sans-serif";
  title.style.color = 'var(--nasa-dark-blue)';
  modalContent.appendChild(title);

  // Date
  const date = document.createElement('p');
  date.textContent = formatDateLong(item.date);
  date.className = 'date-label';
  date.style.margin = '0 0 18px 0';
  date.style.fontWeight = 'bold';
  date.style.textAlign = 'center';
  date.style.fontFamily = "'DM Mono', 'Courier New', monospace";
  date.style.color = 'var(--nasa-gold)';
  modalContent.appendChild(date);

  // NASA Explanation
  const explanation = document.createElement('p');
  explanation.textContent = item.explanation;
  explanation.style.fontSize = '1.13em';
  explanation.style.lineHeight = '1.5';
  explanation.style.margin = '0 0 8px 0';
  explanation.style.textAlign = 'left';
  explanation.style.color = 'var(--nasa-gray-700)';
  explanation.style.fontFamily = "'Public Sans', Arial, sans-serif";
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

  // Change loading text to a clever, space-themed message
  const loadingTextSpan = loadingMessage.querySelector('span:nth-child(2)');
  if (loadingTextSpan) {
    loadingTextSpan.textContent = 'Transmitting cosmic images from NASA...';
  }

  // Insert NASA red bar accent under loading text if not already present
  const loadingDiv = loadingMessage.querySelector('div');
  if (loadingDiv && !loadingDiv.querySelector('.nasa-red-bar')) {
    const redBar = document.createElement('span');
    redBar.className = 'nasa-red-bar';
    loadingDiv.appendChild(redBar);
  }

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
    // Add a slightly longer delay (2.2 seconds) so the user can read the loading message and fact
    setTimeout(() => {
      // Display the images
      displayImages(images);
      // Hide the placeholder
      placeholder.style.display = 'none';
      // Hide loading message and fact after images are shown
      loadingMessage.style.display = 'none';
      hideSpaceFact();
    }, 2200); // 2.2 seconds delay
  } catch (error) {
    // Show error message
    gallery.innerHTML = `<p>Could not fetch images. Please try again later.</p>`;
    // Hide loading message and fact if there's an error
    loadingMessage.style.display = 'none';
    hideSpaceFact();
  }
});

// NASA Hero Banner Starfield Animation
// This code creates a simple animated starfield in the hero section
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = 260;
  const stars = [];
  const STAR_COUNT = 80;

  // Create stars with random positions and speeds
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.3 + 0.1
    });
  }

  function drawStars() {
    ctx.clearRect(0, 0, width, height);
    for (const star of stars) {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
      ctx.fillStyle = '#fff';
      ctx.globalAlpha = 0.85;
      ctx.shadowColor = '#fff';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      // Move star downward, loop to top if needed
      star.y += star.speed;
      if (star.y > height) {
        star.y = 0;
        star.x = Math.random() * width;
      }
    }
    requestAnimationFrame(drawStars);
  }

  drawStars();

  // Resize canvas on window resize
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = 260;
  });
});
