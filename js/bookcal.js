/** App init **/
var bookcalApp = angular.module('bookcalApp', ['ngRoute', 'ngCookies']);

/*** Router **/
bookcalApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl',
            access: {
                isFree: true
            }
        })
        .when('/booking', {
            templateUrl: 'views/bookingList.html',
            controller: 'BookCalCtrl',
            access: {
                isFree: false
            }
        })
        .otherwise({
            redirectTo: '/booking'
        });
}]);

/** Booking controller **/
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
    //books the time
    $scope.bookTime = function(bookingTime){
        //TODO: add booking to the database
        bookingTime.booked = bookingTime.booked || bookingTime.text.length > 0;
    };
    //remove booking the time
    $scope.removeBooking = function(bookingTime){
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

/** Login controller **/
bookcalApp.controller('LoginCtrl', ['$scope', '$location', '$cookieStore', 'UserService', function ($scope, $location, $cookieStore, User) {
    //TODO: remove 'test' values from declaration
    $scope.typedUsername = 'test';
    $scope.typedPassword = 'test';
    //TODO: retrieve username and password from the database to verify typed values
    $scope.loginUser = function() {
        if ($scope.typedUsername == 'test' && $scope.typedPassword == 'test') {
            User.isLogged = true;
            User.username = $scope.typedUsername;
            $cookieStore.put('username', User.username);
            $cookieStore.put('isLogged', User.isLogged);
            $location.path('/booking');
        } else {
            $scope.typedPassword = '';
            User.isLogged = false;
            User.username = '';
            $cookieStore.remove('username');
            $cookieStore.remove('isLogged');
            alert('Felaktiga inloggningsuppgifter!');
        }
    };
    $scope.logout = function() {
        User.isLogged = false;
        User.username = '';
        $cookieStore.remove('username');
        $cookieStore.remove('isLogged');
        $location.path('/login');
    };
}]);

/** UserService **/
bookcalApp.factory('UserService', function() {
    var sdo = {
        isLogged: false,
        username: ''
    };
    return sdo;
});
/** Directive checking login status **/
bookcalApp.run(['$rootScope', '$location', '$cookieStore', 'UserService', function ($root, $location, $cookieStore, User) {
    $root.$on('$routeChangeStart', function(event, currRoute, prevRoute){
        if (!currRoute.access.isFree && (!User.isLogged && !$cookieStore.get('isLogged'))) {
            $location.path('/login');
        }
    });
}]);