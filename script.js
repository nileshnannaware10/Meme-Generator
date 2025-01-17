// Selectors
const imageUpload = document.getElementById('imageUpload');
const memeCanvas = document.getElementById('memeCanvas');
const topText = document.getElementById('topText');
const bottomText = document.getElementById('bottomText');
const textColor = document.getElementById('textColor');
const bgColor = document.getElementById('bgColor');
const downloadMemeBtn = document.getElementById('downloadMemeBtn');
const randomMemeBtn = document.getElementById('randomMemeBtn');
const uploadToGalleryBtn = document.getElementById('uploadToGalleryBtn');
const galleryContent = document.getElementById('galleryContent');

const ctx = memeCanvas.getContext('2d');
memeCanvas.width = 500;
memeCanvas.height = 500;

let currentImage = null; // Store the current image

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
  ctx.font = '30px Impact';
  ctx.fillText(topText.value.toUpperCase(), memeCanvas.width / 2, 50);
  ctx.fillText(bottomText.value.toUpperCase(), memeCanvas.width / 2, memeCanvas.height - 30);
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
[topText, bottomText, textColor, bgColor].forEach((input) => {
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

