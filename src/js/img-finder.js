import imgCardTpl from '../templates/imgCardTpl.hbs';
import ApiImages from './apiService.js/';
import LoadMoreBtn from './loadMoreBtn.js';
import animateScrollTo from 'animated-scroll-to';
import { onOpenModal } from './modal.js';
import {
    errorMessage,
    emptyStringMessage,
    noPicturesAtAll,
} from './pnotify.js';




const refs = {
  searchForm: document.querySelector('.js-search-form'),
  imgCardContainer: document.querySelector('.js-card-container'),
  imgContainer: document.querySelector('.gallery'),
  buttonMore: document.querySelector('.button')
};
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

const apiImages = new ApiImages();

refs.searchForm.addEventListener('submit', onSearch);

loadMoreBtn.refs.button.addEventListener('click', fetchHits);
refs.imgContainer.addEventListener('click', onOpenModal);

async function onSearch(e) {
  e.preventDefault();
  clearImgContainer();
  apiImages.query = e.currentTarget.elements.query.value;
  // console.log(response.length);
  // console.log(query);
  try {
    loadMoreBtn.show();
    loadMoreBtn.disable();
    apiImages.resetPage();
    fetchHits();

    if (apiImages.query === '') {
      return emptyStringMessage();
    }
  } catch (error) {
    errorMessage();
  }
}

function animateScroll() {
  const indexToScroll = 12 * (apiImages.page - 1) - 11;
  const itemToScroll = refs.imgContainer.children[indexToScroll];
  const options = {
    speed: 500,
    verticalOffset: -10,
  };

  animateScrollTo(itemToScroll, options);
}

async function fetchHits() {
  loadMoreBtn.disable();

  try {
    const response = await apiImages.fetchImages();
    if (response.length === 0) {
      noPicturesAtAll();
      // animateScrollTo(0, options);
    } else if (response.length > 0) {
      imagesMurkup(response);

      loadMoreBtn.enable();
      animateScroll();
      
    }

    if (response.length < 12) {
      loadMoreBtn.hide();
    }
  } catch (error) {
    loadMoreBtn.hide();
  }
}

function imagesMurkup(hits) {
  
  refs.imgCardContainer.insertAdjacentHTML('beforeend', imgCardTpl(hits));
  autoScroll();
  
 }
 export function autoScroll () {
 setTimeout(() => {
 refs.buttonMore.scrollIntoView({
     behavior: 'smooth',
           block: 'end',
       });
    }, 1000);
}

function clearImgContainer() {
  refs.imgCardContainer.innerHTML = '';
}