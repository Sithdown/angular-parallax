'use strict';

angular.module('angular-parallax', [
]).directive('parallax', ['$window', function($window) {
  return {
    restrict: 'A',
    scope: {
      parallaxRatio: '@',
      parallaxVerticalOffset: '@',
      parallaxHorizontalOffset: '@',
    },
    link: function($scope, elem, attrs) {
      var setPosition = function () {
        var calcValY = $window.pageYOffset * ($scope.parallaxRatio ? $scope.parallaxRatio : 1.1 );
        if (calcValY <= $window.innerHeight) {
          var topVal = (calcValY < $scope.parallaxVerticalOffset ? $scope.parallaxVerticalOffset : calcValY);
          elem.css('transform','translate(' + $scope.parallaxHorizontalOffset + 'px, ' +topVal+ 'px)');
        }
      };

      setPosition();

      angular.element($window).bind("scroll", setPosition);
      angular.element($window).bind("touchmove", setPosition);
    }  // link function
  };
}]).directive('parallaxBackground', ['$window', function($window) {
  return {
    restrict: 'A',
    transclude: true,
    template: '<div ng-transclude></div>',
    scope: {
      parallaxRatio: '@',
    },
    link: function($scope, elem, attrs) {

      var getElementOffset = function() {
        var documentElem,
        box = { top: 0, left: 0 },
        doc = elem && document;

        documentElem = doc.documentElement;

        if ( typeof elem[0].getBoundingClientRect !== undefined ) {
          box = elem[0].getBoundingClientRect();
        }

        return (box.top - (documentElem.clientTop || 0));
      };

      var setPosition = function ()
      {

        var elementOffset = getElementOffset();
        var wh = $window.innerHeight;

        if(elementOffset<=wh)
        {
          var elementHeight = elem[0].offsetHeight;

          var calcValY = ((elementOffset + wh / 2) / wh * ($scope.parallaxRatio ? $scope.parallaxRatio : 1.1 ) * (elementHeight)) * -1;

          elem.css('background-position', "50% " + calcValY + "px");
        }
      };

      // set our initial position - fixes webkit background render bug
      angular.element($window).bind('load', function(e) {
        setPosition();
        $scope.$apply();
      });

      angular.element($window).bind("scroll", setPosition);
      angular.element($window).bind("touchmove", setPosition);
    }  // link function
  };
}]);
