/**
 * @file Implementation of the page block
 * @author Andrey Glotov
 */

import LazyLoader from '../../../js/utils/lazy-loader';

import Header from '../header/header';
import Dropdown from '../dropdown/dropdown';

import * as Nav             from '../nav/nav';
import * as Tabs            from '../tabs/tabs';

import * as AboutGallery    from '../../about/about-gallery/about-gallery';
import * as ContactForm     from '../../contact/contact-form/contact-form';
import * as ContactMap      from '../../contact/map/map';
import * as Gallery         from '../../index/gallery/gallery';
import * as Menu            from '../../menu/menu/menu';
import * as ReservationForm from '../../reservation/reservation-form/reservation-form';
import * as Slider          from '../../index/slider/slider';
import * as SpecialsSlider  from '../../index/specials-slider/specials-slider';

import * as Portfolio       from '../../portfolio/portfolio/portfolio';
import * as ProjectSlider   from '../../portfolio/project-slider/project-slider';

import * as BlogGallery     from '../../blog/blog-gallery/blog-gallery';
import * as Comment         from '../../blog/comment/comment';
import * as CommentForm     from '../../blog/comment-form/comment-form';

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
function initBlock() {
    $(window).on({
        resize: debounceWindowResize,
        scroll: throttleWindowScroll,
    });

    // Lazy image loader
    LazyLoader.init();

    // Common blocks
    Dropdown.initAll();
    Header.initBlock();
    Nav.initModule();
    Tabs.initModule();

    // Inner page blocks
    AboutGallery.initModule();
    ContactForm.initModule();
    ContactMap.initModule();
    Gallery.initModule();
    Menu.initModule();
    ReservationForm.initModule();
    Slider.initModule();
    SpecialsSlider.initModule();

    // Portfolio blocks
    Portfolio.initModule();
    ProjectSlider.initModule();

    // Blog blocks
    BlogGallery.initModule();
    Comment.initModule();
    CommentForm.initModule();

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

export default {
    initBlock,
};
