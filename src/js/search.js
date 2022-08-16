import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImgSearchApi from './getImages';
import { imgMarkup } from './markup';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const imgSearchApi = new ImgSearchApi();

form.addEventListener('submit', onSearchSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

loadMoreBtn.classList.add('is-hidden');

function onSearchSubmit(evt) {
  evt.preventDefault();

  imgSearchApi.query = evt.currentTarget.elements.searchQuery.value;

  imgSearchApi.resetPage();
  imgSearchApi
    .getImages()
    .then(images => {
      startHitsCheck(images);
      clearGallery();
      appendImgMarkup(images);
      const lightbox = new SimpleLightbox('.gallery a');
      hitsLeftCheck(images);
    })
    .catch(error => console.log(error));
}

function onLoadMoreBtnClick() {
  imgSearchApi
    .getImages()
    .then(images => {
      appendImgMarkup(images);
      const lightbox = new SimpleLightbox('.gallery a');
      lightbox.refresh();
      hitsLeftCheck(images);
    })
    .catch(error => console.log(error));
}

function startHitsCheck(images) {
  if (images.data.totalHits === 0) {
    imgSearchApi.resetPage();
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  Notify.success(`Hooray! We found ${images.data.totalHits} images.`);
  loadMoreBtn.classList.remove('is-hidden');
}

function hitsLeftCheck(images) {
  const totalHits = images.data.totalHits;
  const hitsLeft = totalHits - (imgSearchApi.page - 1) * imgSearchApi.per_page;

  if (hitsLeft < 0 && !loadMoreBtn.classList.contains('is-hidden')) {
    loadMoreBtn.classList.add('is-hidden');
    return Notify.failure(
      `We're sorry, but you've reached the end of search results.`
    );
  } else if (hitsLeft > 0 && imgSearchApi.page > 2) {
    Notify.success(`Look! We have ${hitsLeft} more images.`);
  }
}

function appendImgMarkup(images) {
  const imgArray = images.data.hits;
  imgMarkup(imgArray)
    .then(markup => {
      gallery.insertAdjacentHTML('beforeend', markup);
    })
    .catch(error => console.log(error));
}

function clearGallery() {
  gallery.innerHTML = '';
}
