/**
 * @file Implementation of the portfolio block
 * @author Andrey Glotov
 */

import * as PortfolioFilter from '../portfolio-filter/portfolio-filter';
import * as PortfolioGrid   from '../portfolio-grid/portfolio-grid';

import { debounce, getEmSize } from '../../../js/util/index';

// -------------------------- BEGIN MODULE VARIABLES --------------------------

const RESIZE_INTERVAL = 200;    // Debounce interval for window resize event
const MEDIUM_BREAKPOINT = 48;   // Mobile breakpoint (in ems)
const FAKE_LOAD_TIME = 1000;    // Fake items load time (in ms)

// Block name
const BLOCK = 'portfolio';

// Element selectors
const SELECTORS = {
    BLOCK: `.${BLOCK}`,
    GRID: `.${BLOCK}__grid`,
    MORE: `.${BLOCK}__more-btn`,
};

// Element class names
const CLASSES = {
    LOADER: `loader loader_size_l ${BLOCK}__loader`,
    ERROR: `error ${BLOCK}__error`,
    MORE_HIDDEN: `${BLOCK}__more-btn_hidden`,
};

// Set of elements
const elements = {};

let activeFilter = 'all';   // Active filter
let isMobile = true;        // Is mobile layout active?

// Fake portfolio items
// The real data would be fetched from the server
const fakeItems = [{
    title: 'Apple pie',
    images: {
        jpeg: {
            small: 'img/content/portfolio/projects/thumbs/apple-pie-small.jpg',
            medium: 'img/content/portfolio/projects/thumbs/apple-pie-medium.jpg',
            large: 'img/content/portfolio/projects/thumbs/apple-pie-large.jpg',
        },
        webp: {
            small: 'img/content/portfolio/projects/thumbs/apple-pie-small.webp',
            medium: 'img/content/portfolio/projects/thumbs/apple-pie-medium.webp',
            large: 'img/content/portfolio/projects/thumbs/apple-pie-large.webp',
        },
    },
    link: 'portfolio-single.html',
    categories: [ 'desserts' ],
}, {
    title: 'Fresh fruit cocktail',
    images: {
        jpeg: {
            small: 'img/content/portfolio/projects/thumbs/fresh-fruit-cocktail-small.jpg',
            medium: 'img/content/portfolio/projects/thumbs/fresh-fruit-cocktail-medium.jpg',
            large: 'img/content/portfolio/projects/thumbs/fresh-fruit-cocktail-large.jpg',
        },
        webp: {
            small: 'img/content/portfolio/projects/thumbs/fresh-fruit-cocktail-small.webp',
            medium: 'img/content/portfolio/projects/thumbs/fresh-fruit-cocktail-medium.webp',
            large: 'img/content/portfolio/projects/thumbs/fresh-fruit-cocktail-large.webp',
        },
    },
    link: 'portfolio-single.html',
    categories: [ 'drinks' ],
}, {
    title: 'Green tea',
    images: {
        jpeg: {
            small: 'img/content/portfolio/projects/thumbs/green-tea-small.jpg',
            medium: 'img/content/portfolio/projects/thumbs/green-tea-medium.jpg',
            large: 'img/content/portfolio/projects/thumbs/green-tea-large.jpg',
        },
        webp: {
            small: 'img/content/portfolio/projects/thumbs/green-tea-small.webp',
            medium: 'img/content/portfolio/projects/thumbs/green-tea-medium.webp',
            large: 'img/content/portfolio/projects/thumbs/green-tea-large.webp',
        },
    },
    link: 'portfolio-single.html',
    categories: [ 'drinks' ],
}, {
    title: 'Waffles with coffee',
    images: {
        jpeg: {
            small: 'img/content/portfolio/projects/thumbs/waffles-with-coffee-small.jpg',
            medium: 'img/content/portfolio/projects/thumbs/waffles-with-coffee-medium.jpg',
            large: 'img/content/portfolio/projects/thumbs/waffles-with-coffee-large.jpg',
        },
        webp: {
            small: 'img/content/portfolio/projects/thumbs/waffles-with-coffee-small.webp',
            medium: 'img/content/portfolio/projects/thumbs/waffles-with-coffee-medium.webp',
            large: 'img/content/portfolio/projects/thumbs/waffles-with-coffee-large.webp',
        }
    },
    link: 'portfolio-single.html',
    categories: [ 'desserts', 'drinks' ],
}, {
    title: 'Chicken livers',
    images: {
        jpeg: {
            small: 'img/content/portfolio/projects/thumbs/chicken-livers-small.jpg',
            medium: 'img/content/portfolio/projects/thumbs/chicken-livers-medium.jpg',
            large: 'img/content/portfolio/projects/thumbs/chicken-livers-large.jpg',
        },
        webp: {
            small: 'img/content/portfolio/projects/thumbs/chicken-livers-small.webp',
            medium: 'img/content/portfolio/projects/thumbs/chicken-livers-medium.webp',
            large: 'img/content/portfolio/projects/thumbs/chicken-livers-large.webp',
        },
    },
    link: 'portfolio-single.html',
    categories: [ 'lunch' ],
}];

// --------------------------- END MODULE VARIABLES ---------------------------

// -------------------------- BEGIN UTILITY FUNCTIONS -------------------------

/**
 * Simulate AJAX request to retrieve more items.
 * Replace this function with actual code.
 * 
 * @return {JQuery.Promise} The promise which resolves when the items are loaded
 */
function loadFakeItems() {
    const $d = new $.Deferred();

    setTimeout(() => {
        $d.resolve({
            items: fakeItems,
            more: false,
        }); 
    }, FAKE_LOAD_TIME);

    return $d.promise();
}

// --------------------------- END UTILITY FUNCTIONS --------------------------

// --------------------------- BEGIN EVENT HANDLERS ---------------------------

/**
 * Handle the filter change event.
 * 
 * @param {JQuery.Event} e The event object
 * @param {string} filter The name of the selected category
 */
function handleFilterChange(filter) {
    if (activeFilter !== filter) {
        activeFilter = filter;

        PortfolioFilter.setFilter(filter);
        PortfolioGrid.setFilter(filter);
    }
}

/**
 * Handle more button click event.
 */
function handleMoreBtnClick() {
    const { $grid, $moreBtn } = elements;

    $grid.attr('aria-busy', 'true');

    // Show a loader
    const $loader = $('<div></div>')
        .addClass(CLASSES.LOADER)
        .insertAfter($moreBtn);

    // Hide the button
    $moreBtn.addClass(CLASSES.MORE_HIDDEN);

    loadFakeItems()
        .then((data) => {
            PortfolioGrid.addItems(data.items);

            // If there are more items available, show the button again
            if (data.more) {
                $moreBtn.removeClass(CLASSES.MORE_HIDDEN);
            }
        })
        .fail(() => {
            // Display an error message
            $('<div></div>')
                .addClass(CLASSES.ERROR)
                .text('An error occured')
                .insertAfter($loader);
        })
        .always(() => {
            $grid.attr('aria-busy', 'false');
            $loader.remove();
        });
}

/**
 * Respond to window resize event.
 */
function handleWindowResize() {
    const screenWidth = $(window).outerWidth() / getEmSize($('.page'));
    
    // Switch listbox orientation to vertical on mobile and to horizontal on
    // larger screens.
    if (!isMobile && (screenWidth < MEDIUM_BREAKPOINT)) {
        isMobile = true;

        PortfolioFilter.setDropdownMode(true);
    } else if (isMobile && (screenWidth >= MEDIUM_BREAKPOINT)) {
        isMobile = false;

        PortfolioFilter.setDropdownMode(false);
    }
}

// ---------------------------- END EVENT HANDLERS ----------------------------

// --------------------------- BEGIN PRIVATE METHODS --------------------------

/**
 * Initialize the portfolio block.
 */
function initBlock() {
    const $portfolio = $(SELECTORS.BLOCK);
    if ($portfolio.length == 0) {
        return;
    }

    elements.$portfolio = $portfolio;
    elements.$grid = $(SELECTORS.GRID, $portfolio);
    elements.$moreBtn = $(SELECTORS.MORE, $portfolio);

    // Initialize child blocks
    PortfolioFilter.initBlock({ onChange: handleFilterChange });
    PortfolioGrid.initBlock({ onCatLinkClick: handleFilterChange });

    elements.$moreBtn.click(handleMoreBtnClick);

    $(window).resize(debounce(handleWindowResize, RESIZE_INTERVAL));

    // Process initial window size
    handleWindowResize();
}

// ---------------------------- END PRIVATE METHODS ---------------------------

initBlock();
