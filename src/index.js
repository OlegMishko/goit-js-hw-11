import './sass/main.scss';
import { getImgs } from "./js/getImgs.js";
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
    searchImg: document.querySelector('#search-form'),
    onGallery: document.querySelector('.gallery'),
    watcher: document.querySelector('.watcher')
    // loadBtn: document.querySelector('.load-more'),
    // photoInfo: document.querySelector('.photo-card')
};

const DEBOUNCE_DELAY = 300;

let gallery = new SimpleLightbox('.gallery a', {
    enableKeyboard: true,
    captionsData: 'alt',
    captionDelay: 250,
});

let page = 1;
let currentValue = '';
let list = [];

// refs.searchImg.addEventListener("submit", debounce(onInputSearch, DEBOUNCE_DELAY));
refs.searchImg.addEventListener("submit", onInputSearch);
// refs.loadBtn.addEventListener("click", debounce(loadMoreImgs, DEBOUNCE_DELAY));
// refs.onGallery.addEventListener("submit", submitHandler);
// console.log(refs.searchImg);

// let observer = new IntersectionObserver(onEntry, {
//     rootMargin: '200px',
//     threshold: 0.5,
// });

// function onEntry(entries) {
//     entries.forEach(entry => {
//         if (entry.isIntersecting) {
//             getImgsList(currentValue, page);
//             observer.unobserve(entry.target);
//         }
//     });
// }



// function submitHandler() {
//     clearData();
//     page += 1;
//     // console.log(list)
//     getImgsList(currentValue, page)

//     console.log(currentValue);
// };

// submitHandler();
console.log(currentValue);

function clearData() {
    refs.onGallery.innerHTML = '';
    page = 1;
    currentValue = '';
    list = [];
};

function onInputSearch(e) {
    e.preventDefault();
    clearData();
    // currentValue = e.target.value.trim();
    currentValue = e.target.elements.searchQuery.value.trim();
    if (currentValue === "") {
        clearData();
        return
    }

    // for (let i = 1; i <= 2; i++) {
    //     getImgsList(currentValue, i)
    // }
    //  

    getImgsList(currentValue, page)
    // console.log(page);

};

function getImgsList(currentValue, page) {
    // page += 1;
    // console.log(page);
    getImgs(currentValue, page)
        .then(res => {
            if (res.hits.length === 0) {
                clearData();
                return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            }

            if (page < 2) {
                Notiflix.Notify.success(`Hooray! We found totalHits images: ${res.totalHits}`);
            }

            // if (res.hits.length < 40) {
            //     Notiflix.Notify.success("We're sorry, but you've reached the end of search results.");
            // }

            list = [...list, ...res.hits]
            // scrollTo();
            renderImgs(list)
            // observer.observe(refs.watcher);
            // scrollTo()
            lastImgObserver.observe(refs.watcher);

            // lastImgObserver.observe(document.querySelector(".watcher:last-child"));
            gallery.refresh();

        })
        .catch(error => {
            console.log(error)
            // clearData();
            return Notiflix.Notify.failure(`We're sorry, something went wrong. Status: ${error}`);
        })
}

// function loadMoreImgs() {
//     
//     page += 1;
//     console.log(list)
//     getImgsList(currentValue, page)
//     checkScroll();
// };

function renderImgs(imgs) {
    const markup = imgs.map(img => {
        return `
        
            <div class="photo-card">
            <a href="${img.largeImageURL}">
                <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy" />
            </a>
                <div class="info">
                <p class="info-item">
                    <b>Likes: ${img.likes}</b>
                </p>
                <p class="info-item">
                    <b>Views: ${img.views}</b>
                </p>
                <p class="info-item">
                    <b>Comments: ${img.comments}</b>
                </p>
                <p class="info-item">
                    <b>Downloads: ${img.downloads}</b>
                </p>
                </div>
            </div>
        `
    }).join("");
    refs.onGallery.innerHTML = markup;
    // refs.onGallery.innerHTML = "";
    // refs.onGallery.insertAdjacentHTML("beforeend", markup);
};

const lastImgObserver = new IntersectionObserver((entry) => {
    const lastImg = entry[0];
    if (lastImg.isIntersecting) {
        page += 1;
        getImgsList(currentValue, page)
        scrollTo()
        // Notiflix.Notify.success("We're sorry, but you've reached the end of search results.");
    }
});

// lastImgObserver.observe(document.querySelector(".watcher:last-child"));


function scrollTo() {
    const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
};