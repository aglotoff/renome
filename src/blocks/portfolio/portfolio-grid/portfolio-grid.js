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
 * @return true;
 */
export const initModule = function() {
    const $portfolio = $('.portfolio');
    if ($portfolio.length === 0) {
        return false;
    }

    const $grid      = $('.portfolio-grid');
    const $container = $grid.find('.portfolio-grid__inner');
    const $sizer     = $container.find('.portfolio-grid__sizer');

    const shuffleInstance = new Shuffle($container.get(0), {
        itemSelector : '.portfolio-grid__item',
        sizer        : $sizer.get(0),
    });

    $portfolio.on({
        itemsLoaded : function onPortfolioItemsLoaded(event, items) {
            const newItems = $.map(items, createPortfolioItem);
            
            newItems.forEach(($item) => $item.insertBefore($sizer));
            shuffleInstance.add(newItems.map(($item) => $item.get(0)));
        },

        filter      : function onPortfolioFilter(event, filter) {
            shuffleInstance.filter(filter);
        }
    });

    $container
        .on('click', '.portfolio-grid__cat-link', function onCatClick() {
            $portfolio.trigger('filter', $(this).data('filter'));
        })
        .on('focusin', '.portfolio-grid__text', function onItemFocusin() {
            $(this).addClass('.portfolio-grid__text_has-focus');
        })
        .on('focusout', '.portfolio-grid__text', function onItemFocusout() {
            $(this).removeClass('.portfolio-grid__text_has-focus');
        });
};
// ---------------------------- END PUBLIC METHODS ----------------------------
