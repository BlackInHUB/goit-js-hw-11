const gallery = document.querySelector('.gallery');

function imgMarkup(imgArray) {
  const markup = imgArray
    .map(
      img => `<div class="photo-card"><img src="${img.webformatURL}" alt="${img.tags}" loading="lazy"/>
      <div class="info">
    <p class="info-item">
      <b>Likes:</b>&nbsp;${img.likes}
    </p>
    <p class="info-item">
      <b>Views:</b>&nbsp;${img.views}
    </p>
    <p class="info-item">
      <b>Comments:</b>&nbsp;${img.comments}
    </p>
    <p class="info-item">
      <b>Downloads:</b>&nbsp;${img.downloads}
    </p>
  </div>
</div>`
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}

function clearGallery() {
  gallery.innerHTML = '';
}

export { imgMarkup };
export { clearGallery };
