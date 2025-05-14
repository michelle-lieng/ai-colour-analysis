let eyeHex = null;
let hairHex = null;
let skinHex = null;
let clickCount = 0; // this keeps track of how many points have been selected

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const upload = document.getElementById("upload");
const analyseBtn = document.getElementById("analyse-btn");
const result = document.getElementById("result");

// when the user uploads an image: 
upload.addEventListener("change", function(e) {
  const file = e.target.files[0]; // get uploaded file
  const img = new Image(); // create new image element

  // resize the image to fix the max width provided for display
  img.onload = function () {
    const MAX_WIDTH = 600;
    const scaleFactor = Math.min(1, MAX_WIDTH / img.width);
  
    const scaledWidth = img.width * scaleFactor;
    const scaledHeight = img.height * scaleFactor;
  
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;
    ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
  
    // reset state for new analysis
    clickCount = 0;
    eyeHex = hairHex = skinHex = null;
    analyseBtn.disabled = true; // disable analyse button until all 3 colours selected
    result.textContent = "Waiting for input...";
  };

  // load image from uploaded file
  img.src = URL.createObjectURL(file);
});

// when user clicks on canvas to pick a colour 
canvas.addEventListener("click", function(e) {
  if (clickCount >= 3) return;

  // get coordinants of clicks relevant to the canvas 
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // get pixel colour at that point 
  const pixel = ctx.getImageData(x, y, 1, 1).data;
  const hex = "#" + ((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1).toUpperCase();

  // save colour value and alert user based on which click this is
  if (clickCount === 0) {
    eyeHex = hex;
    alert("Eye color selected: " + hex);
  } else if (clickCount === 1) {
    hairHex = hex;
    alert("Hair color selected: " + hex);
  } else if (clickCount === 2) {
    skinHex = hex;
    alert("Skin color selected: " + hex);
    analyseBtn.disabled = false;
  }

  clickCount++;
});

// when the user clicks analyse my colours 
analyseBtn.addEventListener("click", async function() {
  if (!eyeHex || !hairHex || !skinHex) return;

  result.textContent = "Analysing..."; //updates the UI

  // send colour data to backend API (fastapi running locally)
  const res = await fetch("http://localhost:8000/analyse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eye: eyeHex, hair: hairHex, skin: skinHex })
  });

  const data = await res.json(); // wait for backend response

  
  result.textContent = data.analysis;
});
