import api from "@/alpine/utils/api";
import { serializeForm, setParams } from "@/alpine/utils/global";

export const searchData = () => ({
  visible: false,
  isLoading: false,
  searchQuery: "",
  searchResult: false,
  products: [],
  queries: [],
  articles: [],
  collections: [],
  pages: [],
  resultsCount: 0,
  activeTab: "products",
  clearAll() {
    this.searchResult = true;
    this.products = [];
    this.queries = [];
    this.articles = [];
    this.collections = [];
    this.pages = [];
  },
  setParams,
  serializeForm,
  setActiveTab() {
    switch (true) {
      case this.products.length > 0: {
        this.activeTab = "products";
        break;
      }
      case this.queries.length > 0: {
        this.activeTab = "queries";
        break;
      }
      case this.articles.length > 0: {
        this.activeTab = "articles";
        break;
      }
      case this.collections.length > 0: {
        this.activeTab = "collections";
        break;
      }
      case this.pages.length > 0: {
        this.activeTab = "pages";
        break;
      }
    }
  },
  async renderSearch() {
    this.isLoading = true;
    this.resultsCount = 0;

    const url = `/search/suggest.json`;
    const params = {
      q: this.searchQuery,
      resources: {
        limit: 10,
        limit_scope: "each",
      },
    };

    try {
      if (!params.q.length) {
        this.clearAll();
        this.searchResult = false;
        this.isLoading = false;
        return;
      }
      const response = await api.get(url, { responseType: "json", params });
      if (response && response.resources && response.resources.results) {
        const searchResults = response.resources.results;
        this.clearAll();

        Object.keys(searchResults).forEach((key) => {
          const item = searchResults[key];
          this[key] = item;
          this.resultsCount += item.length;
        });

        this.setActiveTab();
      }
    } catch (e) {
      console.log(e);
    }
    this.isLoading = false;
  },
});
