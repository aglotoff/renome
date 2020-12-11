import { init as initFocus } from './util/focus';
import { init as initLazyLoader } from './util/lazy-loader';

// Common Blocks
import '../blocks/common/gallery/gallery';
import '../blocks/common/header/header';
import '../blocks/common/mini-cart/mini-cart';
import '../blocks/common/nav/nav';
import '../blocks/common/search/search';
import '../blocks/common/slider/slider';
import '../blocks/common/specials-slider/specials-slider';
import '../blocks/common/tabs/tabs';

// About Page Blocks
import '../blocks/about/accordion-gallery/accordion-gallery';

// Blog Blocks
import '../blocks/blog/comment-form/comment-form';
import '../blocks/blog/post-gallery/post-gallery';
import '../blocks/blog/share/share';
import '../blocks/blog/video/video';

// Contact Page Blocks
import '../blocks/contact/contact-form/contact-form';
import '../blocks/contact/location-map/location-map';

// Menu Page blocks
import '../blocks/menu/menu/menu';

// Portfolio blocks
import '../blocks/portfolio/portfolio/portfolio';
import '../blocks/portfolio/project-carousel/project-carousel';

// Reservation page blocks
import '../blocks/reservation/reservation/reservation';

// Shop blocks
import '../blocks/shop/checkout/checkout';
import '../blocks/shop/payments/payments';
import '../blocks/shop/product-gallery/product-gallery';
import '../blocks/shop/product-list/product-list';
import '../blocks/shop/review-form/review-form';
import '../blocks/shop/shipping-calc/shipping-calc';
import '../blocks/shop/shop-filter/shop-filter';

initFocus();
initLazyLoader();
