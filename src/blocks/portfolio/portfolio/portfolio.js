/**
 * @file Implementation of the portfolio block
 * @author Andrey Glotov
 */

import * as PortfolioFilter from '../portfolio-filter/portfolio-filter';
import * as PortfolioGrid   from '../portfolio-grid/portfolio-grid';

// -------------------------- BEGIN MODULE VARIABLES --------------------------
const MEDIUM_BREAKPOINT = 768;
const FAKE_LOAD_TIME    = 1000;

let $portfolio, $grid, $moreBtn;

let activeFilter   = 'all';
let verticalLayout = true;

const fakeItems = [{
    title: 'Apple pie',
    image: 'img/content/portfolio/projects/thumbs/apple-pie.jpg',
    link: 'portfolio-single.html',
    categories: ['desserts'],
}, {
    title: 'Fresh fruit cocktail',
    image: 'img/content/portfolio/projects/thumbs/fresh-fruit-cocktail.jpg',
    link: 'portfolio-single.html',
    categories: ['drinks'],
}, {
    title: 'Green tea',
    image: 'img/content/portfolio/projects/thumbs/green-tea.jpg',
    link: 'portfolio-single.html',
    categories: ['drinks'],
}, {
    title: 'Waffles with coffee',
    image: 'img/content/portfolio/projects/thumbs/waffles-with-coffee.jpg',
    link: 'portfolio-single.html',
    categories: ['desserts', 'drinks'],
}, {
    title: 'Chicken livers',
    image: 'img/content/portfolio/projects/thumbs/chicken-livers.jpg',
    link: 'portfolio-single.html',
    categories: ['lunch'],
}];
// --------------------------- END MODULE VARIABLES ---------------------------

// -------------------------- BEGIN UTILITY FUNCTIONS -------------------------
const loadFakeItems = function() {
    const $d = new $.Deferred();

    setTimeout(() => {
        $d.resolve({
            items : fakeItems,
            more  : false,
        }); 
    }, FAKE_LOAD_TIME);

    return $d.promise();
};

const loadImage = function(src) {
    const $d = new $.Deferred();

    const image = new Image();
    $(image).on('load', function() {
        $d.resolve();
    });
    image.src = src;

    return $d.promise();
};
// --------------------------- END UTILITY FUNCTIONS --------------------------

// --------------------------- BEGIN EVENT HANDLERS ---------------------------
const onFilterChange = function(event, filter) {
    if (activeFilter !== filter) {
        activeFilter = filter;

        PortfolioFilter.setFilter(filter);
        PortfolioGrid.setFilter(filter);
    }
};

const onMoreBtnClick = function() {
    $grid.attr('aria-busy', 'true');

    // Show a loader
    const $loader = $('<div></div>')
        .addClass('loader loader_size_l portfolio__loader')
        .insertAfter($moreBtn);

    // Hide the button
    $moreBtn.addClass('portfolio__more-btn_hidden');

    let data;

    loadFakeItems()
        .then(function onItemsLoaded(response) {
            data = response;

            // Wait until all images are loaded 
            return $.when(...response.items.map(function(item) {
                return loadImage(item.image);
            }));
        })
        .then(function onImagesLoaded() {
            $grid.attr('aria-busy', 'false');

            PortfolioGrid.addItems(data.items);

            // If there are more items available, show the button again
            if (data.more) {
                $moreBtn.removeClass('portfolio__more-btn_hidden');
            }
        })
        .fail(function onFail() {
            // Display an error message
            const $error = $('<div></div>')
                .addClass('error portfolio__error')
                .text('An error occured');
            $error.insertAfter($loader);
        })
        .always(function onLoadFail() {
            // Hide the loader
            $loader.remove();
        });
};
// ---------------------------- END EVENT HANDLERS ----------------------------

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
/**
 * Initialize the portfolio module.
 * @return true if the portfolio block is present, false otherwise
 */
export const initModule = function() {
    $portfolio = $('.portfolio');
    if ($portfolio.length === 0) {
        return false;
    }

    $grid    = $portfolio.find('.portfolio__grid');
    $moreBtn = $portfolio.find('.portfolio__more-btn');

    PortfolioFilter.initModule();
    PortfolioGrid.initModule();

    $portfolio.on('filter', onFilterChange);

    $moreBtn.click(onMoreBtnClick);

    return true;
};

/**
 * Respond to window resize event.
 */
export const handleResize = function() {
    if ($portfolio.length === 0) {
        return;
    }

    const screenWidth = $(window).outerWidth();
    
    // Switch listbox orientation to vertical on mobile and to horizontal on
    // larger screens.
    if (!verticalLayout && (screenWidth < MEDIUM_BREAKPOINT)) {
        verticalLayout = true;

        PortfolioFilter.setOrientation('vertical');
    } else if (verticalLayout && (screenWidth >= MEDIUM_BREAKPOINT)) {
        verticalLayout = false;

        PortfolioFilter.setOrientation('horizontal');
    }
};
// ---------------------------- END PUBLIC METHODS ----------------------------