import ng, {IController} from "angular";
import {ComponentRegistryCallback} from "../ExternalComponentManager";
import {get, clone} from "lodash";

export enum OrderAction {
    up1 = 'up1',
    down1 = 'down1',
    select = 'select',
}

export interface OrderComponentConfig {
    list: {
        key: string | number;
        str: string;
        selected: boolean;
    }[];
    onChange?: (
        action: OrderAction,
        list: OrderComponentConfig['list'],
        selectedKey: string | number,
        config: OrderComponentConfig & Record<any, any>,
    ) => void;
    hostClass?: string;
    selectClass?: string;
}

export const createOrderComponent: ComponentRegistryCallback = (rootAppModule: ng.IModule) => {
    rootAppModule.component('orderComponent', {
        bindings: {data: '<'},
        template: `
            <select multiple style="min-height: 15em;min-width: 10em;" class="order-component-select">
                <option
                    ng-repeat="item in $ctrl.data.list track by item.key" 
                    value="{{item.key}}" 
                    ng-selected="item.selected"
                    ng-click="selectKey(item)"
                >{{item.str}}</option>
            </select>
            <button
                style="display: block;" 
                ng-click="MoveSelectedItem('up1')"
            >MoveSelectedItemUp</button>
            <button
                style="display: block;" 
                ng-click="MoveSelectedItem('down1')"
            >MoveSelectedItemDown</button>
<!--            <button -->
<!--                style="display: block;" -->
<!--                ng-click="test()"-->
<!--            >test</button>-->
                `,
        controller: ['$scope', '$compile', '$element', function (scope: ng.IScope, $compile: ng.ICompileService, $element: ng.IAugmentedJQuery) {
            const $scope = scope as ng.IScope & {
                $ctrl: IController & { data: OrderComponentConfig }
            } & Record<string, any>;
            // $scope.data: OrderComponentConfig;
            // console.log('Order Component Controller', clone($scope));
            // console.log('Order Component Controller', get(clone($scope), '$ctrl'));
            // console.log('Order Component Controller', get($scope, '$ctrl.data'));

            const callOnChange = (action: OrderAction) => {
                if ($scope.$ctrl.data.onChange) {
                    const l = $scope.$ctrl.data.list.map((item) => {
                        return {
                            key: item.key,
                            str: item.str,
                            selected: item.selected,
                        };
                    });
                    const selectedN = l.find((item) => item.key === $scope.selectedKey);
                    if (selectedN) {
                        selectedN.selected = true;
                    }
                    $scope.$ctrl.data.onChange(action, l, $scope.selectedKey, $scope.$ctrl.data);
                }
            };

            $element.css('display', 'block');
            $element.addClass('order-component-host');

            $scope.$ctrl.$onInit = function () {
                // console.log('OrderComponent onInit', $scope.$ctrl.data);
                if ($scope.$ctrl.data.hostClass) {
                    $element.addClass($scope.$ctrl.data.hostClass);
                }
                if ($scope.$ctrl.data.selectClass) {
                    $element.find('select').addClass($scope.$ctrl.data.selectClass);
                }
            }

            type ListType = OrderComponentConfig['list'];

            $scope.selectedKey = Number.MAX_SAFE_INTEGER;

            $scope.selectKey = function (key: ListType[0]) {
                // console.log('selectKey', key);
                $scope.selectedKey = key.key;
                callOnChange(OrderAction.select);
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
                    callOnChange(OrderAction.up1);
                } else if (direction === 'down1' && selectedIndex < list.length - 1) {
                    $scope.listItemDown(selectedIndex, list);
                    callOnChange(OrderAction.down1);
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

