/**
 * imports
 */
import "./css/main.css";
import Alpine from "alpinejs";
import AsyncAlpine from "async-alpine";
AsyncAlpine.init(Alpine);

//Alpine plugins
import intersect from "@alpinejs/intersect";
import collapse from "@alpinejs/collapse";

//stores
import { mobileMenu } from "@/alpine/store/mobile-menu";
import { popup } from "@/alpine/store/popup";

//components
import components from "@/alpine/components";

window.Alpine = Alpine;

//plugins more info here https://alpinejs.dev/start-here
Alpine.plugin(intersect);
Alpine.plugin(collapse);

//stores
Alpine.store("mobileMenu", mobileMenu); // use global search 'mobile-menu'
Alpine.store("popup", popup);
// how this used

//bundle components
Alpine.data("exampleComponent", components.exampleComponent);
Alpine.data("popup", components.popup);

AsyncAlpine.start();
Alpine.start();
