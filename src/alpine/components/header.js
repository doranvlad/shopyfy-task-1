import { selector } from "@/constants";

export const header = () => ({
  prevScrollPos: window.pageYOffset,
  offset: 0,
  scrollHandler() {
    const $header = document.querySelector(selector.header);
    const $announcementBar = document.querySelector(selector.announcementBar);
    const currentScrollPos = window.pageYOffset;

    if (this.prevScrollPos >= this.offset) {
      $header.style.transform = `translateY(-100%)`;
      if (this.prevScrollPos > currentScrollPos) {
        $header.style.transform = `unset`;
      } else {
        $header.style.transform = `translateY(-100%)`;
      }
    }

    this.prevScrollPos = currentScrollPos;
    this.offset = $header.offsetHeight + $announcementBar.offsetHeight;
  },
  init() {
    this.offset =
      this.getHeight(selector.header) +
      this.getHeight(selector.announcementBar);
  },
  getHeight(selector) {
    return document.querySelector(selector)
      ? document.querySelector(selector).offsetHeight
      : 0;
  },
});
