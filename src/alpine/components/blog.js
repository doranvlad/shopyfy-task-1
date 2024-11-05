import { scrollToAnchor } from "@/alpine/utils/global";

export const blog = (initActiveBlog, showCount) => ({
  activeBlog: initActiveBlog,
  activeBlogLink: initActiveBlog,
  initShowCount: showCount,
  articleShowCount: showCount,
  init() {
    this.slideToActiveBlog();

    window.onpopstate = () => {
      window.location.reload();
    };
  },
  changeActiveBlog(blog) {
    this.activeBlogLink = blog;
    this.scrollToAnchor(this.$root);
    setTimeout(() => {
      this.activeBlog = blog;
      this.articleShowCount = this.initShowCount;
      this.changeUrl(`/blogs/${blog}`);
    }, 600);
  },
  scrollToAnchor,
  loadMoreArticles() {
    this.articleShowCount += this.initShowCount;
  },
  slideToActiveBlog() {
    setTimeout(() => {
      // mobile slide to
      const parentAnchorBlock = document.querySelector("[data-active-blog]");

      if (parentAnchorBlock) {
        const parentList = parentAnchorBlock.closest("[data-blog-list]");
        parentList.scrollLeft = parentAnchorBlock.getBoundingClientRect().left;
      }
    }, 100);
  },
  changeUrl(url) {
    window.history.replaceState({}, url, url);
  },
});
