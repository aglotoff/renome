/**
 * Portfolio Grid Block
 */
/* global Shuffle */
$('.portfolio-grid').each(function() {
    const $container = $('.portfolio-grid__inner', this);
    const $sizer = $('.portfolio-grid__sizer', this);

    const $template = $('.portfolio-grid__item_template')
        .remove()
        .removeClass('portfolio-grid__item_template');

    const shuffleInstance = new Shuffle($container.get(0), {
        itemSelector: '.portfolio-grid__item',
        sizer: $sizer.get(0),
    });

    $('.portfolio-layout').on('filter', function(event, filter) {
        shuffleInstance.filter(filter);
    });

    $('.portfolio-layout').on('itemsLoaded', function(event, items) {
        shuffleInstance.add(items.map((item) => {
            const $newItem = $template
                .clone()
                .attr('data-groups', `["${item.categories.join('","')}"]`);

            $('.portfolio-grid__link', $newItem)
                .text(item.title)
                .attr('href', item.link);
            $('.portfolio-grid__img', $newItem).attr({
                src: item.image,
                alt: item.title,
            });
            $('.portfolio-grid__cats', $newItem)
                .append(item.categories.map((cat) => {
                    return $('<li></li>')
                        .addClass('portfolio-grid__cat')
                        .text(cat)
                        .attr('data-filter', cat.toLowerCase());
                }));
            
            $newItem.insertBefore($sizer);
            
            return $newItem.get(0);
        }));
    });

    $(this).on('click', '.portfolio-grid__cat', function() {
        $('.portfolio-layout').trigger('filter', $(this).data('filter'));
    });
});
