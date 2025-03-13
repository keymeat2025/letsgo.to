document.addEventListener('DOMContentLoaded', function() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const folderPath = `https://raw.githubusercontent.com/keymeat2025/letsgo.to/main/${year}/${month}/`;

  fetch(folderPath)
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');
      const imageElements = Array.from(doc.querySelectorAll('a[href$=".jpeg"], a[href$=".jpg"], a[href$=".png"], a[href$=".gif"]'));
      const imageUrls = imageElements.map(el => folderPath + el.getAttribute('href'));

      const swiperWrapper = document.getElementById('swiper-wrapper');
      imageUrls.forEach(imgUrl => {
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
    })
    .catch(error => console.error('Error loading images:', error));
});
