/**
 * @file Implementation of the portfolio grid block
 * @author Andrey Glotov
 */

/* global Shuffle */

// -------------------------- BEGIN MODULE VARIABLES --------------------------

const BLOCK = 'portfolio-grid';

const ClassNames = {
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

const Selectors = {
    ROOT: `.${BLOCK}`,
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

// Template markup for portfolio items
const itemHtml = `
<article class="${ClassNames.ITEM}">
    <div class="${ClassNames.ITEM_INNER}">
        <picture>
            <source type="image/webp"></source>
            <source type="image/jpeg"></source>
            <img class="${ClassNames.IMG}" />
        </picture>
        <div class="${ClassNames.OVERLAY}">
            <h2 class="${ClassNames.TITLE}">
                <a class="${ClassNames.LINK}"></a>
            </h2>
            <ul class="${ClassNames.CATS}"></ul>
        </div>
    </div>
</article>
`;

// JQuery elements map
const elements = {};

let shuffleInstance = null;

// --------------------------- END MODULE VARIABLES ---------------------------

// ----------------------------- BEGIN DOM METHODS ----------------------------

function createPortfolioItem(data) {
    const $item = $(itemHtml);

    $item.attr('data-groups', `["${data.categories.join('","')}"]`);
    
    $(Selectors.LINK, $item)
        .text(data.title)
        .attr('href', data.link);

    const $img = $(Selectors.IMG, $item)
        .attr({
            src : data.images.jpeg.small,
            alt : data.title,
        });

    $img.prev(Selectors.SOURCE_WEBP).attr('srcset', `
        ${data.images.webp.small} 1x,
        ${data.images.webp.medium} 1.5x,
        ${data.images.webp.large} 2x
    `);

    $img.prev(Selectors.SOURCE_JPEG).attr('srcset', `
        ${data.images.jpeg.small} 1x,
        ${data.images.jpeg.medium} 1.5x,
        ${data.images.jpeg.large} 2x
    `);

    $(Selectors.CATS, $item).append(data.categories.map((cat) => {
        return $('<li></li>')
            .addClass(ClassNames.CAT_ITEM)
            .append($('<a></a>')
                .addClass(ClassNames.CAT_LINK)
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
 * Initialize the portfolio grid module.
 * @return true
 */
export function initBlock({ onCatLinkClick }) {
    const $grid = $(Selectors.ROOT);
    const $container = $(Selectors.CONTAINER, $grid);
    const $sizer = $(Selectors.SIZER, $container);

    shuffleInstance = new Shuffle($container.get(0), {
        itemSelector: Selectors.ITEM,
        sizer: $sizer.get(0),
    });

    $container
        .on('click', Selectors.CAT_LINK, function handleCatLinkClick() {
            onCatLinkClick($(this).data('filter'));
        })
        // Until all major browsers support the :focus-within CSS pseudo-class
        // apply a class using JavaScript
        .on({
            focusin: function handleItemFocusin() {
                $(this).addClass(ClassNames.OVERLAY_FOCUS);
            },
            focusout: function handleItemFocusout() {
                $(this).removeClass(ClassNames.OVERLAY_FOCUS);
            },
        }, Selectors.OVERLAY);

    elements.$sizer = $sizer;
}

/**
 * Apply a filter.
 * @param {string} filter - The filter to be applied
 */
export function setFilter(filter) {
    shuffleInstance.filter(filter);
}

/**
 * Add new items
 * @param {Array} items - the items to be added
 */
export function addItems(items) {
    $.when(...items.map(createPortfolioItem)).then(function(...items) {
        elements.$sizer.before(items);

        shuffleInstance.add(items.map(($item) => $item.get(0)));
    });
}

// ---------------------------- END PUBLIC METHODS ----------------------------
