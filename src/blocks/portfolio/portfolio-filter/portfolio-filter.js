/**
 * Portfolio Filter Block
 */
$('.portfolio-filter')
    .on('click', '.portfolio-filter__btn', function() {
        $('.portfolio-layout').trigger('filter', $(this).data('filter'));
    })
    .on('click', '.portfolio-filter__toggle', function() {
        $('.portfolio-filter__list')
            .addClass('portfolio-filter__list_visible');
        
        setTimeout(() => {
            $(document).one('click', function() {
                $('.portfolio-filter__list')
                    .removeClass('portfolio-filter__list_visible');
            });
        }, 0);
    });

$('.portfolio-layout').on('filter', function(event, filter) {
    $('.portfolio-filter__btn_active')
        .removeClass('portfolio-filter__btn_active');
    
    $('.portfolio-filter__btn[data-filter="' + filter + '"]')
        .addClass('portfolio-filter__btn_active');
});
