// DOCS https://alpinejs.dev/globals/alpine-data
//Check main.js file how to register components

export const productGallery = () => ({
  initialRender: true,
  currentImage: null,
  switchImage($el) {
    this.initialRender = false
    this.currentImage = {
      url: $el.target.dataset.url,
      alt: $el.target.dataset.alt || ''
    }
  }
})