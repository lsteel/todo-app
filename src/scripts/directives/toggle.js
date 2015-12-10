angular
.module('toggleDirective', [])
.directive('toggle', function() {
  return {
    replace: true,
    restrict: 'AE',
    scope: {
      value: '=',
    },
    template: [
      '<button type="button" ng-click="value = !value" class="btn btn-default" ng-class="{active: value}">',
        '<span ng-if="value" class="glyphicon glyphicon-{{ active }}"></span>',
        '<span ng-if="!value" class="glyphicon glyphicon-{{ inactive }}"></span>',
      '</button>',
    ].join(''),
    link: function(scope, elem, attrs) {
      scope.active = attrs.active;
      scope.inactive = attrs.inactive;
    },
  };
});
