var RatingController = function(thumbnailSelector, ratingSelector) {
    this.thumbnailSelector = thumbnailSelector;
    this.ratingSelector = thumbnailSelector + ratingSelector;
    this.starSelector = this.ratingSelector + ' span';
    this.bindEvents();
};
RatingController.prototype = {
    constructor: RatingController,

    fillStarsToThis: function ($star) {
        $star.prevUntil().andSelf().text('★');
        $star.nextUntil().text('☆');
    },
    restoreRating: function ($ratingDiv) {
        var $star = $ratingDiv.find('span').eq($ratingDiv.data('rating') - 1);
        this.fillStarsToThis($star);
    },
    rateThisImage: function ($star) {
        var $image = $star.closest(this.thumbnailSelector);
        var imageId = $image.data('imageId');
        var rate = $star.data('rate');
        $.ajax({
            type: 'post',
            url: ['/images', imageId, 'rate', rate].join('/')
        }).success(function(data) {
            //console.log(data);
        });
    },
    bindEvents: function() {
        var self = this;
        var $doc = $(document);

        $doc.on('mouseenter', this.starSelector, function() {
            var $star = $(this);
            self.fillStarsToThis($star);
        });

        $doc.on('mouseleave', this.ratingSelector, function() {
            var $ratingDiv = $(this);
            self.restoreRating($ratingDiv);
        });

        $doc.on('click', this.starSelector, function(e) {
            e.preventDefault();
            var $star = $(this);
            self.rateThisImage($star);
        });
    }
};

rtc = new RatingController('.image-to-rate', ':not(.fixed-rating) .rating');