/**
 * @file Lazy loader for images.
 * @author Andrey Glotov
 */

import { throttle } from './index';

// -------------------------- BEGIN MODULE VARIABLES --------------------------

const BUFFER_HEIGHT = 50;
const LAZY_SELECTOR = '.lazy';
const SCROLL_INTERVAL = 200;  // Scroll throttling interval

let $images = $(LAZY_SELECTOR);

// --------------------------- END MODULE VARIABLES ---------------------------

// -------------------------- BEGIN UTILITY FUNCTIONS -------------------------

/**
 * Check if <tt>elem</tt> is in the browser's viewport.
 * 
 * @param {JQuery} $elem The element to check
 * @return {boolean} <tt>true</tt> if the element is in the viewport,
 *      <tt>false</tt> otherwise
 */
function isInViewport($elem) {
    const windowBottom = $(window).scrollTop() + $(window).height();
    return $elem.offset().top < (windowBottom + BUFFER_HEIGHT);
}

// --------------------------- END UTILITY FUNCTIONS --------------------------

// ----------------------------- BEGIN DOM METHODS ----------------------------

/**
 * Lazy-load the given <tt>img</tt> element.
 * 
 * @param {JQuery} $img The image element
 */
function loadImage($img) {
    if ($img.parent().is('picture')) {
        $img.siblings('source').each(function() {
            const $source = $(this);
            $source
                .attr('srcset', $source.attr('data-srcset'))
                .removeAttr('data-srcset');
        });
    }

    $img
        .attr('src', $img.attr('data-src'))
        .attr('srcset', $img.attr('data-srcset'))
        .removeAttr('data-src data-srcset')
        .removeClass('lazy');
}

// ------------------------------ END DOM METHODS -----------------------------

// --------------------------- BEGIN PUBLIC METHODS ---------------------------

/**
 * Load all images that have been scrolled into the viewport for the first time
 */
export function scanImages() {
    if ($images.length === 0) {
        return;
    }

    $images = $images.filter(function() {
        const $img = $(this);

        if (!isInViewport($img)) {
            return true;
        }
        
        loadImage($img);        

        return false;
    });
}

// ---------------------------- END PUBLIC METHODS ----------------------------

// ---------------------------- BEGIN PUBLIC METHODS --------------------------

/**
 * Initialize the lazy loader.
 */
export function init() {
    window.addEventListener(
        'scroll',
        throttle(scanImages, SCROLL_INTERVAL)
    );

    scanImages();
}

// ----------------------------- END PUBLIC METHODS ---------------------------
