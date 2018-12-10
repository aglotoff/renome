/**
 * @file Implementation of the tabs block
 * @author Andrey Glotov
 */

// -------------------------- BEGIN MODULE VARIABLES --------------------------
const TRANSITION_DURATION = 250;

class Tabs {
    constructor($elem) {
        this.$elem        = $elem;
        this.$activeLink  = $('.tabs__link_active',  $elem);
        this.$activePanel = $('.tabs__panel_active', $elem);
        this.isSwitching  = false;

        $elem.on('click', '.tabs__link', this.onLinkClick.bind(this));
    }

    activateTab($link) {
        const panelId = $link.attr('href');
        const $panel  = $(panelId, this.$elem);
        if ($panel.length === 0) {
            return;
        }

        this.isSwitching = true;

        this.$activeLink
            .removeClass('tabs__link_active')
            .attr('aria-selected', 'false');
        this.$activeLink = $link
            .addClass('tabs__link_active')
            .attr('aria-selected', 'true');

        this.$activePanel.fadeOut(TRANSITION_DURATION, () => {
            this.$activePanel.removeClass('tabs__panel_active');
            this.$activePanel = $panel
                .fadeIn(TRANSITION_DURATION)
                .addClass('tabs__panel_active');

            this.isSwitching = false;
        });
    }

    onLinkClick(event) {
        event.preventDefault();

        const $link = $(event.target);
        if (this.isSwitching || ($link.is(this.$activeLink))) {
            return;
        }

        this.activateTab($link);
    }
}
// --------------------------- END MODULE VARIABLES ---------------------------

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
/**
 * Initialize the tabs module.
 * @return true
 */
export const initModule = function() {
    $('.tabs').each(function() {
        new Tabs($(this));
    });

    return true;
};
// ---------------------------- END PUBLIC METHODS ----------------------------
