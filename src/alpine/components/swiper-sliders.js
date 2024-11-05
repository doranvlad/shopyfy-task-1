import Swiper, { Autoplay, Pagination, Navigation } from "swiper";
Swiper.use([Autoplay, Pagination, Navigation]);

const options = {
  "logo-slider": {
    slidesPerView: "auto",
    centeredSlides: true,
    loop: true,
    allowTouchMove: false,
    spaceBetween: 30,
    speed: 3000,
    autoplay: {
      delay: 1,
    },
    breakpoints: {
      768: {
        spaceBetween: 60,
      },
    },
  },
  multicolumn_slider: {
    slidesPerView: "auto",
    spaceBetween: 30,
  },
  text_with_icons: {
    slidesPerView: 1,
    spaceBetween: 30,
    centerInsufficientSlides: true,
    autoplay: {
      delay: 4000,
    },
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
    breakpoints: {
      1150: {
        slidesPerView: "auto",
        spaceBetween: 30,
        pagination: false,
        autoplay: {
          delay: 4000,
        },
      },
      1280: {
        slidesPerView: 4,
        spaceBetween: 30,
        pagination: false,
      },
      1536: {
        slidesPerView: 4,
        spaceBetween: 50,
        pagination: false,
      },
    },
  },
  blog_posts_slider: {
    slidesPerView: "auto",
    spaceBetween: 30,
  },
  announcement_bar: {
    draggable: false,
    loop: true,
    slidesPerView: 1,
    spaceBetween: 0,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  },
  sidebar_menu_upsells: {
    draggable: true,
    slidesPerView: 1.6,
    spaceBetween: 12,
    breakpoints: {
      744: {},
    },
  },
  mega_menu_cards: {
    loop: true,
    draggable: true,
    slidesPerView: 2,
    spaceBetween: 30,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  },
  cart_upsells: {
    observer: true,
    grabCursor: true,
    focusableElements: "button",
    slidesPerView: "auto",
    spaceBetween: 12,
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
  },
  cart_upsells_full_width: {
    observer: true,
    slidesPerView: "auto",
  },
  ugc_slider: {
    grabCursor: true,
    freeMode: true,
    slidesPerView: "auto",
    observer: true,
    spaceBetween: 30,
    centerInsufficientSlides: true,
    autoplay: {
      delay: 4000,
    },
  },
};

export const swiperSlider = (htmlElement, sliderOptions) => ({
  isBeginning: true,
  isEnd: false,
  slider: null,
  slidesCount: 0,
  init() {
    const _this = this;
    this.slider = new Swiper(htmlElement, {
      ...options[sliderOptions],
      on: {
        slideChange: function (swiper) {
          _this.isBeginning = swiper.isBeginning;
          _this.isEnd = swiper.isEnd;
        },
        observerUpdate: function (swiper) {
          _this.slidesCount = swiper.slides.length;
          swiper.update();
        },
      },
    });
  },
  stopAutoPlay() {
    this.slider.autoplay.stop();
  },
  startAutoPlay() {
    this.slider.autoplay.start();
  },
});
