async function imgMarkup(imgArray) {
  try {
    const markup = await imgArray
      .map(
        img => `<div class="photo-card">
        <a class="gallery__item" href="${img.largeImageURL}">
        <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy"/>
        </a>
        <div class="info">
        <p class="info-item">
        <b>Likes</b>${img.likes}
        </p>
        <p class="info-item">
        <b>Views</b>${img.views}
        </p>
        <p class="info-item">
        <b>Comments</b>${img.comments}
        </p>
        <p class="info-item">
        <b>Downloads</b>${img.downloads}
        </p>
        </div>
        </div>`
      )
      .join('');
    return markup;
  } catch {
    error => console.log(error);
  }
}

export { imgMarkup };
