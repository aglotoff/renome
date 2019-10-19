/**
 * @file Implementation of the accordion gallery block
 * @author Andrey Glotov
 */

import { getEmSize, debounce } from '../../../js/util/index';

// -------------------------- BEGIN MODULE VARIABLES -------------------------- 

// Block name
const BLOCK = 'accordion-gallery';

// Element selectors
const SELECTORS = {
    BLOCK: `.${BLOCK}`,
    THUMB: `.${BLOCK}__thumb`,
    IMAGE: `.${BLOCK}__thumb-img`,
};

// Element class names
const CLASSES = {
    LIGHTBOX: 'lightbox',
};

const MOBILE_BREAKPOINT = 48;   // Mobile breakpoint (in ems)
const THUMB_MIN_HEIGHT = 100;   // Collapsed thumbnail height (in pixels)
const RESIZE_INTERVAL = 200;    // Resize event debounce interval

let isMobile = true;        // Is mobile layout active?
const allGalleries = [];    // All galleries on the page

// --------------------------- END MODULE VARIABLES ---------------------------

// -------------------------- BEGIN CLASS DEFINITION -------------------------- 

/**
 * Interactive image gallery that auto expands on mouse hover and focus just
 * like an accordion.
 */
class AccordionGallery {

    /**
     * Initialize the accordion gallery
     * 
     * @param {JQuery} $root The root element
     */
    constructor($root) {
        const $thumbs = $(SELECTORS.THUMB, $root);

        this.elements = { $root, $thumbs };

        this.config = {
            collapsedThumbWidth: `${100 / $thumbs.length}%`,
            collapsedThumbHeight: THUMB_MIN_HEIGHT,
        };

        this.state = {
            isVertical: true,
        };

        this.handleThumbActivate = this.handleThumbActivate.bind(this);
        this.handleThumbDeactivate = this.handleThumbDeactivate.bind(this);

        $root.on('mouseenter', SELECTORS.THUMB, this.handleThumbActivate);
        $root.on('focus', SELECTORS.THUMB, this.handleThumbActivate);
        $root.on('mouseleave', SELECTORS.THUMB, this.handleThumbDeactivate);
        $root.on('blur', SELECTORS.THUMB, this.handleThumbDeactivate);

        // Each image acts as a thumbnail for gallery managed by the
        // magnific-popup jQuery plugin
        $root.magnificPopup({
            delegate: SELECTORS.THUMB,
            mainClass: CLASSES.LIGHTBOX,

            gallery: {
                enabled: true,
                tCounter: '',
            },

            closeMarkup: `
                <button aria-label="Close" type="button" class="mfp-close">
                    &#215;
                </button>
            `,
            arrowMarkup: `
                <button 
                    aria-label="%title%"
                    type="button"
                    class="mfp-arrow mfp-arrow-%dir%"
                >
                </button>
            `,

            callbacks: {
                beforeOpen() {
                    // Add role and label attributes for accessibility purposes
                    this.wrap.attr({
                        'role': 'dialog',
                        'aria-label': 'Gallery',
                    });
                },
            },
        });

        // Keep track of all gallery objects to use a single window resize
        // event handler for them all
        allGalleries.push(this);
    }

    // -------------------------- BEGIN EVENT HANDLERS ------------------------

    /**
     * Handle the thumbnail activate event
     * 
     * @param {jQuery.Event} e The event object
     */
    handleThumbActivate(e) {
        const $thumb = $(e.currentTarget);
        const $image = $(SELECTORS.IMAGE, $thumb);

        // Expand the thumb to show the full image
        if (this.state.isVertical) {
            $thumb.height($image.height());
        } else {
            $thumb.width($image.width());
        }
    }

    /**
     * Handle the thumbnail deactivate event
     * 
     * @param {jQuery.Event} e The event object
     */
    handleThumbDeactivate(e) {
        const $thumb = $(e.currentTarget);

        // Restore thumb dimensions
        if (this.state.isVertical) {
            $thumb.height(this.config.collapsedThumbHeight);
        } else {
            $thumb.width(this.config.collapsedThumbWidth);
        }
    }

    /**
     * Respond to window resize event.
     * 
     * Switch between vertical orientation on mobile devices and horizontal
     * orientation on larger screens.
     */
    static handleWindowResize() {
        const screenWidthEms = $(window).outerWidth() / getEmSize($('.page'));

        if (!isMobile && (screenWidthEms < MOBILE_BREAKPOINT)) {
            isMobile = true;
    
            allGalleries.forEach((gallery) => gallery.setVertical(true));
        } else if (isMobile && (screenWidthEms >= MOBILE_BREAKPOINT)) {
            isMobile = false;
    
            allGalleries.forEach((gallery) => gallery.setVertical(false));
        }
    }

    // --------------------------- END EVENT HANDLERS -------------------------

    // -------------------------- BEGIN PUBLIC METHODS ------------------------

    /**
     * Switch gallery orientation.
     * 
     * @param {boolean} vertical
     *      true for vertical orientation, false for horizontal orientation
     */
    setVertical(vertical) {
        this.state.isVertical = vertical;

        this.elements.$thumbs
            .height(vertical ? this.config.collapsedThumbHeight : '')
            .width(vertical ? '' : this.config.collapsedThumbWidth);
    }

    // --------------------------- END PUBLIC METHODS -------------------------
}

// --------------------------- END CLASS DEFINITION --------------------------- 

// Initialize all accordion galleries on the page
$(SELECTORS.BLOCK).map(function() {
    new AccordionGallery($(this));
});

$(window).resize(debounce(
    AccordionGallery.handleWindowResize,
    RESIZE_INTERVAL
));

// Process initial window size
AccordionGallery.handleWindowResize();

export default AccordionGallery;
