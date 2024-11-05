//lazy-load for rte images
document
  .querySelectorAll(".rte img, .rte-article img, video img")
  .forEach((img) => {
    img.setAttribute("loading", "lazy");
  });

//default alt for no-alt images
document.querySelectorAll("img:not([alt]), img[alt='']").forEach((img) => {
  img.setAttribute("alt", "Image without description");
});
