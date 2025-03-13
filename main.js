document.addEventListener('DOMContentLoaded', function() {
  fetch('competitions.json')
    .then(response => response.json())
    .then(data => {
      const currentUrl = window.location.pathname;
      const competition = data.find(comp => currentUrl.includes(comp.url));
      if (competition) {
        document.getElementById('banner').src = competition.bannerUrl;
      }
    })
    .catch(error => console.error('Error loading competition data:', error));
});
