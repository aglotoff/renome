/**
 * @file Implementation of the page block
 * @author Andrey Glotov
 */

import * as LazyLoader from '../../../js/utils/lazy-loader';

import * as Header from '../header/header';
import * as Nav from '../nav/nav';

import AccordionGallery from '../../about/accordion-gallery/accordion-gallery';
import ContactForm from '../../contact/contact-form/contact-form';
import Gallery from '../../common/gallery/gallery';
import LocationMap from '../../contact/location-map/location-map';
import Menu from '../../menu/menu/menu';
import Reservation from '../../reservation/reservation/reservation';
import Slider from '../../common/slider/slider';
import SpecialsSlider from '../../common/specials-slider/specials-slider';
import Tabs from '../tabs/tabs';

import * as Portfolio       from '../../portfolio/portfolio/portfolio';
import * as ProjectSlider   from '../../portfolio/project-slider/project-slider';

import BlogCarousel from '../../blog/blog-carousel/blog-carousel';
import * as Comment         from '../../blog/comment/comment';
import * as CommentForm     from '../../blog/comment-form/comment-form';
import Share from '../../blog/share/share';
import Video from '../../blog/video/video';

import * as Checkout        from '../../shop/checkout/checkout';
import * as Payment         from '../../shop/payment/payment';
import * as Product         from '../../shop/product/product';
import * as ProductGallery  from '../../shop/product-gallery/product-gallery';
import * as ReviewForm      from '../../shop/review-form/review-form';
import * as ShippingCalc    from '../../shop/shipping-calc/shipping-calc';
import * as ShopFilter      from '../../shop/shop-filter/shop-filter';

// -------------------------- BEGIN MODULE VARIABLES --------------------------

const RESIZE_INTERVAL       = 200;  // Resize debouncing interval
const SCROLL_INTERVAL       = 200;  // Scroll throttling interval

let resizeTimer = null;
let scrollTimer = null;
let wasScrolled = false;

// --------------------------- END MODULE VARIABLES ---------------------------

// --------------------------- BEGIN EVENT HANDLERS ---------------------------

/**
 * Handle the window scroll event
 */
function handleWindowScroll() {
    LazyLoader.scanImages();
    Header.handleScroll();
}

/**
 * Handle the window resize event
 */
function handleWindowResize() {
    Nav.handleResize();
    AccordionGallery.handleResize();
    Portfolio.handleResize();
    Tabs.handleResize();
}

/**
 * Debounce the window resize event
 */
function debounceWindowResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleWindowResize, RESIZE_INTERVAL);
}

/**
 * Throttle the window scroll event
 */
function throttleWindowScroll() {
    if (scrollTimer) {
        // Ensure that we catch and execute that last invocation.
        wasScrolled = true;
        return;
    }

    handleWindowScroll();

    scrollTimer = this.setTimeout(function() {
        scrollTimer = null;
        if (wasScrolled) {
            handleWindowScroll();
            wasScrolled = false;
        }
    }, SCROLL_INTERVAL);
}

// ---------------------------- END EVENT HANDLERS ----------------------------

// --------------------------- BEGIN PUBLIC METHODS ---------------------------

/**
 * Initialize the page block.
 * @return true
 */
export function initBlock() {
    $(window).on({
        resize: debounceWindowResize,
        scroll: throttleWindowScroll,
    });

    // Lazy image loader
    LazyLoader.init();

    // Common blocks
    Header.initBlock();
    Nav.initBlock();

    // Inner page blocks
    AccordionGallery.initAll();
    ContactForm.initAll();
    LocationMap.initAll();
    Gallery.initAll();
    Menu.initAll();
    Reservation.initAll();
    Slider.initAll();
    SpecialsSlider.initAll();
    Tabs.initAll();

    // Portfolio blocks
    Portfolio.initModule();
    ProjectSlider.initModule();

    // Blog blocks
    BlogCarousel.initAll();
    Comment.initModule();
    CommentForm.initModule();
    Share.initBlock();
    Video.initAll();

    // Shop blocks
    Checkout.initModule();
    Payment.initModule();
    Product.initModule();
    ProductGallery.initModule();
    ReviewForm.initModule();
    ShippingCalc.initModule();
    ShopFilter.initModule();

    // Process the initial window size and scroll position
    handleWindowResize();
    handleWindowScroll();

    return true;
}

// ---------------------------- END PUBLIC METHODS ----------------------------
