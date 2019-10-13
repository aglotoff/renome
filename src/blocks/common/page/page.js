/**
 * @file Implementation of the page block
 * @author Andrey Glotov
 */

import * as LazyLoader from '../../../js/util/lazy-loader';
import { debounce, throttle } from '../../../js/util/index';

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

import * as Portfolio from '../../portfolio/portfolio/portfolio';
import * as ProjectCarousel from '../../portfolio/project-carousel/project-carousel';

import BlogCarousel from '../../blog/blog-carousel/blog-carousel';
import * as CommentForm from '../../blog/comment-form/comment-form';
import * as Share from '../../blog/share/share';
import Video from '../../blog/video/video';

import * as Checkout from '../../shop/checkout/checkout';
import * as Payments from '../../shop/payments/payments';
import * as ProductGallery from '../../shop/product-gallery/product-gallery';
import * as ReviewForm from '../../shop/review-form/review-form';
import * as ShippingCalc from '../../shop/shipping-calc/shipping-calc';
import * as ShopFilter from '../../shop/shop-filter/shop-filter';

// -------------------------- BEGIN MODULE VARIABLES --------------------------

const RESIZE_INTERVAL       = 200;  // Resize debouncing interval
const SCROLL_INTERVAL       = 200;  // Scroll throttling interval

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

// ---------------------------- END EVENT HANDLERS ----------------------------

// --------------------------- BEGIN PUBLIC METHODS ---------------------------

/**
 * Initialize the page block.
 */
export function initBlock() {
    $(window).on({
        resize: debounce(handleWindowResize, RESIZE_INTERVAL),
        scroll: throttle(handleWindowScroll, SCROLL_INTERVAL),
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

    // Blog blocks
    BlogCarousel.initAll();
    CommentForm.initBlock();
    Share.initBlock();
    Video.initAll();

    // Portfolio blocks
    Portfolio.initBlock();
    ProjectCarousel.initBlock();

    // Shop blocks
    ShopFilter.initBlock();
    ProductGallery.initBlock();
    ReviewForm.initBlock();
    ShippingCalc.initBlock();
    Checkout.initBlock();
    Payments.initBlock();

    // Process the initial window size and scroll position
    handleWindowResize();
    handleWindowScroll();
}

// ---------------------------- END PUBLIC METHODS ----------------------------
