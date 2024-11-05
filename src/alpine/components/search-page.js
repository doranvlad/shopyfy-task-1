import api from "@/alpine/utils/api";
import {
  addNextPageItems,
  getHasNextPage,
  getNewItems,
  serializeForm,
  loadMore,
  setParams,
  scrollToAnchor,
} from "@/alpine/utils/global";
import Alpine from "alpinejs";

export const searchPage = () => ({
  isLoading: false,
  searchQuery: "",
  searchResult: false,
  nextPageCount: 1,
  facets_params: "",
  floatFilters: false,
  hasNextPage: false,
  init() {
    this.getHasNextPage(document);

    window.onpopstate = () => {
      window.location.reload();
    };
  },

  addNextPageItems,
  getHasNextPage,
  getNewItems,
  serializeForm,
  setParams,
  scrollToAnchor,

  async clearFilter(url) {
    let params = new URLSearchParams(url.split("?")[1]);
    params.delete("q");
    params.delete("type");
    this.facets_params = params.toString();
    this.isLoading = true;
    let newURL =
      window.location.href +
      "?q=" +
      this.searchQuery +
      "&" +
      this.facets_params;
    this.changeUrl(newURL);
    await this.renderSearch();
    this.isLoading = false;
  },

  async setSortBy(value) {
    this.isLoading = true;
    let url = window.location;
    let params = new URLSearchParams(url.search);
    params.delete("q");
    params.delete("type");
    params.set("sort_by", value);
    this.facets_params = params.toString();
    let newURL =
      window.location.href +
      "?q=" +
      this.searchQuery +
      "&" +
      this.facets_params;
    this.changeUrl(newURL);
    await this.renderSearch();
    this.isLoading = false;
  },

  async applyFilters(hide = false) {
    this.isLoading = true;
    if (hide) {
      Alpine.store("collectionFiltersStore").hide();
    }

    await this.renderSearch();
    this.scrollToAnchor(document.getElementById("main-search"));
    this.isLoading = false;
  },

  changeUrl(url) {
    window.history.pushState({}, url, url);
  },

  async renderSearch() {
    this.isLoading = true;
    this.resultsCount = 0;

    let facets = this.facets_params;
    if (this.facets_params.length) {
      facets = "&" + this.facets_params;
    }

    const url = `/search?q=${this.searchQuery}&type=product${facets}`;
    this.changeUrl(url);

    try {
      if (!this.searchQuery.length) {
        this.searchResult = false;
        this.isLoading = false;
        return;
      }

      const currentLayout = document.getElementById(`main-search`);

      const response = await api.get(url, { responseType: "document" });
      const newLayout = response.getElementById(`main-search`);

      if (newLayout) {
        currentLayout.outerHTML = newLayout.outerHTML;
      }

      this.searchResult = true;
      this.isLoading = false;
    } catch (e) {
      this.isLoading = false;
      console.log(e);
    }
  },

  async loadMoreProducts() {
    this.nextPageCount++;

    const newURL =
      window.location.href +
      "?q=" +
      this.searchQuery +
      "&" +
      this.facets_params +
      "&type=product&page=" +
      this.nextPageCount;

    await loadMore(this, newURL);
  },
});
