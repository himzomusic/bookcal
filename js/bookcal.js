var bookcalApp = angular.module('bookcalApp', ['ngRoute']);

bookcalApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/bookcal/', {
            templateUrl: 'views/bookingList.html',
            controller: 'BookCalCtrl'
        })
        .otherwise({
            redirectTo: '/bookcal/'
        });
    $locationProvider.html5Mode(true);
}]);

bookcalApp.controller('BookCalCtrl', ['$scope', function ($scope) {
    $scope.bookingTimes = [];//holds the booking times
    $scope.nextDates = [];//holds a week forward from today
    $scope.currentDate = Date.now();// holds the current selected date

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
    //sets done=true if there is any text in input field for specific booking time
    $scope.updateBookingTimeDone = function(bookingTime){
        bookingTime.booked = bookingTime.booked || bookingTime.text.length > 0;
    };
    //unbook the time
    $scope.verifyUnbooking = function(bookingTime){
        //if the booking time isn't booked just return
        if (bookingTime.booked)
            return true;
        //show the confirmation and wait for answer
        var confirmText = 'Du har valt att ta bort bokning kl ' + bookingTime.time + (bookingTime.text != '' ? ' (' + bookingTime.text + ')' : '') + '!\n\nVill du verkligen ta bort bokningen?';
        if (confirm(confirmText)) {
            //TODO: remove booking from the database
            bookingTime.text = "";//clear the text
        } else {
            bookingTime.booked = true;//reverse action
        }
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
                var formattedTimeForRow = (bookTime < 10 ? '0' : '') + bookTime + ':' + (loop == 0 ? "00" : loop*$scope.bookingInterval);
                $scope.bookingTimes.push(
                    {time:formattedTimeForRow, text:'', booked:false});
                loop++;
            }
            bookTime += 1;
        }
    };
    $scope.init();
}]);