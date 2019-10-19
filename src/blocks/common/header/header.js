/**
 * @file Implementation of the header block
 * @author Andrey Glotov
 */

import { show as showSearch } from '../search/search';
import { getEmSize, forceReflow, throttle } from '../../../js/util/index';

// -------------------------- BEGIN MODULE VARIABLES --------------------------

// Block name
const BLOCK = 'header';

// Element selectors
const SELECTORS = {
    BLOCK: `.${BLOCK}`,
    SEARCH_TOGGLE: `.${BLOCK}__search-toggle`,
};

// Element class names
const CLASSES = {
    BLOCK_TRANSPARENT: `${BLOCK}_transparent`,
    BLOCK_HIDDEN: `${BLOCK}_hidden`,
    BLOCK_ANIMATED: `${BLOCK}_animated`,
    BLOCK_SCROLL: `${BLOCK}_scroll`,
};

const STICKY_HEADER_OFFSET = 6;     // Scroll offset to make the header "sticky"
const VISIBLE_HEADER_OFFSET = 32;   // Scroll offset to show the "sticky" header
const SCROLL_INTERVAL= 200;         // Scroll throttling interval

// Possible header states
const HEADER_STATES = {
    NORMAL: 0,
    STICKY: 1,
    VISIBLE: 2,
};

// jQuery elements map
const elements = {};

// Is header initially transparent?
let isTransparent = false;

// Default header state
let headerState = HEADER_STATES.NORMAL;

// --------------------------- END MODULE VARIABLES ---------------------------

// --------------------------- BEGIN PRIVATE METHODS --------------------------

/**
 * Add or remove header classes basd on the current scroll offset to create an
 * animated sticky header effect.
 */
function updateHeaderStyles() {
    const currentOffsetEm = $(window).scrollTop() / getEmSize($('.page'));

    let newState = null;
    if (currentOffsetEm < STICKY_HEADER_OFFSET) {
        newState = HEADER_STATES.NORMAL;
    } else if (currentOffsetEm < VISIBLE_HEADER_OFFSET) {
        newState = HEADER_STATES.STICKY;
    } else {
        newState = HEADER_STATES.VISIBLE;
    }

    if (newState !== headerState) {
        const { $header } = elements;

        if (newState === HEADER_STATES.NORMAL) {
            $header
                .removeClass(CLASSES.BLOCK_SCROLL)
                .removeClass(CLASSES.BLOCK_HIDDEN)
                .removeClass(CLASSES.BLOCK_ANIMATED)
                .toggleClass(CLASSES.BLOCK_TRANSPARENT, isTransparent);
        } else if (newState === HEADER_STATES.STICKY) {
            $header
                .addClass(CLASSES.BLOCK_SCROLL)
                .addClass(CLASSES.BLOCK_HIDDEN)
                .removeClass(CLASSES.BLOCK_TRANSPARENT);
                
            forceReflow($header);

            $header.addClass(CLASSES.BLOCK_ANIMATED);
        } else {    // HEADER_STATES.VISIBLE
            if (headerState === HEADER_STATES.NORMAL) {
                // Make sure the animation is played
                $header
                    .addClass(CLASSES.BLOCK_SCROLL)
                    .addClass(CLASSES.BLOCK_HIDDEN)
                    .removeClass(CLASSES.BLOCK_TRANSPARENT);

                forceReflow($header);

                $header.addClass(CLASSES.BLOCK_ANIMATED);
            }
            
            $header.removeClass(CLASSES.BLOCK_HIDDEN);
        }

        headerState = newState;
    }
}

/**
 * Initialize the header block
 */
function initBlock() {
    elements.$header = $(SELECTORS.BLOCK);
    elements.$searchToggle = $(SELECTORS.SEARCH_TOGGLE, elements.$header);

    isTransparent = elements.$header.hasClass(CLASSES.BLOCK_TRANSPARENT);

    elements.$searchToggle.click(showSearch);

    $(window).scroll(throttle(updateHeaderStyles, SCROLL_INTERVAL));

    // Process initial scroll position
    updateHeaderStyles();
}

// ---------------------------- END PRIVATE METHODS ---------------------------

initBlock();
