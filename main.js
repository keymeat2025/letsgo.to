document.addEventListener('DOMContentLoaded', function() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const folderPath = `https://raw.githubusercontent.com/keymeat2025/letsgo.to/main/${year}/${month}/`;

  const images = [
    "DISTRICT-LEVEL-CHESS-TOURANMENT-DP-SPorts-1 (1).pdf",
    "WhatsApp-Image-2024-11-28-at-2.55.19-PM.jpeg",
    "f5874972-8971-4bd3-a089-7ad79e67b2da.jpeg"
  ];

  const swiperWrapper = document.getElementById('swiper-wrapper');
  images.forEach(imageName => {
    const imgUrl = `${folderPath}${imageName}`;
    const slide = document.createElement('div');
    slide.classList.add('swiper-slide');
    const img = document.createElement('img');
    img.src = imgUrl;
    slide.appendChild(img);
    swiperWrapper.appendChild(slide);
  });

  // Initialize Swiper
  new Swiper('.swiper-container', {
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
  });
});
