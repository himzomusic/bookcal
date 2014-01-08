var bookcalApp = angular.module('bookcalApp', []);

bookcalApp.controller('BookCalCtrl', ['$scope', function ($scope) {
    $scope.bookingTimes = [];
    $scope.nextDates = [];
    $scope.currentDate = Date.now();
    //Following values are constants and should be in the database and fetched from init
    $scope.workStart = 0;
    $scope.workEnd = 0;
    $scope.bookingInterval = 0;

    //runs when the page is loaded
    $scope.init = function() {
        //Following values are constants and should be in the database and fetched from init
        $scope.workStart = 8;
        $scope.workEnd = 20; //end hour
        $scope.bookingInterval = 20; //interval in minutes. Must be divisible with 60!
        $scope.populateList();

        //add date buttons
        for (var i=0; i<7; i++) {
            $scope.nextDates.push(Date.now() + (i * 24 * 60 * 60 * 1000));
        }
    };
    //increases or decreases the date buy the number of days passed
    $scope.calculateDate = function(numOfDays){
        $scope.currentDate += (numOfDays * 24 * 60 * 60 * 1000);
        $scope.populateList();
    };
    //sets the current date to the passed date
    $scope.setDate = function(newDate){
        $scope.currentDate = newDate;
        $scope.populateList();
    };
    //populates the bookings list
    $scope.populateList = function() {
        //clear the list
        $scope.bookingTimes = [];

        //TODO: get all bookings for the current date

        var bookTime = $scope.workStart = 8;
        while (bookTime <= $scope.workEnd) {
            var loops = 60 / $scope.bookingInterval;
            var loop = 0;
            while (loop < loops) {
                //TODO: populate the list with fetched bookings.
                $scope.bookingTimes.push(
                    {time:(bookTime < 10 ? '0' : '') + bookTime + ':' + (loop == 0 ? "00" : loop*$scope.bookingInterval),
                        text:'',
                        done:false});
                loop++;
            }
            bookTime += 1;
        }
    };
}]);