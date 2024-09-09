async function fetchImages() {
    try {
      const response = await fetch('https://picsum.photos/v2/list');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error fetching data: ", error);
      return [];
    }
}


async function displayImages(images) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = images.length ? '' : '<p>No images found.</p>';
    images.forEach(image => {
      const imageElement = `
        <div class="image-card">
          <img src="${image.download_url}" alt="Image by ${image.author}">
          <h3>${image.author}</h3>
          <p>Some static body text...</p>
        </div>
      `;
      gallery.innerHTML += imageElement;
    });
}

async function populateDropdown() {
    const images = await fetchImages();
    const authors = [...new Set(images.map(image => image.author))];
    const dropdown = document.getElementById('author-dropdown');
    dropdown.innerHTML = '<option value="">Select an author</option>';
    authors.forEach(author => {
      const option = `<option value="${author}">${author}</option>`;
      dropdown.innerHTML += option;
    });

    dropdown.addEventListener('change', async () => {
      const selectedAuthor = dropdown.value;
      const filteredImages = images.filter(image => image.author === selectedAuthor);
      displayImages(filteredImages);
    });
}

window.onload = () => {
    populateDropdown();
};
