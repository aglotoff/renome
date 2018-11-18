const FAKE_LOAD_TIME = 1000;

const fakeItems = [{
    title: 'Apple pie',
    image: 'img/content/portfolio/projects/thumbs/apple-pie.jpg',
    link: 'portfolio-single.html',
    categories: ['desserts'],
}, {
    title: 'Fresh fruit cocktail',
    image: 'img/content/portfolio/projects/thumbs/fresh-fruit-cocktail.jpg',
    link: 'portfolio-single.html',
    categories: ['drinks'],
}, {
    title: 'Green tea',
    image: 'img/content/portfolio/projects/thumbs/green-tea.jpg',
    link: 'portfolio-single.html',
    categories: ['drinks'],
}, {
    title: 'Waffles with coffee',
    image: 'img/content/portfolio/projects/thumbs/waffles-with-coffee.jpg',
    link: 'portfolio-single.html',
    categories: ['desserts', 'drinks'],
}, {
    title: 'Chicken livers',
    image: 'img/content/portfolio/projects/thumbs/chicken-livers.jpg',
    link: 'portfolio-single.html',
    categories: ['lunch'],
}];

function loadMoreItems(callback) {
    setTimeout(() => {
        callback({
            items: fakeItems,
            more: false,
        });
    }, FAKE_LOAD_TIME);
}

$('.portfolio-more__btn').click(function() {
    const $loader = $('<div></div>')
        .addClass('loader loader_size_l portfolio-more__loader')
        .insertAfter($(this));

    $(this).addClass('portfolio-more__btn_hidden');

    loadMoreItems((response) => {
        let loadsInProgress = response.items.length;

        const imageLoaded = () => {
            if (--loadsInProgress > 0) {
                return;
            }

            $loader.remove();
            
            if (response.more) {
                $(this).removeClass('portfolio-more__btn_hidden');
            }

            $('.portfolio-layout').trigger('itemsLoaded', [response.items]);
        };

        response.items.forEach((item) => {
            const newImage = new Image();
            $(newImage).on('load', imageLoaded);
            newImage.src = item.image;
        });
    });
});
