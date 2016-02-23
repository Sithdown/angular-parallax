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


      var calcValY = 0,
      ticking = false;

      function onScroll() {
        calcValY = calcPosition();
        requestTick();
      }

      function requestTick() {
        if(!ticking) {
          requestAnimationFrame(update);
        }
        ticking = true;
      }

      function update() {

        ticking = false;

        elem.css('background-position', "50% " + calcValY + "px");
      }


      function getElementOffset() {
        var documentElem,
        top = 0,
        doc = elem && document;

        documentElem = doc.documentElement;

        if ( typeof elem[0].getBoundingClientRect !== undefined ) {
          top = elem[0].getBoundingClientRect().top;
        }

        return (top - (documentElem.clientTop || 0));
      };

      function calcPosition()
      {

        var elementOffset = getElementOffset();
        var wh = $window.innerHeight;

        var elementHeight = elem[0].offsetHeight;

        return ((elementOffset + wh / 2) / wh * ($scope.parallaxRatio ? $scope.parallaxRatio : 1.1 ) * (elementHeight)) * -1;

      };

      angular.element($window).bind("scroll", onScroll);
      angular.element($window).bind("touchmove", onScroll);

      $scope.$on('$destroy', function() {
        angular.element($window).unbind("scroll");
        angular.element($window).unbind("touchmove");
      });
    }  // link function
  };
}]);
