// LICENCE https://github.com/adaptlearning/adapt_authoring/blob/master/LICENSE
define(function(require) {
  var _ = require('underscore');
  var Origin = require('core/origin');
  var IntroJS = require('./intro.min.js');
  var viewedTuts = [];

  Origin.on('location:change', function(location) {
    location = processLocation(location);
    var locationData = data[location];
    if(!locationData) {
      console.warn('showIntro: unknown location:', location, Origin.location);
      return;
    }
    if(_.indexOf(viewedTuts) > -1) {
      return;
    }
    Origin.once(locationData.event || 'origin:hideLoading', function() {
      startIntro(location, locationData);
    });
  });

  function processLocation(location) {
    var loc = location.module;
    if(location.route2) {
      loc += ':' + location.route2;
    } else if(location.route1) {
      loc += ':' + location.route1;
    }
    return loc;
  }

  function startIntro(location, data) {
    var intro = IntroJS();
    intro.setOptions({
      steps: data.steps,
      overlayOpacity: 0,
      showStepNumbers: false,
      showBullets: false,
      showProgress: true,
      hidePrev: true,
      hideNext: true,
      prevLabel: 'Back',
      nextLabel: 'Next',
      doneLabel: 'Next page'
    })
    intro.onskip($.noop).onexit($.noop).oncomplete(function() {
      viewedTuts.push(location);
      if(data.oncomplete) data.oncomplete();
    });
    intro.start();
  }

  var data = {

  };
});
