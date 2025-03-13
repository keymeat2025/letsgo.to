document.addEventListener('DOMContentLoaded', function() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');

  fetch(`/${year}/${month}/banner.jpg`)
    .then(response => {
      if (response.ok) {
        return response.blob();
      } else {
        throw new Error('Banner not found');
      }
    })
    .then(blob => {
      const url = URL.createObjectURL(blob);
      document.getElementById('banner').src = url;
    })
    .catch(error => console.error('Error loading banner:', error));
});
