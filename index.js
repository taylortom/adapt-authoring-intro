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
    'dashboard': {
      steps: [
        {
          intro: "<h1 class='title'>Welcome to Adapt!</h1><p>Adapt is a free and easy to use e-learning authoring tool that creates fully responsive, multi-device, HTML5 e-learning content using the award-winning Adapt framework.</p><p>Sit back and relax while we give you a whistle-stop tour of the most useful features of the application.</p><p>You can use the buttons below to navigate through the steps (alternatively you can also use the arrow keys). You can leave the tour at any time by pressing Esc.</p><p>Please keep your arms and legs inside the ride at all times.</p>",
          tooltipClass: 'frontpage',
        },
        {
          intro: "This is the dashboard. Here you'll find the list of Adapt courses that you've already created.",
          element: '#app'
        },
        {
          intro: "You can customise how the list is displayed using these controls.",
          element: '.options-inner',
          position: 'left'
        },
        {
          intro: "These buttons change the list style.",
          element: '.options-group-layout'
        },
        {
          intro: "These buttons adjust how the list is sorted.",
          element: '.options-group-sort'
        },
        {
          intro: "You can filter the list using tags.",
          element: '.projects-sidebar-add-tag',
          highlightClass: 'dark'
        },
        {
          intro: "Or search for a specific course by name.",
          element: '.projects-sidebar-filter-search-input',
          highlightClass: 'dark'
        },
        {
          intro: "By default, you'll only be shown courses you've created, but you can view courses shared by other users by clicking here.",
          element: '.projects-sidebar-shared-courses-inner',
          highlightClass: 'dark'
        },
        {
          intro: "Let's get started by adding a new course.",
          element: '.projects-sidebar-add-course',
          highlightClass: 'dark'
        }
      ]
    },
    'project:new': {
      steps: [
        {
          intro: "When creating a new course, you're taken to this page, where you can enter some details about your course.",
          tooltipClass: 'frontpage'
        },
        {
          intro: "You can enable/disable groups of settings using these switch controls.",
          element: '.sidebar-fieldset-filter-general',
          highlightClass: 'dark'
        },
        {
          intro: "When you're ready, you can save the new course using this button.",
          element: '.editor-project-edit-sidebar-save',
          highlightClass: 'dark'
        }
      ]
    }
  };
});
