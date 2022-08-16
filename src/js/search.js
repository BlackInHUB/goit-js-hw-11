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
      hitsLeftCheck(images);
    })
    .catch(error => console.log(error));
}

function onLoadMoreBtnClick() {
  imgSearchApi
    .getImages()
    .then(images => {
      appendImgMarkup(images);
      hitsLeftCheck(images);
    })
    .catch(error => console.log(error));
}

function startHitsCheck(images) {
  if (images.data.totalHits === 0) {
    imgSearchApi.resetPage();
    loadMoreBtn.classList.add('is-hidden');
    return Notify.failure(
      'Вибач, але ми не знайшли зображень відовідно твого запиту. Спробуй ще.'
    );
  }
  Notify.success(
    `Круто! Ми знайшли для тебе ${images.data.totalHits} зображень :)`
  );
  loadMoreBtn.classList.remove('is-hidden');
}

function hitsLeftCheck(images) {
  const totalHits = images.data.totalHits;
  const hitsLeft = totalHits - (imgSearchApi.page - 1) * imgSearchApi.per_page;

  if (hitsLeft < 0 && !loadMoreBtn.classList.contains('is-hidden')) {
    loadMoreBtn.classList.add('is-hidden');
    return Notify.failure(
      `Вибач, але це всі зображення за результатами твого запиту :(`
    );
  } else if (hitsLeft > 0 && imgSearchApi.page > 2) {
    Notify.success(`Гортай! Ми маємо ще ${hitsLeft} зображень для тебе ;)`);
  }
}

function appendImgMarkup(images) {
  const imgArray = images.data.hits;
  imgMarkup(imgArray)
    .then(markup => {
      gallery.insertAdjacentHTML('beforeend', markup);
      const { height: cardHeight } =
        gallery.firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 3,
        behavior: 'smooth',
      });
      const lightbox = new SimpleLightbox('.gallery a');
      lightbox.refresh();
    })
    .catch(error => console.log(error));
}

function clearGallery() {
  gallery.innerHTML = '';
}
