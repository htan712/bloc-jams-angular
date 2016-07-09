(function() {
    function seekBar($document) {
        /** 
        * @function calculatePercent
        * @desc Calculates the horizontal percent along the seek bar where the event (passed in from the view as $event) occurred.
        * @params {Object, click event}
        **/
        
        var calculatePercent = function(seekBar, event) {
            var offsetX = event.pageX - seekBar.offset().left;
            var seekBarWidth = seekBar.width();
            var offsetXPercent = offsetX / seekBarWidth;
            offsetXPercent = Math.max(0, offsetXPercent);
            offsetXpercent = Math.min(1, offsetXPercent);
            return offsetXPercent;
        };
        
        return {
            templateUrl: '/templates/directives/seek_bar.html',
            replace: true,
            restrict: 'E',
            scope: { },
            link: function(scope, element, attribute) {
                scope.value = 0;
                scope.max = 100;
                
                /**
                * @var seekBar
                * @desc Holds the element that matches the directive (<seek-bar>) as a jQuery object so we can call jQuery methods on it.
                **/
                
                var seekBar = $(element);
                
                /**
                * @function percentString
                * @desc calculates percent based on value & maximum value of seek bar
                **/
                
                var percentString = function() {
                    var value = scope.value;
                    var max = scope.max;
                    var percent = value / max * 100;
                    return percent + "%";
                };
                
                /**
                * @function fillStyle
                * @desc Returns the width of the seek bar fill element based on the calculated percent.
                **/
                
                scope.fillStyle = function() {
                    return {width: percentString()};
                };
                
                /**
                * @func onClickSeekBar
                * @desc Updates the seek bar value based on the seek bar's width and the location of the user's click on the seek bar.
                * @params {location of user click event}
                **/
                
                scope.onClickSeekBar = function(event) {
                    var percent = calculatePercent(seekBar, event);
                    scope.value = percent * scope.max;
                };
                
                /**
                * @func trackThumb
                * @desc Similar to scope.onClickSeekBar, but uses $apply to constantly apply the change in value of scope.value as the user drags the seek bar thumb.
                **/
                
                scope.trackThumb = function() {
                    $document.bind('mousemove.thumb', function(event) {
                        var percent = calculatePercent(seekBar, event);
                        scope.$apply(function() {
                            scope.value = percent * scope.max;
                        });
                    });
                    
                    $document.bind('mouseup.thumb', function(event) {
                        $document.unbind('mousemove.thumb');
                        $document.unbind('mouseup.thumb');
                    });
                };
            }
        };
    }
    
    angular
        .module('blocJams')
        .directive('seekBar', ['$document', seekBar]);
})();