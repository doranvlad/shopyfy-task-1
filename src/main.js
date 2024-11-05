/**
 * imports
 */
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/grid";
import "./css/main.css";
import "animate.css";
import Iodine from "@caneara/iodine";
import Alpine from "alpinejs";
import AsyncAlpine from "async-alpine";
AsyncAlpine.init(Alpine);

// helpers
import "./helpers";

//Alpine plugins
import intersect from "@alpinejs/intersect";
import collapse from "@alpinejs/collapse";

//stores
import { mobileMenu } from "@/alpine/store/mobile-menu";
import { collectionFiltersStore } from "@/alpine/store/collection-filters-store";
import { stopScroll } from "@/alpine/store/stop-scroll";
import { cart } from "@/alpine/store/cart";
import { drawer } from "@/alpine/store/drawer";
import { popup } from "@/alpine/store/popup";
import { quickOrder } from "@/alpine/store/quick-order";

//components
import components from "@/alpine/components";

window.Alpine = Alpine;

//plugins more info here https://alpinejs.dev/start-here
Alpine.plugin(intersect);
Alpine.plugin(collapse);

//stores
Alpine.store("mobileMenu", mobileMenu); // use global search 'mobile-menu' how this used
Alpine.store("collectionFiltersStore", collectionFiltersStore);
Alpine.store("stop-scroll", stopScroll);
Alpine.store("cart", cart);
Alpine.store("drawer", drawer);
Alpine.store("popup", popup);
Alpine.store("quickOrder", quickOrder);

//bundle components
Alpine.data("header", components.header);
Alpine.data("productGallery", components.productGallery);
Alpine.data("accordion", components.accordion);
Alpine.data("klaviyoForm", components.klaviyoForm);
Alpine.data("videoToggler", components.videoToggler);
Alpine.data("marquee", components.marquee);
Alpine.data("dropdown", components.dropdown);
Alpine.data("blog", components.blog);
Alpine.data("productQuickOrder", components.productQuickOrder);
Alpine.data("account", components.account);
Alpine.data("pdpHero", components.pdpHero);
Alpine.data("nativeForm", components.nativeForm);
Alpine.data("productCard", components.productCard);
Alpine.data("sellingPlan", components.sellingPlan);
Alpine.data("collectionFilters", components.collectionFilters);
Alpine.data("collectionFiltersTwo", components.collectionFiltersTwo);
Alpine.data("searchData", components.searchData);
Alpine.data("searchPage", components.searchPage);
Alpine.data("pdpGrid", components.pdpGrid);
Alpine.data("pdpSliderGrid", components.pdpSliderGrid);
Alpine.data("pdpSliderThumbs", components.pdpSliderThumbs);

//async components
AsyncAlpine.data("swiperSlider", () =>
  import("./alpine/components/swiper-sliders")
);

AsyncAlpine.start();
Alpine.start();
