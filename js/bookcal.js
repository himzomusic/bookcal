/** App init **/
var bookcalApp = angular.module('bookcalApp', ['ngRoute', 'ngCookies', 'angles']);

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
        .when('/stats', {
            templateUrl: 'views/statistics.html',
            controller: 'StatisticsCtrl',
            access: {
                isFree: false
            }
        })
        .otherwise({
            redirectTo: '/booking'
        });
}]);

/** Booking controller **/
bookcalApp.controller('BookCalCtrl', ['$scope', '$filter', '$timeout', 'httpService', function ($scope, $filter, $timeout, httpService) {
    $scope.bookingTimes = [];//holds the booking times
    $scope.nextDates = [];//holds a week forward from today
    $scope.currentDate = Date.now();// holds the current selected date

    //Following values are constants and should be in the database and fetched from init
    $scope.workStart = 0;
    $scope.workEnd = 0;
    $scope.bookingInterval = 0;

    //editing timeout for launching db update
    var editTimeout;


    //runs when the page is loaded
    var init = function() {
        //Following values are constants and should be in the database and fetched from init
        $scope.workStart = 8;
        $scope.workEnd = 20; //end hour
        $scope.bookingInterval = 20; //interval in minutes. Must be divisible with 60!
        populateList();

        //add date buttons
        for (var i=0; i<7; i++) {
            $scope.nextDates.push(Date.now() + (i * 24 * 60 * 60 * 1000));
        }
    };
    //increases or decreases the date buy the number of days passed
    $scope.calculateDate = function(numOfDays){
        $scope.currentDate += (numOfDays * 24 * 60 * 60 * 1000);
        populateList();
    };
    //sets the current date to the passed date
    $scope.setDate = function(newDate){
        $scope.currentDate = newDate;
        populateList();
    };
    //books the time
    $scope.editBooking = function(bookingTime){
        $timeout.cancel(editTimeout);
        bookingTime.booked = bookingTime.booked || bookingTime.description.length > 0;
        if (bookingTime.booked) {
            editTimeout = $timeout(function(){
                httpService.editBooking(bookingTime).then(function(data) {
                   if (data.status_code != 200) {
                       alert("Misslyckades att spara bokningen!\n" + data.status_txt);
                       bookingTime.booked = false;
                   }
                });
            }, 500);
        }
    };
    //called on checkbox change
    $scope.bookingChanged = function(bookingTime) {
        //if the booking time isn't booked just return
        if (bookingTime.booked)
            $scope.editBooking(bookingTime);
        else
            removeBooking(bookingTime);

    };

    //remove booking the time
    var removeBooking = function(bookingTime){
        $timeout.cancel(editTimeout);
        //show the confirmation and wait for answer
        var confirmText = 'Du har valt att ta bort bokning kl ' + bookingTime.time + (bookingTime.description != '' ? ' (' + bookingTime.description + ')' : '') + '!\n\nVill du verkligen ta bort bokningen?';
        if (confirm(confirmText)) {
            httpService.removeBooking(bookingTime).then(function(data) {
                if (data.status_code == 200) {
                    bookingTime.booked = false;
                    bookingTime.description = "";
                } else {
                    bookingTime.booked = true;//reverse action
                    alert("Misslyckades att ta bort bokningen från databasen!\n" + data.status_code);
                }
            });
        } else {
            bookingTime.booked = true;
        }
    };

    //loops through the list of bookings searching for the booking on specific time
    var findByTime = function(dataFromDB, time) {
        for (var i = 0; i < dataFromDB.length; i++) {
            if (time == dataFromDB[i].time)
                return dataFromDB[i];
        }
    };

    //populates the bookings list
    var populateList = function() {
        //clear the list
        $scope.bookingTimes = [];
        var bookTime = $scope.workStart = 8;

        httpService.getBookings($scope.currentDate).then(function(data) {
            dataFromDB = data;
            while (bookTime <= $scope.workEnd) {
                var loops = 60 / $scope.bookingInterval;
                var loop = 0;
                while (loop < loops) {
                    var formattedTimeForRow = (bookTime < 10 ? '0' : '') + bookTime + ':' + (loop == 0 ? "00" : loop*$scope.bookingInterval);
                    var booking = findByTime(dataFromDB, formattedTimeForRow);
                    if (booking) {
                        $scope.bookingTimes.push({day:booking.day, time:formattedTimeForRow, description:booking.description, booked:true});
                    } else {
                        $scope.bookingTimes.push({day:$filter('date')($scope.currentDate, "yyyy-MM-dd"), time:formattedTimeForRow, description:'', booked:false});
                    }
                    loop++;
                }
                bookTime += 1;
            }
        });
    };
    init();
}]);

/** Login controller **/
bookcalApp.controller('LoginCtrl', ['$scope', '$location', '$cookieStore', 'UserService', 'httpService', function ($scope, $location, $cookieStore, User, httpService) {
    //TODO: remove 'test' values from declaration
    $scope.typedUsername = '';
    $scope.typedPassword = '';
    //TODO: retrieve username and password from the database to verify typed values
    $scope.loginUser = function() {
        httpService.authorize($scope.typedUsername, $scope.typedPassword).then(function(status) {
           if (status == 200) {
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
        });
    };
    $scope.logout = function() {
        User.isLogged = false;
        User.username = '';
        $cookieStore.remove('username');
        $cookieStore.remove('isLogged');
        $location.path('/login');
    };
}]);
/** Login controller **/
bookcalApp.controller('StatisticsCtrl', ['$scope', '$filter', 'httpService', function ($scope, $filter, httpService) {
    var totalChartLabels = [];
    var totalChartData = [];
    
    var getAllBookings = function() {
        httpService.getBookings("").then(function(data) {
            var label = "";
            var bookings = 0;
            for (var i = 0; i < data.length; i++) {
                $filter('date')(data[i].day, "m")
                label = $filter('date')(data[i].day, "MMM") + " '" + $filter('date')(data[i].day, "yy");
                if (totalChartLabels.length == 0 || totalChartLabels[totalChartLabels.length - 1] != label) {
                    if (totalChartLabels.length > 0) {
                        totalChartData.push(bookings);
                        totalChartLabels[totalChartLabels.length - 1] = totalChartLabels[totalChartLabels.length - 1] + " (" + bookings + ")";
                    }
                    totalChartLabels.push(label);
                    bookings = 0;
                }
                bookings++;
            }
            totalChartLabels[totalChartLabels.length - 1] = totalChartLabels[totalChartLabels.length - 1] + " (" + bookings + ")";
            totalChartData.push(bookings);
        });
    };
    
    $scope.totalChart = {
        labels : totalChartLabels,
        datasets : [
            {
                fillColor : "rgba(151,187,205,0.5)",
                strokeColor : "rgba(151,187,205,1)",
                data : totalChartData
            }
        ], 
    };
    getAllBookings();    
}]);

/** httpService **/
bookcalApp.factory('httpService', function($http, $filter) {
    return {
        getBookings: function(date) {
            return $http({method: 'GET', url: 'php/getBookings.php?' + (date ? 'day=' + $filter('date')(date, "yyyy-MM-dd") : "")})
                .then(function(result) {
                    return result.data;
                });
        },
        editBooking: function(booking) {
            return  $http({method: 'POST', url: 'php/editBooking.php', data: booking})
                .then(function(result) {
                    return result.data;
                });
        },
        removeBooking: function(booking) {
            return  $http({method: 'POST', url: 'php/deleteBooking.php', data: booking})
                .then(function(result) {
                    return result.data;
                });
        },
        authorize: function(user, pass) {
            return  $http({method: 'POST', url: 'php/authorize.php', data: {'user':user, 'pass':pass}})
                .then(function(data) {
                    return data.status;
                }, function(data) {
                    return data.status;
                });
        }
    }
});

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
        if (currRoute.access && !currRoute.access.isFree && (!User.isLogged && !$cookieStore.get('isLogged'))) {
            $location.path('/login');
        }
    });
}]);