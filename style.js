document.addEventListener("DOMContentLoaded", () => {
  const mainDiv = document.querySelector(".main");
  const images = document.querySelectorAll(".maps img");
  const indicator = document.querySelector(".indicator");
  let currentIndex = 0;
  let totalImages = images.length;

  // **Preload Images (Avoids Lag)**
  const imageSources = Array.from(images).map((img) => img.getAttribute("src"));
  const preloadedImages = [];

  // Preload images into memory
  imageSources.forEach((src) => {
    const img = new Image();
    img.src = src;
    img.onload = () => preloadedImages.push(img); // Only push once loaded
  });

  function updateImage(index) {
    if (index < 0 || index >= totalImages || index === currentIndex) return;
    currentIndex = index;

    // Set the background using the preloaded image
    const image = preloadedImages[index];

    // Use fade-in transition (instead of reloading background-image every time)
    gsap.to(mainDiv, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        mainDiv.style.backgroundImage = `url(${image.src})`; // Apply the new image
        gsap.to(mainDiv, { opacity: 1, duration: 0.3 }); // Fade in the new image
      },
    });

    // Move indicator smoothly
    gsap.to(indicator, {
      top: images[index].offsetTop + "px",
      duration: 0.2,
      ease: "power2.out",
    });
  }

  // **Click Event**
  images.forEach((img, index) => {
    img.addEventListener("click", () => updateImage(index));
    img.addEventListener("touchend", () => updateImage(index));
  });

  // **Smooth Scroll Control**
  let lastScrollTime = 0;
  document.addEventListener("wheel", (e) => {
    const now = Date.now();
    if (now - lastScrollTime < 250) return; // Throttle event
    lastScrollTime = now;

    if (e.deltaY > 0) updateImage(currentIndex + 1); // Scroll Down
    else updateImage(currentIndex - 1); // Scroll Up
  });

  // **Touch Swipe Handling**
  let startY = 0,
    endY = 0;
  document.addEventListener(
    "touchstart",
    (e) => (startY = e.touches[0].clientY)
  );
  document.addEventListener("touchmove", (e) => (endY = e.touches[0].clientY));
  document.addEventListener("touchend", () => {
    if (Math.abs(startY - endY) > 50) {
      if (startY > endY) updateImage(currentIndex + 1); // Swipe Up
      else updateImage(currentIndex - 1); // Swipe Down
    }
  });

  // **Custom Cursor (Optional)**
  document.addEventListener("mousemove", (e) => {
    gsap.to(".cursor", {
      x: e.clientX,
      y: e.clientY,
      duration: 0.1,
    });
  });
});
