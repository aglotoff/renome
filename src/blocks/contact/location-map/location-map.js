/**
 * @file Implementation of the location map block
 * @author Andrey Glotov
 */

import L from 'leaflet';

// -------------------------- BEGIN MODULE VARIABLES --------------------------

// Block name
const BLOCK = 'location-map';

// Element selectors
const SELECTORS = {
    BLOCK: `.${BLOCK}`,
    CONTAINER: `.${BLOCK}__container`,
};

const markerIcon = L.icon({
    iconUrl: 'img/map-marker.svg',
    iconSize: [ 35, 53 ], 
    iconAnchor: [ 18, 53 ],
});

// --------------------------- END MODULE VARIABLES ---------------------------

// -------------------------- BEGIN CLASS DEFINITION -------------------------- 

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

        const $container = $(SELECTORS.CONTAINER, $root);

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

        map.on('focus', this.handleMapFocus.bind(this));
        map.on('blur', this.handleMapBlur.bind(this));

        this.map = map;
    }

    // -------------------------- BEGIN EVENT HANDLERS ------------------------

    /**
     * Handle map focus event
     */
    handleMapFocus() {
        this.map.scrollWheelZoom.enable();
    }

    /**
     * Handle map blur event
     */
    handleMapBlur() {
        this.map.scrollWheelZoom.disable();
    }

    // --------------------------- END EVENT HANDLERS -------------------------
}

// --------------------------- END CLASS DEFINITION --------------------------- 

// Initialize all location map blocks on the page
$(SELECTORS.BLOCK).each(function() {
    new LocationMap($(this));
});

export default LocationMap;
