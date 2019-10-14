/**
 * @file Implementation of the location map block
 * @author Andrey Glotov
 */

/* global L */

// ------------------------------ BEGIN CONSTANTS -----------------------------

const markerIcon = L.icon({
    iconUrl: 'img/map-marker.svg',
    iconSize: [35, 53], 
    iconAnchor: [18, 53],
});

// ------------------------------- END CONSTANTS ------------------------------

/**
 * Location Map block implementation.
 */
class LocationMap {

    /**
     * Create location map
     * 
     * @param {JQuery} $root The root element
     */
    constructor($root) {
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

        map.on('focus', this._handleMapFocus.bind(this));
        map.on('blur', this._handleMapBlur.bind(this));

        this._map = map;
    }

    // -------------------------- BEGIN EVENT HANDLERS ------------------------

    _handleMapFocus() {
        this._map.scrollWheelZoom.enable();
    }

    _handleMapBlur() {
        this._map.scrollWheelZoom.disable();
    }

    // --------------------------- END EVENT HANDLERS -------------------------

    // -------------------------- BEGIN PUBLIC METHODS ------------------------

    /**
     * Initialize all location map blocks on the page.
     */
    static initAll() {
        $('.location-map').each(function() {
            new LocationMap($(this));
        });
    }

    // --------------------------- END PUBLIC METHODS -------------------------
}

LocationMap.initAll();

export default LocationMap;
