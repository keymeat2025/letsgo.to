document.addEventListener('DOMContentLoaded', function() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const folderPath = `${year}/${month}/`;
  console.log("folderpath is"$folderpath)
  fetch(folderPath)
    .then(response => {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error('Folder not found');
      }
    })
    .then(text => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const images = Array.from(doc.querySelectorAll('a'))
        .map(link => link.href)
        .filter(href => href.match(/\.(jpe?g|png|gif)$/i));

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
            delay: 5000, // Delay between slides in milliseconds
            disableOnInteraction: false,
          },
        });
      } else {
        throw new Error('No images found in folder');
      }
    })
    .catch(error => console.error('Error loading banners:', error));
});
