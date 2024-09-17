let currentImages = [];

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
    const dropdown = document.getElementById('author-dropdown');
    if (dropdown.value === "" && images.length === 0) {
        gallery.innerHTML = '';
    } else {
        gallery.innerHTML = images.length ? '' : '<p>No images found.</p>';
        images.forEach(image => {
            const imageElement = `
                <div class="image-card">
                    <img src="${image.download_url}" alt="Image by ${image.author}">
                    <h3>${image.author}</h3>
                    <p>Body text for whatever you'd like to say.</p>
                </div>
            `;
            gallery.innerHTML += imageElement;
        });
    }
    togglePagination(images.length > 0);
}

function setupPagination(images, imagesPerPage = 6) {
    const paginationContainer = document.getElementById('pagination');
    const totalPages = Math.ceil(images.length / imagesPerPage);
    paginationContainer.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = `<button id="page${i}" onclick="changePage(${i})">${i}</button>`;
        paginationContainer.innerHTML += pageButton;
    }
    togglePagination(totalPages > 1);
    setActivePage(1);
}

function togglePagination(show) {
    const pagination = document.getElementById('pagination');
    pagination.style.display = show ? 'block' : 'none';
}

function changePage(page, imagesPerPage = 6) {
    const startIndex = (page - 1) * imagesPerPage;
    const selectedImages = currentImages.slice(startIndex, startIndex + imagesPerPage);
    displayImages(selectedImages);
    setActivePage(page);
}

function setActivePage(page) {
    const paginationButtons = document.querySelectorAll('.pagination button');
    paginationButtons.forEach(button => {
        if (parseInt(button.textContent) === page) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

async function populateDropdown() {
    const images = await fetchImages();
    currentImages = images;
    const authors = [...new Set(images.map(image => image.author))];
    const dropdown = document.getElementById('author-dropdown');
    dropdown.innerHTML = '<option value="">Select an author</option>';
    authors.forEach(author => {
        const option = `<option value="${author}">${author}</option>`;
        dropdown.innerHTML += option;
    });

    dropdown.addEventListener('change', async () => {
        const selectedAuthor = dropdown.value;
        if (selectedAuthor) {
            const filteredImages = images.filter(image => image.author === selectedAuthor);
            currentImages = filteredImages;
            setupPagination(filteredImages);
            changePage(1);
        } else {
            displayImages([]);
        }
    });
}

window.onload = () => {
    populateDropdown();
};
