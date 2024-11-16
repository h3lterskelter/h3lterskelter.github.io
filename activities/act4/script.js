const apiKey = "live_UsYvKFQlMQnOTG2pz0gwYgOF8TTQ1IjywCgz2KpVdDJfH7HP6xrnrnwbpkKuGlCr";
const breedSelect = document.getElementById('breedselect');
const searchButton = document.getElementById('searchbutton');
const catInfo = document.getElementById('catinfo');
const catImage = document.getElementById('catimage');
const imageColumn = document.getElementById('imagecolumn');
const viewGalleryButton = document.getElementById('viewgallery');

let selectedBreedId = "";
let selectedBreedName = "";

fetch('https://api.thecatapi.com/v1/breeds', {
  headers: {
    'x-api-key': apiKey
  }
})
  .then(response => response.json())
  .then(data => {
    data.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });
  })

searchButton.addEventListener('click', () => {
  selectedBreedId = breedSelect.value;
  selectedBreedName = breedSelect.options[breedSelect.selectedIndex].text;

  if (!selectedBreedId) {
    alert('Please select a breed!');
    return;
  }

  imageColumn.style.display = 'block';
  viewGalleryButton.style.display = 'inline-block';

  fetch(`https://api.thecatapi.com/v1/breeds`, {
    headers: {
      'x-api-key': apiKey
    }
  })
    .then(response => response.json())
    .then(breeds => {
      const selectedBreed = breeds.find(breed => breed.id === selectedBreedId);

      if (selectedBreed) {
        const wikiUrl = selectedBreed.wikipedia_url || "#";

        catInfo.innerHTML = `
          <h2>${selectedBreed.name}</h2>
          <p><strong>Description:</strong> ${selectedBreed.description}</p>
          <p><strong>Temperament:</strong> ${selectedBreed.temperament}</p>
          <p><strong>Origin:</strong> ${selectedBreed.origin}</p>
          <p><strong>Average Weight:</strong> ${selectedBreed.weight.metric} kg</p>
          <p><strong>Life Span:</strong> ${selectedBreed.life_span} years</p>
          <p><strong>Learn more:</strong> 
            <a href="${wikiUrl}" target="_blank" class="btn btn-link">${wikiUrl ? "Wikipedia" : "No Wikipedia Info Available"}</a>
          </p>
        `;

        fetch(`https://api.thecatapi.com/v1/images/search?breed_id=${selectedBreedId}`)
          .then(response => response.json())
          .then(images => {
            catImage.innerHTML = `<img src="${images[0]?.url || ''}" alt="${selectedBreed.name}" class="img-fluid rounded shadow">`;
          })
      }
    })
});

viewGalleryButton.addEventListener('click', () => {
  if (selectedBreedId) {
    window.location.href = `view.html?breedid=${selectedBreedId}&breedname=${encodeURIComponent(selectedBreedName)}`;
  }
});
