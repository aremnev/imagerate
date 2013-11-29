/******************************************************************/
$(function() {
    var left = {
        imgFront	: -450,
        imgBack		: -350,
        h3			: -300,
        p			: -275,
        a			: -200
    }
    var current = {
        imgFront	: 30,
        imgBack		: 300,
        h3			: 675,
        p			: 675,
        a			: 700
    }
    var right = {
        imgFront	: 990,
        imgBack		: 990,
        h3			: 990,
        p			: 990,
        a			: 990
    }

    var isScrolling = false;

    $('#carousel').carouFredSel({
        scroll	: {
            duration		: 0,
            timeoutDuration	: 3000
        },
        auto	: false,
        prev	: {
            button		: '#prev',
            conditions	: function() {
                return (!isScrolling);
            },
            onBefore	: function( data ) {
                isScrolling = true;

                $(this).delay(900);

                data.items.old.find('img.img-front')
                    .delay(400)
                    .animate({
                        left: right.imgFront
                    });

                data.items.old.find('img.img-back')
                    .delay(300)
                    .animate({
                        left: right.imgBack
                    });

                data.items.old.find('h3')
                    .delay(200)
                    .animate({
                        left: right.h3
                    });

                data.items.old.find('p')
                    .delay(100)
                    .animate({
                        left: right.p
                    });

                data.items.old.find('a')
                    .animate({
                        left: right.a
                    });
            },
            onAfter: function( data ) {
                data.items.old.find('img.img-front')
                    .css({
                        left: current.imgFront
                    });

                data.items.old.find('img.img-back')
                    .css({
                        left: current.imgBack
                    });

                data.items.old.find('h3')
                    .animate({
                        left: current.h3
                    });

                data.items.old.find('p')
                    .css({
                        left: current.p
                    });

                data.items.old.find('a')
                    .css({
                        left: current.a
                    });

                data.items.visible.find('img.img-front')
                    .css({
                        left: left.imgFront
                    }).delay(400)
                    .animate({
                        left: current.imgFront
                    }, function() {
                        isScrolling = false;
                    });

                data.items.visible.find('img.img-back')
                    .css({
                        left: left.imgBack
                    }).delay(300)
                    .animate({
                        left: current.imgBack
                    });

                data.items.visible.find('h3')
                    .css({
                        left: left.h3
                    }).delay(200)
                    .animate({
                        left: current.h3
                    });

                data.items.visible.find('p')
                    .css({
                        left: left.p
                    }).delay(100)
                    .animate({
                        left: current.p
                    });

                data.items.visible.find('a')
                    .css({
                        left: left.a
                    })
                    .animate({
                        left: current.a
                    });
            }
        },
        next	: {
            button		: '#next',
            conditions	: function() {
                return (!isScrolling);
            },
            onBefore	: function( data ) {
                isScrolling = true;

                $(this).delay(900);	//	delay the onafter

                data.items.old.find('img.img-front')
                    .animate({
                        left: left.imgFront
                    });

                data.items.old.find('img.img-back')
                    .delay(100)
                    .animate({
                        left: left.imgBack
                    });

                data.items.old.find('h3')
                    .delay(200)
                    .animate({
                        left: left.h3
                    });

                data.items.old.find('p')
                    .delay(300)
                    .animate({
                        left: left.p
                    });

                data.items.old.find('a')
                    .delay(400)
                    .animate({
                        left: left.a
                    });
            },
            onAfter: function( data ) {
                data.items.old.find('img.img-front')
                    .css({
                        left: current.imgFront
                    });

                data.items.old.find('img.img-back')
                    .css({
                        left: current.imgBack
                    });

                data.items.old.find('h3')
                    .animate({
                        left: current.h3
                    });

                data.items.old.find('p')
                    .css({
                        left: current.p
                    });

                data.items.old.find('a')
                    .css({
                        left: current.a
                    });

                data.items.visible.find('img.img-front')
                    .css({
                        left: right.imgFront
                    })
                    .animate({
                        left: current.imgFront
                    });

                data.items.visible.find('img.img-back')
                    .css({
                        left: right.imgBack
                    }).delay(100)
                    .animate({
                        left: current.imgBack
                    });

                data.items.visible.find('h3')
                    .css({
                        left: right.h3
                    }).delay(200)
                    .animate({
                        left: current.h3
                    });

                data.items.visible.find('p')
                    .css({
                        left: right.p
                    }).delay(300)
                    .animate({
                        left: current.p
                    });

                data.items.visible.find('a')
                    .css({
                        left: right.a
                    }).delay(400)
                    .animate({
                        left: current.a
                    }, function() {
                        isScrolling = false;
                    });
            }
        }
    });
});