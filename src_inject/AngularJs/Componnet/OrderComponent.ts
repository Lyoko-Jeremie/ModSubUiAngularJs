import ng from "angular";
import {ComponentRegistryCallback} from "../ExternalComponentManager";
import {assert, is} from "tsafe";
import {get, clone} from "lodash";
import {type} from "jquery";

export interface OrderComponentConfig {
    list: {
        key: string;
        str: string;
        selected: boolean;
    }[];
}

export const createOrderComponent: ComponentRegistryCallback = (rootAppModule: ng.IModule) => {
    rootAppModule.component('orderComponent', {
        bindings: {data: '<'},
        template: `
                    <div>
                        {{JSON.stringify($ctrl.data)}}
                        <select multiple>
                            <option
                                ng-repeat="item in $ctrl.data.list track by item.key" 
                                value="{{item.key}}" 
                                ng-selected="item.selected"
                                ng-click="selectKey(item)"
                            >{{item.str}}</option>
                        </select>
                        <button 
                            ng-click="MoveSelectedItem('up1')"
                        >MoveSelectedItemUp</button>
                        <button
                            ng-click="MoveSelectedItem('down1')"
                        >MoveSelectedItemDown</button>
                        <button 
                            ng-click="test()"
                        >test</button>
                    </div>
                `,
        controller: ['$scope', '$compile', function (scope: ng.IScope, $compile: ng.ICompileService) {
            const $scope = scope as ng.IScope & { $ctrl: { data: OrderComponentConfig } } & Record<string, any>;
            // $scope.data: OrderComponentConfig;
            console.log('Order Component Controller', clone($scope));
            console.log('Order Component Controller', get(clone($scope), '$ctrl'));
            console.log('Order Component Controller', get($scope, '$ctrl.data'));

            type ListType = OrderComponentConfig['list'];

            $scope.selectedKey = '';

            $scope.selectKey = function (key: ListType[0]) {
                console.log('selectKey', key);
                $scope.selectedKey = key.key;
            }

            // Move list items up or down or swap
            $scope.moveItem = function (array: ListType, originIndex: number, destinationIndex: number) {
                const temp = array[destinationIndex];
                array[destinationIndex] = array[originIndex];
                array[originIndex] = temp;
            };

            // Move list item Up
            $scope.listItemUp = function (itemIndex: number, array: ListType) {
                $scope.moveItem(array, itemIndex, itemIndex - 1);
            };

            // Move list item Down
            $scope.listItemDown = function (itemIndex: number, array: ListType) {
                $scope.moveItem(array, itemIndex, itemIndex + 1);
            };

            $scope.MoveSelectedItem = function (direction: 'up1' | 'down1') {
                const selectedKey = $scope.selectedKey;
                const list = $scope.$ctrl.data.list;
                const selectedIndex = list.findIndex((item) => item.key === selectedKey);
                console.log('MoveSelectedItem', selectedKey, selectedIndex, direction, list);
                if (selectedIndex === -1) {
                    return;
                }
                if (direction === 'up1' && selectedIndex > 0) {
                    $scope.listItemUp(selectedIndex, list);
                } else if (direction === 'down1' && selectedIndex < list.length - 1) {
                    $scope.listItemDown(selectedIndex, list);
                }
            }

            $scope.test = function () {
                console.log('test');
                console.log('test', $scope);
                console.log('test', $scope.$ctrl);
                console.log('test', $scope.$ctrl.data);
                console.log('test', $scope.$ctrl.data.list);
                console.log('test', $scope.selectedKey);
            };
        }],
    });
    return {
        selector: 'order-component',
    };
}

