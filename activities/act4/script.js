const apiKey = " live_UsYvKFQlMQnOTG2pz0gwYgOF8TTQ1IjywCgz2KpVdDJfH7HP6xrnrnwbpkKuGlCr "; // Replace with your actual API key
const breedSelect = document.getElementById('breedselect');
const searchButton = document.getElementById('searchbutton');
const catInfo = document.getElementById('catinfo');
const catImage = document.getElementById('catimage');
const imageColumn = document.getElementById('imagecolumn');

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
  const selectedBreed = breedSelect.value;

  if (!selectedBreed) {
    alert('Please select a breed!');
    return;
  }

  imageColumn.style.display = 'block';

  fetch(`https://api.thecatapi.com/v1/breeds/${selectedBreed}`, {
    headers: {
      'x-api-key': apiKey
    }
  })
    .then(response => response.json())
    .then(data => {
      const wikiUrl = `https://en.wikipedia.org/wiki/${data.name.replace(/ /g, '_')}`;
      catInfo.innerHTML = `
        <h2>${data.name}</h2>
        <p><strong>Description:</strong> ${data.description}</p>
        <p><strong>Temperament:</strong> ${data.temperament}</p>
        <p><strong>Origin:</strong> ${data.origin}</p>
        <p><strong>Average Weight:</strong> ${data.weight.metric} kg</p>
        <p><strong>Life Span:</strong> ${data.life_span} years</p>
        <p><strong>Learn more:</strong> <a href="${wikiUrl}" target="_blank" class="btn btn-link">Wikipedia</a></p>
      `;

      fetch(`https://api.thecatapi.com/v1/images/search?breed_id=${selectedBreed}`)
        .then(response => response.json())
        .then(images => {
          catImage.innerHTML = `<img src="${images[0]?.url || ''}" alt="${data.name}">`;
        })
        .catch(err => {
          catImage.innerHTML = `<p>Error loading cat image.</p>`;
        });
    })
});
