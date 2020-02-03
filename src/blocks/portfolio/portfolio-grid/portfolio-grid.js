/**
 * @file Implementation of the portfolio grid block
 * @author Andrey Glotov
 */

import Shuffle from 'shufflejs';

// -------------------------- BEGIN MODULE VARIABLES --------------------------

// Block name
const BLOCK = 'portfolio-grid';

// Element selectors
const SELECTORS = {
    BLOCK: `.${BLOCK}`,
    CONTAINER: `.${BLOCK}__container`,
    LINK: `.${BLOCK}__link`,
    IMG: `.${BLOCK}__img`,
    SOURCE_WEBP: 'source[type="image/webp"]',
    SOURCE_JPEG: 'source[type="image/jpeg"]',
    CATS: `.${BLOCK}__cats`,
    ITEM: `.${BLOCK}__item`,
    SIZER: `.${BLOCK}__sizer`,
    CAT_LINK: `.${BLOCK}__cat-link`,
    OVERLAY: `.${BLOCK}__overlay`,
};

// Element class names
const CLASSES = {
    ITEM: `${BLOCK}__item`,
    ITEM_INNER: `${BLOCK}__item-inner`,
    IMG: `${BLOCK}__img`,
    OVERLAY: `${BLOCK}__overlay`,
    TITLE: `${BLOCK}__title`,
    LINK: `${BLOCK}__link`,
    CATS: `${BLOCK}__cats`,
    CAT_ITEM: `${BLOCK}__cat-item`,
    CAT_LINK: `${BLOCK}__cat-link`,
    OVERLAY_FOCUS: `${BLOCK}__overlay_has-focus`,
};

// JQuery elements map
const elements = {};

// Block configuration
const config = {
    // Template markup for portfolio items
    itemHtml: `
<article class="${CLASSES.ITEM}">
    <div class="${CLASSES.ITEM_INNER}">
        <picture>
            <source type="image/webp"></source>
            <source type="image/jpeg"></source>
            <img class="${CLASSES.IMG}" />
        </picture>
        <div class="${CLASSES.OVERLAY}">
            <h2 class="${CLASSES.TITLE}">
                <a class="${CLASSES.LINK}"></a>
            </h2>
            <ul class="${CLASSES.CATS}"></ul>
        </div>
    </div>
</article>
`
};

// Block state
const state = {
    shuffleInstance: null,
};

// --------------------------- END MODULE VARIABLES ---------------------------

// ----------------------------- BEGIN DOM METHODS ----------------------------

/**
 * Create markup for the new portfolio item and add it to the grid.
 * 
 * @param {object} data item data
 */
function createPortfolioItem(data) {
    const $item = $(config.itemHtml);

    $item.attr('data-groups', `["${data.categories.join('","')}"]`);
    
    $(SELECTORS.LINK, $item)
        .text(data.title)
        .attr('href', data.link);

    const $img = $(SELECTORS.IMG, $item)
        .attr({
            src : data.images.jpeg.small,
            alt : data.title,
        });

    $img.prev(SELECTORS.SOURCE_WEBP).attr('srcset', `
        ${data.images.webp.small} 1x,
        ${data.images.webp.medium} 1.5x,
        ${data.images.webp.large} 2x
    `);

    $img.prev(SELECTORS.SOURCE_JPEG).attr('srcset', `
        ${data.images.jpeg.small} 1x,
        ${data.images.jpeg.medium} 1.5x,
        ${data.images.jpeg.large} 2x
    `);

    $(SELECTORS.CATS, $item).append(data.categories.map((cat) => {
        return $('<li></li>')
            .addClass(CLASSES.CAT_ITEM)
            .append($('<a></a>')
                .addClass(CLASSES.CAT_LINK)
                .attr({
                    'href': 'javascript:void(0)',
                    'role': 'button',
                    'data-filter': cat.toLowerCase(),
                })
                .text(cat));
    }));

    const $d = new $.Deferred();

    $img.on('load', function() {
        $d.resolve($item);
    });

    return $d.promise();
}

// ------------------------------ END DOM METHODS -----------------------------

// --------------------------- BEGIN PUBLIC METHODS ---------------------------

/**
 * Initialize the portfolio grid block.
 * 
 * @param {function} props.onCatLinkClick Category link click event handler
 */
export function initBlock({ onCatLinkClick }) {
    const $root = $(SELECTORS.BLOCK);
    const $container = $(SELECTORS.CONTAINER, $root);
    const $sizer = $(SELECTORS.SIZER, $container);

    state.shuffleInstance = new Shuffle($container.get(0), {
        itemSelector: SELECTORS.ITEM,
        sizer: $sizer.get(0),
    });

    $container
        .on('click', SELECTORS.CAT_LINK, function handleCatLinkClick() {
            onCatLinkClick($(this).data('filter'));
        })
        // Until all major browsers support the :focus-within CSS pseudo-class
        // apply a focus class using JavaScript
        .on({
            focusin: function handleItemFocusin() {
                $(this).addClass(CLASSES.OVERLAY_FOCUS);
            },
            focusout: function handleItemFocusout() {
                $(this).removeClass(CLASSES.OVERLAY_FOCUS);
            },
        }, SELECTORS.OVERLAY);

    elements.$root = $root;
    elements.$container = $container;
    elements.$sizer = $sizer;
}

/**
 * Apply a filter
 * 
 * @param {string} filter - The filter to be applied
 */
export function setFilter(filter) {
    state.shuffleInstance.filter(filter);
}

/**
 * Add new portfolio items
 * 
 * @param {Array} items - the items to be added
 */
export function addItems(items) {
    $.when(...items.map(createPortfolioItem)).then(function(...items) {
        elements.$sizer.before(items);
        state.shuffleInstance.add(items.map(($item) => $item.get(0)));
    });
}

// ---------------------------- END PUBLIC METHODS ----------------------------
