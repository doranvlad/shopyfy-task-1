import api from "@/alpine/utils/api";
import Alpine from "alpinejs";
import { selector } from "@/constants";
import {
  addNextPageItems,
  getHasNextPage,
  getNewItems,
  serializeForm,
  loadMore,
  setParams,
  scrollToAnchor,
} from "@/alpine/utils/global";

export const collectionFilters = () => ({
  isLoading: false,
  nextPageCount: 1,
  floatFilters: false,
  hasNextPage: false,
  activeCollection: {
    url: window.location.href.split("?")[0],
    handle: window.location.pathname.split("/").pop(),
  },
  facets_params: "",
  async init() {
    this.getHasNextPage(document);

    window.onpopstate = () => {
      window.location.reload();
    };
  },

  changeUrl(url) {
    window.history.pushState({}, url, url);
    this.activeCollection.url = url;
  },

  getNewItems,
  getHasNextPage,
  addNextPageItems,
  async loadMoreProducts() {
    this.nextPageCount++;

    const newURL =
      window.location.href +
      "?" +
      this.facets_params +
      "&page=" +
      this.nextPageCount;

    await loadMore(this, newURL);
  },

  async setSortBy(value) {
    this.isLoading = true;
    let url = window.location;
    let params = new URLSearchParams(url.search);
    params.set("sort_by", value);
    this.facets_params = params.toString();
    let newURL = window.location.pathname + "?" + this.facets_params;
    this.changeUrl(newURL);
    await this.renderCollection(this.activeCollection.handle);
    this.isLoading = false;
  },

  async clearFilter(url) {
    this.facets_params = url.split("?")[1] || "";
    this.isLoading = true;
    this.changeUrl(url);
    await this.renderCollection(this.activeCollection.handle);
    this.isLoading = false;
  },

  createQueryParams(form) {
    let query;
    const clearUrl = this.activeCollection.url.split("?")[0];
    this.facets_params = this.serializeForm(form);
    if (this.facets_params) {
      query = clearUrl + "?" + this.facets_params;
    } else {
      query = clearUrl;
    }
    return query;
  },

  setParams,
  serializeForm,

  async renderCollection(collectionHandle) {
    this.getHasNextPage(document);

    let url = `/collections/${collectionHandle}?${this.facets_params}`;
    const currentLayout = document.getElementById(`main-collection`);

    try {
      const response = await api.get(url, { responseType: "document" });
      const newLayout = response.getElementById(`main-collection`);

      if (newLayout) {
        currentLayout.outerHTML = newLayout.outerHTML;
      }
    } catch (e) {
      console.log(e);
    }
  },

  async applyFilters(hide = false) {
    this.isLoading = true;
    if (hide) {
      Alpine.store("collectionFiltersStore").hide();
    }
    this.changeUrl(
      this.createQueryParams(document.querySelector(selector.facetFiltersForm))
    );
    await this.renderCollection(this.activeCollection.handle);
    this.scrollToAnchor(document.getElementById("main-collection"));
    this.isLoading = false;
  },

  async changeCollection() {
    this.facets_params = "";
    this.activeCollection.url = this.$el.href;
    this.activeCollection.handle = this.activeCollection.url.split("/").pop();
    await this.renderCollection(this.activeCollection.handle);
    this.changeUrl(this.activeCollection.url);
    this.scrollToAnchor(document.getElementById("main-collection"));
  },

  scrollToAnchor,
});
