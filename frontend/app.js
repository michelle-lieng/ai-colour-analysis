// State variables to store selected colors
let eyeHex = null;
let hairHex = null;
let skinHex = null;
let currentSelection = 'eye';

// DOM elements we'll use frequently
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const upload = document.getElementById("upload");
const analyseBtn = document.getElementById("analyse-btn");
const result = document.getElementById("result");

// Remove unused clickCount variable since we're using currentSelection instead

/**
 * Resets all color previews to their default state
 */
function resetColourPreviews() {
  ['eye-preview', 'hair-preview', 'skin-preview'].forEach(id => {
    updateColourPreview(id, '#ffffff');
    document.getElementById(id).querySelector('.hex-code').textContent = 'Not selected';
  });
}

/**
 * Updates the visual preview of a selected color
 */
function updateColourPreview(elementId, hexColour) {
  const preview = document.getElementById(elementId);
  const dot = preview.querySelector('.colour-dot');
  const hexCode = preview.querySelector('.hex-code');
  
  dot.style.backgroundColor = hexColour;
  hexCode.textContent = hexColour;
  
  // Add click-to-copy functionality
  preview.querySelector('.colour-info').onclick = () => {
    navigator.clipboard.writeText(hexColour);
    const originalText = hexCode.textContent;
    hexCode.textContent = 'Copied!';
    setTimeout(() => hexCode.textContent = originalText, 1000);
  };
}

/**
 * Converts RGB values to hex color code
 */
function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

/**
 * Handles image upload and display
 */
upload.addEventListener("change", function(e) {
  const file = e.target.files[0]; 
  const img = new Image(); 

  img.onload = function () {
    // Resize image for display while maintaining aspect ratio
    const MAX_WIDTH = 600;
    const scaleFactor = Math.min(1, MAX_WIDTH / img.width);
    const scaledWidth = img.width * scaleFactor;
    const scaledHeight = img.height * scaleFactor;
  
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;
    ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
  
    // Reset all state
    eyeHex = hairHex = skinHex = null;
    analyseBtn.disabled = true;
    result.textContent = "Waiting for input...";
    resetColourPreviews();
  };

  img.src = URL.createObjectURL(file);
});

/**
 * Handles color picking when canvas is clicked
 */
canvas.addEventListener('click', function(e) {
  // Calculate exact pixel coordinates accounting for canvas scaling
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const pixelX = Math.floor(x * scaleX);
  const pixelY = Math.floor(y * scaleY);
  
  // Get color at clicked point
  const pixel = ctx.getImageData(pixelX, pixelY, 1, 1).data;
  const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
  
  // Update the appropriate preview based on current selection
  const previewMap = {
    'eye': () => eyeHex = hex,
    'hair': () => hairHex = hex,
    'skin': () => skinHex = hex
  };

  previewMap[currentSelection]?.();
  updateColourPreview(`${currentSelection}-preview`, hex);
  
  // Enable analyse button if all colours are selected
  analyseBtn.disabled = !(eyeHex && hairHex && skinHex);
});

/**
 * Handles the analysis request when analyse button is clicked
 */
analyseBtn.addEventListener("click", async function() {
  if (!eyeHex || !hairHex || !skinHex) return;

  result.textContent = "Analysing...";

  try {
    const res = await fetch("http://localhost:8000/analyse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eye: eyeHex, hair: hairHex, skin: skinHex })
    });

    const data = await res.json();
    result.textContent = data.analysis;
  } catch (error) {
    result.textContent = "Error analyzing colors. Please try again.";
  }
});

/**
 * Sets up color selection button functionality
 */
document.querySelectorAll('.select-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active selection state
    document.querySelectorAll('.colour-selection').forEach(el => el.classList.remove('active'));
    const parent = btn.closest('.colour-selection');
    parent.classList.add('active');
    currentSelection = parent.dataset.target;
  });
});