import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImgSearchApi from './getImages';
import { imgMarkup } from './markup';
import { clearGallery } from './markup';

const form = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('.load-more');

const imgSearchApi = new ImgSearchApi();

form.addEventListener('submit', onSearchSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

function onSearchSubmit(evt) {
  evt.preventDefault();

  loadMoreBtn.classList.add('is-hidden');

  imgSearchApi.query = evt.currentTarget.elements.searchQuery.value;

  imgSearchApi.resetPage();
  imgSearchApi
    .getImages()
    .then(images => {
      if (images.data.totalHits === 0) {
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }

      clearGallery();
      appendImgMarkup(images);
      loadMoreBtn.classList.remove('is-hidden');
      Notify.success(`Hooray! We found ${images.data.totalHits} images.`);
    })
    .catch(error => console.log(error));
}

function onLoadMoreBtnClick() {
  imgSearchApi
    .getImages()
    .then(images => {
      const hitsLeft =
        images.data.totalHits - (imgSearchApi.page - 1) * imgSearchApi.per_page;

      appendImgMarkup(images);

      if (hitsLeft <= 0) {
        loadMoreBtn.classList.add('is-hidden');
        return Notify.failure(
          `We're sorry, but you've reached the end of search results.`
        );
      }

      Notify.success(`Look! We have ${hitsLeft} more images.`);
    })
    .catch(error => console.log(error));
}

function appendImgMarkup(images) {
  const imgArray = images.data.hits;
  imgMarkup(imgArray);
}
