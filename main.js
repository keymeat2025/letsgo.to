document.addEventListener('DOMContentLoaded', function() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const folderPath = `https://raw.githubusercontent.com/keymeat2025/letsgo.to/main/${year}/${month}/`;

  const apiURL = `https://api.github.com/repos/${repo}/contents/${folderPath}`;

  fetch(apiURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Folder not found');
      }
    })
    .then(files => {
      const images = files
        .filter(file => file.type === 'file' && /\.(jpeg|png|gif|pdf)$/i.test(file.name))
        .map(file => file.download_url);

      if (images.length > 0) {
        const swiperWrapper = document.getElementById('swiper-wrapper');
        images.forEach(imgUrl => {
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
