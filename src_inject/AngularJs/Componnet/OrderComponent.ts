import ng, {IController} from "angular";
import {ComponentRegistryCallback} from "../ExternalComponentManagerInterface";

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
    buttonClass?: string;
    text?: {
        MoveSelectedItemUp?: string,
        MoveSelectedItemDown?: string,
        title?: string,
    };
}

export const createOrderComponent: ComponentRegistryCallback = (rootAppModule: ng.IModule) => {
    rootAppModule.component('orderComponent', {
        bindings: {data: '<'},
        template: `
            <div class="order-component-title" style="font-size: x-large;margin: 0 auto 0.25em 0.5em;">{{t('title')}}</div>
            <select multiple style="min-width: 10em;" class="order-component-select">
                <option
                    ng-repeat="item in $ctrl.data.list track by item.key" 
                    value="{{item.key}}" 
                    ng-selected="item.selected"
                    ng-click="selectKey(item)"
                >{{item.str}}</option>
            </select>
            <div style="display: block;" class="enable-order-component-enable-select-button">
                <input type="button" ng-click="MoveSelectedItem('up1')" value="t('MoveSelectedItemUp')" />
                <input type="button" ng-click="MoveSelectedItem('down1')" value="t('MoveSelectedItemDown')" />
            </div>
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
                    try {
                        $scope.$ctrl.data.onChange(action, l, $scope.selectedKey, $scope.$ctrl.data);
                    } catch (e) {
                        console.error('[ModSubUiAngularJs] OrderComponent. Error in callOnChange', e);
                    }
                }
            };

            $scope.t = function (textTag: keyof OrderComponentConfig['text']) {
                // console.log('t', textTag, $scope.$ctrl.data.text?.[textTag], $scope.$ctrl.data.text);
                return $scope.$ctrl.data.text?.[textTag] || textTag;
            }

            $element.css('display', 'block');
            $element.css('padding', '0.5em 0');
            $element.addClass('order-component-host');

            $scope.$ctrl.$onInit = function () {
                // console.log('OrderComponent onInit', $scope.$ctrl.data);
                if ($scope.$ctrl.data.hostClass) {
                    $element.addClass($scope.$ctrl.data.hostClass);
                }
                if ($scope.$ctrl.data.selectClass) {
                    $element.find('select').addClass($scope.$ctrl.data.selectClass);
                }
                if ($scope.$ctrl.data.buttonClass) {
                    $element.find('input[type="button"]').addClass($scope.$ctrl.data.buttonClass);
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
                console.log('[ModSubUiAngularJs] MoveSelectedItem', selectedKey, selectedIndex, direction, list);
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

