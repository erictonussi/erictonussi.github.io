'use strict';
angular.module('main', [
  'ionic',
  'ngCordova',
  'ui.router',
  // TODO: load other modules selected during generation
])
.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  // ROUTING with ui.router
  $urlRouterProvider.otherwise('/login');

  $ionicConfigProvider.tabs.position('bottom'); // other values: top

})

.run(function ($rootScope, $state) {
  $rootScope.$state = $state;
})
;

'use strict';
angular.module('main')
.service('Main', function ($log, $timeout) {

  $log.log('Hello from your Service: Main in module main');

  // some initial data
  this.someData = {
    binding: 'Yes! Got that databinding working'
  };

  this.changeBriefly = function () {
    var initialValue = this.someData.binding;
    this.someData.binding = 'Yeah this was changed';

    var that = this;
    $timeout(function () {
      that.someData.binding = initialValue;
    }, 500);
  };

});

'use strict';
angular.module('main')

.config(function ($stateProvider) {
  $stateProvider
    .state('register', {
      url: '/register',
      templateUrl: 'main/pages/register/register.html',
      controller: 'RegisterCtrl'
    });
})

.controller('RegisterCtrl', function ($log, $scope) {
  $scope.user = {
    username: '',
    password: ''
  };
});

'use strict';
angular.module('main')

.config(function ($stateProvider) {
  $stateProvider
    .state('main', {
      url: '/main',
      abstract: true,
      templateUrl: 'main/pages/main/tabs.html',
      controller: function($scope){
      }
    })

    .state('main.home', {
      url: '/home',
      views: {
        'tab-home': {
          templateUrl: 'main/pages/main/home/home.html',
          controller: 'HomeCtrl as ctrl'
        }
      }
    })
    // .state('main.listDetail', {
    //   url: '/home/detail',
    //   views: {
    //     'tab-home': {
    //       templateUrl: 'main/pages/main/home/list-detail.html',
    //       // controller: 'SomeCtrl as ctrl'
    //     }
    //   }
    // })

    .state('main.charts', {
      url: '/charts',
      views: {
        'tab-charts': {
          templateUrl: 'main/pages/main/charts/charts.html',
          controller: 'ChartsCtrl as ctrl'
        }
      }
    })

    // .state('main.debug', {
    //   url: '/debug',
    //   views: {
    //     'tab-debug': {
    //       templateUrl: 'main/pages/main/debug/debug.html',
    //       controller: 'DebugCtrl as ctrl'
    //     }
    //   }
    // })

    .state('main.config', {
      url: '/config',
      views: {
        'tab-config': {
          templateUrl: 'main/pages/main/config/config.html',
          controller: 'ConfigCtrl as ctrl'
        }
      }
    })

    // .state('main.configThemometers', {
    //   url: '/config/detail',
    //   views: {
    //     'tab-config': {
    //       templateUrl: 'main/pages/main/config/themometers/thermometers.html',
    //       controller: 'ConfigThermometersCtrl as ctrl'
    //     }
    //   }
    // })

    ;
})

// .controller('LoginCtrl', function ($log, $scope) {
//   $scope.user = {
//     username: '',
//     password: ''
//   };
// });

'use strict';
angular.module('main')
.controller('HomeCtrl', function ($scope, $ionicLoading, /*$firebaseArray,*/ ThermometerList, Config) {

  // $ionicLoading.show();

  // var ref = firebase.database().ref().child('temperaturas');

  // // download the data into a local object
  // $scope.temperaturas = $firebaseArray(ref);
  // $scope.temperaturas.$loaded(function(temperaturas) {

  //   $ionicLoading.hide();

  //   updateChart();
  //   $scope.temperaturas.$watch(updateChart);

  //   function updateChart() {
  //     $scope.data = $scope.temperaturas.map(function(obj, index) {
  //       return {
  //         x: new Date(obj.data),
  //         y: obj.temperatura
  //       }
  //     });

  //     $scope.lastTemp = $scope.temperaturas.slice(-1).pop();
  //   }

  // });

  $scope.data = [
    {
      x: moment().add(-24, 'h'),
      y: 34.6
    },
    {
      x: moment().add(-12, 'h'),
      y: 38.9
    },
    {
      x: moment(),
      y: 37.2
    },
  ];

  updateData(Config.ENV.thermometers[0]);

  $scope.chooseThermometer = function() {
    ThermometerList.chooseThermometer()
      .then(function(res) {

        if ( res === undefined ) return;

        updateData(res);

      });
  };

  function updateData(thermometer) {

    $scope.thermometer = thermometer;

    var seed = thermometer.id;

    $scope.data = [
      {
        x: moment().add(-48, 'h'),
        y: 34.5 + Math.sqrt(random(seed*10 + 1) * 9)
      },
      {
        x: moment().add(-36, 'h'),
        y: 34.5 + Math.sqrt(random(seed*10 + 2) * 9)
      },
      {
        x: moment().add(-24, 'h'),
        y: 34.5 + Math.sqrt(random(seed*10 + 3) * 12)
      },
      {
        x: moment().add(-12, 'h'),
        y: 34.5 + Math.sqrt(random(seed*10 + 4) * 16)
      },
      {
        x: moment(),
        y: 34.5 + Math.sqrt(random(seed*10 + 5) * 9)
      },
    ];

    $scope.lastTemp = {
      data: new Date(+moment()),
      temperatura: 34.5 + Math.sqrt(random(seed*10 + 5) * 9)
    };

    function random(seed) {
      var x = Math.sin(seed) * 10012.13;
      return x - Math.floor(x);
    }
  }


});

'use strict';
angular.module('main')
.controller('DebugCtrl', function ($log, $http, $timeout, Main, Config, $cordovaDevice) {

  $log.log('Hello from your Controller: DebugCtrl in module main:. This is your controller:', this);

  // bind data from services
  this.someData = Main.someData;
  this.ENV = Config.ENV;
  this.BUILD = Config.BUILD;
  // get device info
  ionic.Platform.ready(function () {
    if (ionic.Platform.isWebView()) {
      this.device = $cordovaDevice.getDevice();
    }
  }.bind(this));

  // PASSWORD EXAMPLE
  this.password = {
    input: '', // by user
    strength: ''
  };
  this.grade = function () {
    var size = this.password.input.length;
    if (size > 8) {
      this.password.strength = 'strong';
    } else if (size > 3) {
      this.password.strength = 'medium';
    } else {
      this.password.strength = 'weak';
    }
  };
  this.grade();

  // Proxy
  this.proxyState = 'ready';
  this.proxyRequestUrl = Config.ENV.SOME_OTHER_URL + '/get';

  this.proxyTest = function () {
    this.proxyState = '...';

    $http.get(this.proxyRequestUrl)
    .then(function (response) {
      $log.log(response);
      this.proxyState = 'success (result printed to browser console)';
    }.bind(this))
    .then($timeout(function () {
      this.proxyState = 'ready';
    }.bind(this), 6000));
  };

});

angular.module('main')

.controller('ConfigThermometersCtrl', function ($scope, Config, $ionicPopup) {

  $scope.thermometers = Config.ENV.thermometers;
  $scope.intervals = Config.ENV.intervals;

  $scope.selectThermometer = function(thermometer) {

    if ( !thermometer ) {
      thermometer = {
        name: '',
        description: '',
        picture: 'main/assets/images/empty-avatar.jpg',
        interval: 5,
        batery: 2
      }
    }

    $scope.currentThermometer = angular.copy(thermometer);

    var configPopup = $ionicPopup.alert({
      title: 'Configurações do termometro',
      cssClass: 'md',
      buttons: [
        { text: 'Cancelar' },
        {
          text: 'Salvar',
          type: 'button-positive',
          onTap: function(e) { console.log(e);
            if ($scope.currentThermometer.name.length < 1) {
              e.preventDefault();
            } else {
              return $scope.currentThermometer;
            }
          }
        }
      ],
      templateUrl: 'main/pages/main/config/thermometer/thermometer-config.html',
      scope: $scope,

    });

    configPopup.then(function(res) {
      if ( res ) {

        if ( !res.id ) {
          Config.ENV.thermometers.push(thermometer);
          thermometer.id = 1;
        }

        thermometer.name = res.name;
        thermometer.description = res.description;
        thermometer.picture = res.picture;
        thermometer.interval = res.interval;
      }
    });

  };

    // configPopup.close(thermometer);

});

angular.module('main')

.controller('ConfigCtrl', function ($scope) {

})

.config(function ($stateProvider) {
  $stateProvider

    .state('main.configThemometers', {
      url: '/config/detail',
      // url: '/config',
      views: {
        'tab-config': {
          templateUrl: 'main/pages/main/config/thermometer/thermometers.html',
          controller: 'ConfigThermometersCtrl as ctrl'
        }
      }
    })

  ;
});

'use strict';
angular.module('main')
.controller('ChartsCtrl', function ($scope, Config) {
  $scope.thermometers = Config.ENV.thermometers;

  $scope.filters = {
    selected: Config.ENV.thermometers[0],
    inicial: new Date(+moment().add(-7,'d')),
    final: new Date(+moment()),
  };

  // $scope.timeLimit = 48;

  // $scope.getData = function(argument) {
  //   return data;
  // }

  $scope.$watchCollection('filters', function (filters) {

    var data = [];
    var last = 36.5;

    var inicial = filters.inicial.getTime();
    var final = filters.final.getTime();
    var dateDiff = filters.final - filters.inicial;

    for (var i = 0; i <= dateDiff; i += 60 * 60 * 1000 ) {
      last += random(final - i + filters.selected.id)/2 - .25;

      data.push({
        x: new Date( final - i ),
        y: last//random(i) < .9 ? last : null
      });
    }

    $scope.data = data;

    // $scope.timeLimit = dateDiff / 1 / 60 / 60 / 1000;

    function random(seed) {
      var x = Math.sin(seed) * 10012.13;
      return x - Math.floor(x);
    }

  });

  // $scope.data = data;

});

'use strict';
angular.module('main')

.config(function ($stateProvider) {
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'main/pages/login/login.html',
      controller: 'LoginCtrl'
    });
})

.controller('LoginCtrl', function ($log, $scope) {
  $scope.user = {
    username: '',
    password: ''
  };
});

'use strict';
angular.module('main')
.factory('ThermometerList', function ($ionicPopup, $rootScope, Config) {

  this.chooseThermometer = function() {

    var $scope = $rootScope.$new();
    $scope.thermometers = Config.ENV.thermometers;

    $scope.selectThermometer = function(thermometer) {
      alertPopup.close(thermometer);
    }

    var alertPopup = $ionicPopup.alert({
      title: 'Selecione o termometro',
      buttons: [{ text: 'Cancelar' }],
      templateUrl: 'main/pages/main/home/thermometer-list.html',
      scope: $scope
    });

    return alertPopup;

    // alertPopup.then(function(res) {
    // });

  };



  return this;

});

// Chart.controllers.LineAlt = Chart.controllers.line.extend({
//   name: "LineAlt",
//   // initialize: function(data){
//   //   Chart.controllers.line.prototype.initialize.apply(this, arguments);
//   //   debugger;
//   // },

//   draw2: function(ease) {

//     // Chart.controllers.line.prototype.draw.apply(this, arguments);

//     var ctx = this.chart.chart.ctx;

//     var yRangeBegin = 37.3;
//     var yRangeEnd = 37.8;

//     var xaxis = this.chart.scales['x-axis-0'];
//     var yaxis = this.chart.scales['y-axis-0'];
//     // console.log(xaxis.left);

//     var yRangeBeginPixel = yaxis.getPixelForValue(yRangeBegin);
//     var yRangeEndPixel = yaxis.getPixelForValue(yRangeEnd);
//     var yRangeEndPixel2 = yaxis.getPixelForValue(50);

//     ctx.beginPath();
//     ctx.moveTo(0, yaxis.getPixelForValue(36.5));
//     ctx.lineTo(xaxis.width,yaxis.getPixelForValue(36.5));
//     ctx.lineWidth = .5;

//     ctx.strokeStyle = 'rgba(0,0,0,.5)';
//     ctx.stroke();

//     // ctx.fillText('36,5ºC', 0, yaxis.getPixelForValue(36.5) - 3);

//     // Chart.controllers.line.prototype.draw.apply(this, arguments);

//     // ctx.save();

//     // The fill style of the rectangle we are about to fill.
//     ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
//     // Fill the rectangle that represents the highlight region. The parameters are the closest-to-starting-point pixel's x-coordinate,
//     // the closest-to-starting-point pixel's y-coordinate, the width of the rectangle in pixels, and the height of the rectangle in pixels, respectively.
//     ctx.fillRect(
//       xaxis.left,
//       Math.min(yRangeBeginPixel, yRangeEndPixel),
//       xaxis.right - xaxis.left,
//       Math.max(yRangeBeginPixel, yRangeEndPixel) - Math.min(yRangeBeginPixel, yRangeEndPixel)
//     );

//     // The fill style of the rectangle we are about to fill.
//     ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
//     // Fill the rectangle that represents the highlight region. The parameters are the closest-to-starting-point pixel's x-coordinate,
//     // the closest-to-starting-point pixel's y-coordinate, the width of the rectangle in pixels, and the height of the rectangle in pixels, respectively.
//     ctx.fillRect(
//       xaxis.left,
//       Math.min(yRangeEndPixel, yRangeEndPixel2),
//       xaxis.right - xaxis.left,
//       Math.max(yRangeEndPixel, yRangeEndPixel2) - Math.min(yRangeEndPixel, yRangeEndPixel2)
//     );

//     // debugger;

//     // // var
//     //   // ctx = this.chart.ctx;
//     //   // ctx.font = this.scale.font;
//     //   // ctx.fillStyle = this.scale.textColor
//     //   ctx.textAlign = "center";
//     //   ctx.textBaseline = "bottom";

//     //   // this.datasets.forEach(function (dataset) {
//     //       this.getDataset().data.forEach(function (point) {

//     //         if ( !point.y ) return;

//     //           ctx.fillStyle = point.y > 37 ? '#f00' : '#666';

//     //           ctx.fillText(point.y.toFixed(2), xaxis.getPixelForValue(point.x), yaxis.getPixelForValue(point.y) - 10);
//     //       });
//     //   // })

//     // debugger;

//     ctx.restore();

//     Chart.controllers.line.prototype.draw.apply(this, arguments);

//   }
// });

Chart.plugins.register({
  beforeDraw: function(chartInstance, easing) {
    // chartInstance.chart.ctx

    var ctx = chartInstance.chart.ctx;

    // var yRangeBegin = 37.3;
    // var yRangeEnd = 37.8;

    var xaxis = chartInstance.scales['x-axis-0'];
    var yaxis = chartInstance.scales['y-axis-0'];
    // console.log(xaxis.left);

    var yRangeBeginPixel0 = yaxis.getPixelForValue(0);
    var yRangeBeginPixel = yaxis.getPixelForValue(35);
    var yRangeEndPixel = yaxis.getPixelForValue(37.3);
    var yRangeEndPixel2 = yaxis.getPixelForValue(37.8);
    var yRangeEndPixel3 = yaxis.getPixelForValue(50);

    ctx.beginPath();
    ctx.moveTo(0, yaxis.getPixelForValue(36.5));
    ctx.lineTo(xaxis.width,yaxis.getPixelForValue(36.5));
    ctx.lineWidth = .5;

    ctx.strokeStyle = 'rgba(0,0,0,.5)';
    ctx.stroke();

    // The fill style of the rectangle we are about to fill.
    ctx.fillStyle = '#68ADBA';
    // Fill the rectangle that represents the highlight region. The parameters are the closest-to-starting-point pixel's x-coordinate,
    // the closest-to-starting-point pixel's y-coordinate, the width of the rectangle in pixels, and the height of the rectangle in pixels, respectively.
    ctx.fillRect(
      xaxis.left,
      Math.min(yRangeBeginPixel0, yRangeBeginPixel),
      xaxis.right - xaxis.left,
      Math.max(yRangeBeginPixel0, yRangeBeginPixel) - Math.min(yRangeBeginPixel0, yRangeBeginPixel)
    );

    // The fill style of the rectangle we are about to fill.
    ctx.fillStyle = '#E7C26F';
    // Fill the rectangle that represents the highlight region. The parameters are the closest-to-starting-point pixel's x-coordinate,
    // the closest-to-starting-point pixel's y-coordinate, the width of the rectangle in pixels, and the height of the rectangle in pixels, respectively.
    ctx.fillRect(
      xaxis.left,
      Math.min(yRangeEndPixel, yRangeEndPixel2),
      xaxis.right - xaxis.left,
      Math.max(yRangeEndPixel, yRangeEndPixel2) - Math.min(yRangeEndPixel, yRangeEndPixel2)
    );

    // The fill style of the rectangle we are about to fill.
    ctx.fillStyle = '#9F6B73';
    // Fill the rectangle that represents the highlight region. The parameters are the closest-to-starting-point pixel's x-coordinate,
    // the closest-to-starting-point pixel's y-coordinate, the width of the rectangle in pixels, and the height of the rectangle in pixels, respectively.
    ctx.fillRect(
      xaxis.left,
      Math.min(yRangeEndPixel2, yRangeEndPixel3),
      xaxis.right - xaxis.left,
      Math.max(yRangeEndPixel2, yRangeEndPixel3) - Math.min(yRangeEndPixel2, yRangeEndPixel3)
    );

    ctx.restore();

  }
});
'use strict';
angular.module('main')
.directive('homeChart', function($interval, $ionicActionSheet) {
  return{
    restrict: 'E',
    // templateUrl: 'students.html'
    template: '<canvas width="400" height="200" class="drop-shadow"></canvas>',
    link: function(scope, element, attrs) { //debugger;

      var data = [];

      scope.$watch(attrs.data, function(newValue, oldValue) {

        // if (newValue == oldValue) return;
        // debugger;

        data = newValue.sort(function(a, b){
          return a.x-b.x
        });

        moveChart();

      });

      scope.$watch(attrs.timeLimit, function(newValue, oldValue) {

        // if (newValue == oldValue) return;
        // debugger;

        timeLimit = newValue;

        moveChart();

      });

      // var ctx = 'myChart';
      var ctx = element.children();
      /*global Chart*/
      var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            // labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: 'Temperatura',
                data: [
                  {
                    x: new Date(),
                    y: 36.5
                  }
                ],
                backgroundColor: 'transparent',
                borderColor: '#fff',
                borderWidth: 2,
                pointBackgroundColor: '#fff',
                pointBorderWidth: 0,
                // pointBorderColor: '#44b9af',
                pointRadius: 2,
                pointHitRadius: 15
            }]
        },
        options: {
          scales: {
              xAxes: [{
                type: 'time',
                time: {
                },
                ticks: {
                  display: false,
                  // minRotation: 90,
                  // autoSkip: false,
                  fontSize: 1
                },
                gridLines: {
                  display: false,
                  drawTicks: false,
                },
              }],
              yAxes: [{
                ticks: {
                  // display: false,
                  mirror: true,
                  // stepSize: 1,
                  fontColor: '#fff',
                  padding: 2,
                  maxTicksLimit: 5,
                  // suggestedMax: 37,
                  // suggestedMin: 36.3,
                  fontSize: 10
                },
                gridLines: {
                  // display: false,
                  // tickMarkLength: 0,
                  drawTicks: false,
                  borderDash: [5,5],
                  // borderDashOffset: 15
                }
            }]
          },
          tooltips: {
            callbacks: {
              label: function(tooltipItem, data) {
                // debugger;
                // let account: Account = that.accounts[tooltipItem.index];
                return tooltipItem.yLabel.toFixed(2).replace('.',',') + 'ºC';
              },
              title: function(tooltipItem, data) {
                // debugger;
                /*global moment*/
                return moment(tooltipItem[0].xLabel).format('LT');
                // body...
              }
            }
          },
          onClick: function(e) {

            var element = this.getElementAtEvent(e);
            if ( !element.length ) showActionSheet();

          },
        },
      });

      $interval(moveChart, 10000);
      moveChart();

      var timeLimit = 0;

      function moveChart() {

        if ( timeLimit ) {

          var limit = moment().add( -timeLimit , 'h')
          myChart.data.datasets[0].data = data.filter(function(point, index) { //debugger;
            return index+2 >= data.length || data[index+2].x > limit;
          });

          var points = myChart.data.datasets[0].data.length;

          myChart.data.datasets[0].pointRadius =
            points < 10 ? 4 :
            points < 20 ? 3 :
            points < 30 ? 2 :
            points < 50 ? 1 : 0
          ;

          myChart.data.datasets[0].borderWidth = points < 15 ? 2 : 1;
          // myChart.update(0);

          myChart.options.scales.xAxes[0].time.min = moment().add(-timeLimit, 'h');
          myChart.options.scales.xAxes[0].time.max = moment();

        } else {

          myChart.data.datasets[0].data = data;

          myChart.data.datasets[0].pointRadius =
            data.length < 10 ? 4 :
            data.length < 20 ? 3 :
            data.length < 30 ? 2 :
            data.length < 50 ? 1 : 0
          ;

          myChart.data.datasets[0].borderWidth = data.length < 30 ? 2 : 1;

          myChart.options.scales.xAxes[0].time.min = null;
          myChart.options.scales.xAxes[0].time.max = null;

        }

        myChart.update(0);

      }

       // Triggered on a button click, or some other target
      function showActionSheet() {

        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
          buttons: [
            { text: 'Gráfico completo', limit: 0 },
            { text: '<b>48</b> horas', limit: 48 },
            { text: '<b>24</b> horas', limit: 24 },
            { text: '<b>12</b> horas', limit: 12 },
            { text: '<b>6</b> horas', limit: 6 },
          ],
          // destructiveText: 'Delete',
          titleText: 'Intervalo ',
          // cancelText: 'Cancel',
          // cancel: function() {
          //  // add cancel code..
          // },
          buttonClicked: function(index, value) {
            timeLimit = value.limit;
            moveChart();

            return true;
          }
        });

       // For example's sake, hide the sheet after two seconds
       // $timeout(function() {
       //   hideSheet();
       // }, 2000);

     }

    },
    controller: function() {
    }
  };
});

'use strict';
angular.module('main')
.controller('UserCtrl', function (
  $log,
  $ionicAuth
) {

  this.user = {
    email: '',
    password: ''
  };
  this.updateResult = function (type, result) {
    $log.log(type, result);
    this.user.resultType = type;
    this.user.result = result;
  };

  var responseCB = function (response) {
    this.updateResult('Response', response);
  }.bind(this);

  var rejectionCB = function (rejection) {
    this.updateResult('Rejection', rejection);
  }.bind(this);

  // tries to sign the user up and displays the result in the UI
  this.signup = function () {
    $ionicAuth.signup(this.user)
    .then(responseCB)
    .catch(rejectionCB);
  };
  // tries to sign in the user and displays the result in the UI
  this.signin = function () {
    $ionicAuth.login('basic', this.user)
    .then(responseCB)
    .catch(rejectionCB);
  };
});

'use strict';
angular.module('main')
.constant('Config', {

  // gulp environment: injects environment vars
  ENV: {
    /*inject-env*/
    'SERVER_URL': 'https://DEVSERVER/api',
    'SOME_OTHER_URL': '/postman-proxy',
    'thermometers': [
      {
        'id': 1,
        'name': 'Antônio Muniz',
        'description': 'Termometro Azul',
        'picture': 'main/assets/images/bebe-1.jpg',
        'interval': 5,
        'batery': 2
      },
      {
        'id': 2,
        'name': 'Alice Braga',
        'description': 'Breve descrição',
        'picture': 'main/assets/images/bebe-2.jpg',
        'interval': 5,
        'batery': 3
      },
      {
        'id': 3,
        'name': 'Miguel Silva',
        'description': 'Breve descrição',
        'picture': 'main/assets/images/bebe-3.jpg',
        'interval': 5,
        'batery': 1
      },
      {
        'id': 4,
        'name': 'Luna Monteiro',
        'description': 'Breve descrição',
        'picture': 'main/assets/images/bebe-4.jpg',
        'interval': 5,
        'batery': 0
      }
    ],
    'intervals': [
      {
        'value': '1',
        'mesure': 'm',
        'description': '1 minuto'
      },
      {
        'value': '2',
        'mesure': 'm',
        'description': '2 minutos'
      },
      {
        'value': '5',
        'mesure': 'm',
        'description': '5 minutos'
      },
      {
        'value': '15',
        'mesure': 'm',
        'description': '15 minutos'
      },
      {
        'value': '30',
        'mesure': 'm',
        'description': '30 minutos'
      },
      {
        'value': '1',
        'mesure': 'h',
        'description': '1 hora'
      },
      {
        'value': '2',
        'mesure': 'h',
        'description': '2 horas'
      }
    ]
    /*endinject*/
  },

  // gulp build-vars: injects build vars
  BUILD: {
    /*inject-build*/
    /*endinject*/
  }

});


'use strict';
angular.module('korptemp', [
  // load your modules here
  'main', // starting with the main module
  'chart.js',
  // 'firebase'
])
.config( function () {

  // var config = {
  //   apiKey: 'AIzaSyAU95lF-SauY6hBoxmDLGbMD586Zk6XBrQ',
  //   authDomain: 'korptemp.firebaseio.com',
  //   databaseURL: 'https://korptemp.firebaseio.com',
  //   storageBucket: 'korptemp',
  //   // messagingSenderId: '<your-messaging-sender-id>'
  // };

  // /*global firebase*/
  // firebase.initializeApp(config);

})
;
