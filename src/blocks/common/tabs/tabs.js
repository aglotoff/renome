const TRANSITION_DURATION = 250;

$('.tabs').each(function() {
    const $tabs = $(this);

    let isSwitching = false;

    $tabs.on('click', '.tabs__link', function(event) {
        event.preventDefault();

        if (isSwitching || $(this).hasClass('tabs__link_active')) {
            return;
        }

        isSwitching = true;

        const $targetPane = $($(this).attr('href'));

        const $activeLink = $('.tabs__link_active', $tabs);
        $activeLink.removeClass('tabs__link_active');
        $(this).addClass('tabs__link_active');

        const $activePane = $('.tabs__pane_active', $tabs);
        $activePane.addClass('tabs__pane_hidden');

        setTimeout(() => {
            $activePane.removeClass('tabs__pane_active');
            $targetPane.removeClass('tabs__pane_hidden');
            $targetPane.addClass('tabs__pane_active');

            isSwitching = false;
        }, TRANSITION_DURATION);
    });
});
