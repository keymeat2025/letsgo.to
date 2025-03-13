document.addEventListener('DOMContentLoaded', function() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');

  fetch(`/${year}/${month}/`)
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
      const imgs = Array.from(doc.querySelectorAll('a'))
        .map(link => link.href)
        .filter(href => href.match(/\.(jpe?g|png|gif|pdf)$/i));
      
      if (imgs.length > 0) {
        const imgUrl = imgs[0]; // Use the first image found
        document.getElementById('banner').src = imgUrl;
      } else {
        throw new Error('No images found in folder');
      }
    })
    .catch(error => console.error('Error loading banner:', error));
});
