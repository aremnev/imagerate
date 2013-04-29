var RatingController = function(ratingSelector) {
    this.ratingSelector = ratingSelector;
    this.starSelector = ratingSelector + ' span';
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
        });
    }
};

rtc = new RatingController('.image-to-rate:not(.fixed-rating) .rating');