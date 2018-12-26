/**
 * @file Implementation of the portfolio grid block
 * @author Andrey Glotov
 */

/* global Shuffle */

// -------------------------- BEGIN MODULE VARIABLES --------------------------
const itemHtml = `
<div class="portfolio-grid__item">
    <div class="portfolio-grid__item-inner">
        <img class="portfolio-grid__img" />
        <div class="portfolio-grid__text">
            <h2 class="portfolio-grid__title">
                <a class="portfolio-grid__link"></a>
            </h2>
            <ul class="portfolio-grid__cats">
            </ul>
        </div>
    </div>
</div>
`;

let shuffleInstance = null;

let $portfolio, $grid, $container, $sizer;
// --------------------------- END MODULE VARIABLES ---------------------------

// -------------------------- BEGIN UTILITY FUNCTIONS -------------------------
const createPortfolioItem = function(data) {
    const $item = $(itemHtml);

    $item.attr('data-groups', `["${data.categories.join('","')}"]`);
    
    $item.find('.portfolio-grid__link')
        .text(data.title)
        .attr('href', data.link);

    $item.find('.portfolio-grid__img')
        .attr({
            src : data.image,
            alt : data.title,
        });

    const $categories = data.categories.map(function(cat) {
        const $catItem = $('<li></li>')
            .addClass('portfolio-grid__cat-item');

        const $catLink = $('<a></a>')
            .addClass('portfolio-grid__cat-link')
            .attr({
                'href'        : 'javascript:void(0)',
                'role'        : 'button',
                'data-filter' : cat.toLowerCase(),
            })
            .text(cat);
        
        $catItem.append($catLink);
        return $catItem;
    });

    $item.find('.portfolio-grid__cats').append($categories);

    return $item;
};
// --------------------------- END UTILITY FUNCTIONS --------------------------

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
/**
 * Initialize the portfolio grid module.
 * @return true
 */
export const initModule = function() {
    $portfolio = $('.portfolio');

    $grid      = $('.portfolio-grid');
    $container = $grid.find('.portfolio-grid__inner');
    $sizer     = $container.find('.portfolio-grid__sizer');

    shuffleInstance = new Shuffle($container.get(0), {
        itemSelector : '.portfolio-grid__item',
        sizer        : $sizer.get(0),
    });

    $container
        .on('click', '.portfolio-grid__cat-link', function onCatLinkClick() {
            $portfolio.trigger('filter', $(this).data('filter'));
        })
        // Until all major browsers support the :focus-within CSS pseudo-class
        // apply a class using JavaScript
        .on('focusin', '.portfolio-grid__text', function onItemFocusin() {
            $(this).addClass('.portfolio-grid__text_has-focus');
        })
        .on('focusout', '.portfolio-grid__text', function onItemFocusout() {
            $(this).removeClass('.portfolio-grid__text_has-focus');
        });
};

/**
 * Apply a filter.
 * @param {string} filter - The filter to be applied
 */
export const setFilter = function(filter) {
    shuffleInstance.filter(filter);
};

/**
 * Add new items
 * @param {Array} items - the items to be added
 */
export const addItems = function(items) {
    const newItems = $.map(items, createPortfolioItem);
    
    newItems.forEach(($item) => $item.insertBefore($sizer));

    shuffleInstance.add(newItems.map(($item) => $item.get(0)));
};
// ---------------------------- END PUBLIC METHODS ----------------------------
