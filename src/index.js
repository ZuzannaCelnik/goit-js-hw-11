import { debounce } from 'lodash';
import Notiflix from 'notiflix';
import simpleLightbox from 'simplelightbox';

const form = document.querySelector('.search-form');
const input = document.querySelector('input');
const searchBtn = document.querySelector(`button[type="submit"]`);
const gallery = document.querySelector('.gallery');

const API_KEY = '29714011-50432ef4df90c0a38ddc61e51';
const perPage = 40;
let page = 1;
const lightbox = $('.gallery a').simpleLightbox;


function fetchImages() {
    loadMoreBtn.disabled();
    fetchImagesService.fetchImages().then(({data}) => {
        if (data.total === 0) {
            Notify.info(`Sorry, there are no images matching your search query: ${fetchImagesService.searchQuery}. Please try again.`);
            loadMoreBtn.hide();
            return;
        }
        appendImagesMarkup(data);
        onPageScrolling()
        lightbox.refresh();
        const { totalHits } = data;

        if (refs.containerDiv.children.length === totalHits ) {
            Notify.info(`We're sorry, but you've reached the end of search results.`);
            loadMoreBtn.hide();
        } else {
            loadMoreBtn.enable();
            Notify.success(`Hooray! We found ${totalHits} images.`);
        }
    }).catch(handleError);
}


const renderImages = images => {
  const markup = images
    .map(
      image => `<div class="photo-card">
  <a href='${image.largeImageURL}'>
    <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b> ${image.likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${image.views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${image.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${image.downloads}
    </p>
  </div>
</div>`
    )
    .join('');

  if (page === 1) {
    gallery.innerHTML = markup;
  } else {
    gallery.insertAdjacentHTML('beforeend', markup);
  }
  return page++;
};
