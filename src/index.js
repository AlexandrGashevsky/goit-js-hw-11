import './sass/main.scss';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import axios from 'axios';

const inputForm = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery');
const ladMoreBtn = document.querySelector('.load-more');
let pagenumber = 1;
let gallery;
ladMoreBtn.style.display = "none";

async function getImages(event) {
  event.preventDefault();
  try {
    const response = await axios.get(`https://pixabay.com/api/?key=25260590-534fb4fdfe1550b09a9c38aa6&q=${event.currentTarget.searchQuery.value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pagenumber}`);
    if(response.data.hits.length === 0){
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      ladMoreBtn.style.display = "none";
    } else {
      const galleryImages = response.data.hits.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => 
    `<a class="gallery__item" href="${largeImageURL}">    
    <img class = "gallery__image" src = "${webformatURL}" alt="${tags}"/>           
      </a>
      <ul>
      <li><h4>likes</h4><p>${likes}</p></li>
      <li><h4>views</h4><p>${views}</p></li>
      <li><h4>comments</h4><p>${comments}</p></li>
      <li><h4>downloads</h4><p>${downloads}</p></li>
      </ul>
      `
      ).join("");
      galleryList.insertAdjacentHTML('beforeend', galleryImages);
      gallery = new SimpleLightbox('.gallery a', {captionsData: 'alt'});
      gallery.on('show.simplelightbox', function () {});
    }
  } catch (error) {
    console.error(error);
  }
}

inputForm.addEventListener('submit', async (e) => {
  pagenumber = 1;
  galleryList.innerHTML = "";
  getImages(e);
  ladMoreBtn.style.display = "block";
});

ladMoreBtn.addEventListener('click', async() => {
  pagenumber += 1;
  try {
    const newresponse = await axios.get(`https://pixabay.com/api/?key=25260590-534fb4fdfe1550b09a9c38aa6&q=${inputForm.searchQuery.value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pagenumber}`);
    if(newresponse.data.hits.length === 0){
      Notiflix.Notify.failure('Sorry, there are no more images matching your search query.');
    } else {
      const galleryImages = newresponse.data.hits.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => 
    `<a class="gallery__item" href="${largeImageURL}">    
    <img class = "gallery__image" src = "${webformatURL}" alt="${tags}"/>           
      </a>
      <ul>
      <li><h4>likes</h4><p>${likes}</p></li>
      <li><h4>views</h4><p>${views}</p></li>
      <li><h4>comments</h4><p>${comments}</p></li>
      <li><h4>downloads</h4><p>${downloads}</p></li>
      </ul>
      `
      ).join("");
      galleryList.insertAdjacentHTML('beforeend', galleryImages);
      gallery = new SimpleLightbox('.gallery a', {captionsData: 'alt'});
      gallery.on('show.simplelightbox', function () {});
    }
  } catch (error) {
    console.error(error);
  }
});