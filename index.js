// LICENCE https://github.com/adaptlearning/adapt_authoring/blob/master/LICENSE
define(function(require) {
  var _ = require('underscore');
  var Origin = require('core/origin');
  var IntroJS = require('./intro.min');
  var data = require('./stepsConfig');

  var viewedTuts = [];
  var defaultOverlayClass;

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
      scrollToElement: false,
      prevLabel: '← Back',
      startLabel: 'Let\'s go →',
      nextLabel: 'Next →',
      doneLabel: '✓ Done'
    })
    // add some event callbacks
    intro
      .onafterchange(onIntroAfterChange)
      .onskip(onIntroSkip)
      .oncomplete(onIntroComplete);
    // kick it all off
    intro.start();
  }

  function updateOverlayClass() {
    if(this._currentStep === 0) { // store or reset the default className
      defaultOverlayClass = $('.introjs-overlay')[0].className;
    } else {
      $('.introjs-overlay')[0].className = defaultOverlayClass;
    }
    var stepConfig = this._options.steps[this._currentStep];
    if(stepConfig.tooltipClass) {
      $('.introjs-overlay').addClass(stepConfig.tooltipClass);
    }
  }
  function updateButtonLabels() {
    var $skipBtn = $('.introjs-skipbutton');
    var $prevBtn = $('.introjs-prevbutton');
    var $nextBtn = $('.introjs-nextbutton');
    var startLabel = this._options.startLabel;
    var prevLabel = this._options.prevLabel;
    var nextLabel = this._options.nextLabel;
    var isFirstStep = this._currentStep === 0;
    var isLastStep = this._currentStep === this._options.steps.length-1;
    // set skip button visibility
    (isLastStep) ? $skipBtn.show() : $skipBtn.hide();
    // set prev button visibility
    (isFirstStep) ? $prevBtn.hide() : $prevBtn.show();
    // set next button text/visibility
    if(isLastStep) $nextBtn.hide();
    else $nextBtn.text(isFirstStep ? startLabel : nextLabel);
  }

  /**
  * Event handlers
  */

  function onIntroAfterChange(el) {
    updateOverlayClass.call(this);
    updateButtonLabels.call(this);
  }

  function onIntroSkip() {}

  function onIntroComplete() {
    viewedTuts.push(location);
    if(data.oncomplete) data.oncomplete();
  }
});
