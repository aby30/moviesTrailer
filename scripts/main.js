
var bmsApp = angular.module('bms', []);

bmsApp.filter('getReleaseDate', [ function() {
  return function getDate(value) {
    var monthReturn;
    var input = value;
    var splitDate = input.split(' ');
    var monthName = splitDate[0];
    var monthNameArr = monthName.split('');
    for (var i = 0; i < 3; i++) {
      if(!monthReturn) {
        monthReturn = monthNameArr[i];
      } else {
        monthReturn += monthNameArr[i];
      }
    }
    return (monthReturn + ' ' + splitDate[2]);
  }
}]);
bmsApp.filter('getYoutubeEmbed', ['$sce', function($sce) {
  return function getEmbed(value) {
    var input = value;
    var splitString = input.split('=');
    var youtubeEmbedUrl = 'https://www.youtube.com/embed/' + splitString[1];
    return $sce.trustAsResourceUrl(youtubeEmbedUrl);
  }
}]);

bmsApp.controller('mainController', ['$rootScope', '$scope', 'bmsServices', '$sce', '$timeout', function ($rootScope, $scope, bmsServices, $sce, $timeout) {

    $scope.loading = true;
    $scope.sort = {};

    $scope.trailersList = function () {

      bmsServices.trailerService()
        .then(function(response) {
          if (response.status === 200) {
            var newArrayDataOfOjbect = Object.values(response.data[1])
            $scope.trailers = newArrayDataOfOjbect;
            $scope.langs = response.data[0];
            $scope.loading = false;

          } else {

          }
        }, function (error) {

        });


    };
    $scope.trailersList();

    $scope.makinAllArrayValueFalse = function() {
      $scope.active = [];
      var objLength = 0;

      for(var key in $scope.trailers) {
        objLength++;
      }
      for (var i = 0; i < objLength; i++) {
        $scope.active[i] = false;
      }
    };
    $scope.makinAllArrayValueFalse();

    $scope.divToggle = function(ind) {
      $scope.forSameClick = $scope.active[ind];
      $scope.makinAllArrayValueFalse();
      $scope.active[ind] = !$scope.active[ind];
      if ($scope.forSameClick == true) {
        $scope.active[ind] = false;
      }

      // For Playing the video
      if ($scope.active[ind]) {
        if (($scope.prevActiveIndex != undefined) && ($scope.prevActiveIndex != ind)) {
          $('#trailerVideo_'+[$scope.prevActiveIndex])[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
        }
        setTimeout(function() {
          $('#trailerVideo_'+[ind])[0].contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
        }, 1000);
        $scope.prevActiveIndex = ind;
      } else if (!$scope.active[ind]) {
        // setTimeout(function() {
          $('#trailerVideo_'+[ind])[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
        // }, 0);
        $scope.prevActiveIndex = ind;
      }

    };

    $scope.getYoutubeEmbed = function( value ) {

      var input = value;
      var splitString = input.split('=');
      // To remove extra data from TrailerUrl present in some keys
      var embedCode = splitString[1].split('&');

      var youtubeEmbedUrl = 'https://www.youtube.com/embed/' + embedCode[0] + '?autoplay=1&enablejsapi=1&rel=0&modestbranding=1';
      return $sce.trustAsResourceUrl(youtubeEmbedUrl);

    };

    $scope.genres = [];
    $scope.getGenere = function(values) {
      var splitGenere = values.split('|');

      for (var i = 0; i < splitGenere.length; i++) {
        var checkArr = $scope.genres.includes(splitGenere[i]);
        if (!checkArr) {
          $scope.genres.push(splitGenere[i]);
        }
      }

      return splitGenere;
    };

}]);



bmsApp.service('bmsServices', ['$http', function($http) {

    this.trailerService = function() {
        return $http({
          url: "https://cors-anywhere.herokuapp.com/https://in.bookmyshow.com/serv/getData?cmd=GETTRAILERS&mtype=cs",
          method: 'GET',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

      };

}]);
