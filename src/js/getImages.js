const axios = require('axios').default;

export default class ImgSearchApi {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 12;
  }

  async getImages() {
    const BASE_URL = 'https://pixabay.com/api/';
    const options = `?key=29241598-085cf323ec0ff8dd3d2a30634&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.per_page}`;

    try {
      const images = await axios.get(`${BASE_URL}${options}`);
      this.nextPage();
      return images;
    } catch (error) {
      console.log(error);
    }
  }

  nextPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    return (this.searchQuery = newQuery);
  }
}
