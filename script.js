// Selectors
const imageUpload = document.getElementById('imageUpload');
const memeCanvas = document.getElementById('memeCanvas');
const topText = document.getElementById('topText');
const bottomText = document.getElementById('bottomText');
const fontSelect = document.getElementById('fontSelect');
const textSize = document.getElementById('textSize');
const textColor = document.getElementById('textColor');
const bgColor = document.getElementById('bgColor');
const downloadMemeBtn = document.getElementById('downloadMemeBtn');
const randomMemeBtn = document.getElementById('randomMemeBtn');
const galleryContent = document.getElementById('galleryContent');

const ctx = memeCanvas.getContext('2d');
memeCanvas.width = 500;
memeCanvas.height = 500;

let currentImage = null; // Store the current image
let textPositions = { top: { x: 250, y: 50 }, bottom: { x: 250, y: 450 } }; // Default text positions

// Functions
const drawMeme = (image) => {
  // Background color
  ctx.fillStyle = bgColor.value;
  ctx.fillRect(0, 0, memeCanvas.width, memeCanvas.height);

  // Draw image
  if (image) {
    const aspectRatio = image.width / image.height;
    let newWidth, newHeight;

    if (aspectRatio > 1) {
      newWidth = memeCanvas.width;
      newHeight = memeCanvas.width / aspectRatio;
    } else {
      newHeight = memeCanvas.height;
      newWidth = memeCanvas.height * aspectRatio;
    }

    const x = (memeCanvas.width - newWidth) / 2;
    const y = (memeCanvas.height - newHeight) / 2;

    ctx.drawImage(image, x, y, newWidth, newHeight);
  }

  // Draw text
  ctx.fillStyle = textColor.value;
  ctx.textAlign = 'center';
  ctx.font = `${textSize.value}px ${fontSelect.value}`;
  ctx.fillText(topText.value.toUpperCase(), textPositions.top.x, textPositions.top.y);
  ctx.fillText(bottomText.value.toUpperCase(), textPositions.bottom.x, textPositions.bottom.y);
};

// Upload Image
imageUpload.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      currentImage = new Image();
      currentImage.src = reader.result;
      currentImage.onload = () => drawMeme(currentImage);
    };
    reader.readAsDataURL(file);
  }
});

// Text Updates
[topText, bottomText, textColor, bgColor, fontSelect, textSize].forEach((input) => {
  input.addEventListener('input', () => drawMeme(currentImage));
});

// Download Meme
downloadMemeBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'meme.png';
  link.href = memeCanvas.toDataURL();
  link.click();
});

// Random Meme
randomMemeBtn.addEventListener('click', async () => {
  const response = await fetch('https://api.imgflip.com/get_memes');
  const data = await response.json();
  const randomMeme = data.data.memes[Math.floor(Math.random() * data.data.memes.length)];

  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.src = randomMeme.url;
  image.onload = () => {
    currentImage = image; // Update the current image
    drawMeme(currentImage);
  };
});

// Draggable Text
memeCanvas.addEventListener('mousedown', (e) => {
  const rect = memeCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (Math.abs(x - textPositions.top.x) < 50 && Math.abs(y - textPositions.top.y) < 20) {
    dragText('top', x, y);
  } else if (Math.abs(x - textPositions.bottom.x) < 50 && Math.abs(y - textPositions.bottom.y) < 20) {
    dragText('bottom', x, y);
  }
});

const dragText = (position, x, y) => {
  const onMouseMove = (e) => {
    const rect = memeCanvas.getBoundingClientRect();
    const newX = e.clientX - rect.left;
    const newY = e.clientY - rect.top;

    if (position === 'top') {
      textPositions.top.x = newX;
      textPositions.top.y = newY;
    } else if (position === 'bottom') {
      textPositions.bottom.x = newX;
      textPositions.bottom.y = newY;
    }

    drawMeme(currentImage);
  };

  const onMouseUp = () => {
    memeCanvas.removeEventListener('mousemove', onMouseMove);
    memeCanvas.removeEventListener('mouseup', onMouseUp);
  };

  memeCanvas.addEventListener('mousemove', onMouseMove);
  memeCanvas.addEventListener('mouseup', onMouseUp);
};
