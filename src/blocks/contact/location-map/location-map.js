/**
 * @file Implementation of the location map block
 * @author Andrey Glotov
 */

/* global L */

// -------------------------- BEGIN MODULE VARIABLES --------------------------

const markerIcon = L.icon({
    iconUrl: 'img/map-marker.png',
    iconSize: [35, 53], 
    iconAnchor: [18, 53],
});

// --------------------------- END MODULE VARIABLES ---------------------------

// --------------------------- BEGIN PUBLIC METHODS ---------------------------

/**
 * Initialize the the location map module.
 * 
 * @param {JQuery} $root The block root node
 */
function initBlock($root) {
    const { latlng, zoom } = $root.data('map');

    const $container = $('.location-map__container', $root);

    const map = L.map($container.get(0), {
        scrollWheelZoom: false,
    }).setView(latlng, zoom);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
    }).addTo(map);

    L.marker(latlng, {
        icon: markerIcon
    }).addTo(map);

    map.on('focus', function handleMapFocus() {
        map.scrollWheelZoom.enable();
    });
    map.on('blur', function handleMapBlur() {
        map.scrollWheelZoom.disable();
    });
}

/**
 * Initialize all location map blocks on the page.
 */
function initAll() {
    $('.location-map').each(function() {
        initBlock($(this));
    });
}

// ---------------------------- END PUBLIC METHODS ----------------------------

export default {
    initBlock,
    initAll,
};
