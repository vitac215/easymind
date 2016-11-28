app.controller('panelCtrl', function ($scope) {

    console.log($scope);
    
    var container = angular.element(document.querySelector('#panel'));


    var getNodeByID = function(id) {
        return $('#'+id);
    };

    // Events
    container
        .on('hoverNode', function(event) {
            console.log("here");
            $scope.node = getNodeByID(event.detail);
            console.log($scope.node);
            $scope.detail = true;
            $scope.edit = false;
            $scope.$digest();
        })
        .on('selectNode', function(event) {
            $scope.enterEdit(event.detail);
            $scope.$digest();
        })
        .on('unSelectNode', function(event) {
            if ($scope.edit) {
                $scope.leaveEdit();
                $scope.$digest();
            }
        });

});
