import ng, {IController} from "angular";
import {ComponentRegistryCallback} from "../ExternalComponentManager";

export enum EnableOrderAction {
    enableUp1 = 'enableUp1',
    enableDown1 = 'enableDown1',
    disableUp1 = 'disableUp1',
    disableDown1 = 'disableDown1',

    selectEnable = 'selectEnable',
    selectDisable = 'selectDisable',

    toEnable = 'toEnable',
    toDisable = 'toDisable',
}

export interface EnableOrderComponentConfig {
    listEnabled: {
        key: string | number;
        str: string;
        selected: boolean;
    }[];
    listDisabled: {
        key: string | number;
        str: string;
        selected: boolean;
    }[];
    onChange?: (
        action: EnableOrderAction,
        listEnabled: EnableOrderComponentConfig['listEnabled'],
        listDisabled: EnableOrderComponentConfig['listDisabled'],
        selectedKeyEnabled: string | number,
        selectedKeyDisabled: string | number,
        config: EnableOrderComponentConfig & Record<any, any>,
    ) => void;
    hostClass?: string;
    selectEnabledClass?: string;
    selectDisabledClass?: string;
    noHrSplit?: boolean;
    buttonClass?: string;
    text?: {
        MoveEnabledSelectedItemUp?: string,
        MoveEnabledSelectedItemDown?: string,
        EnableSelectedItem?: string,
        DisableSelectedItem?: string,
        MoveDisabledSelectedItemUp?: string,
        MoveDisabledSelectedItemDown?: string,
    };
}


export const createEnableOrderComponent: ComponentRegistryCallback = (rootAppModule: ng.IModule) => {
    rootAppModule.component('enableOrderComponent', {
        bindings: {data: '<'},
        template: `
            <select multiple style="min-height: 15em;min-width: 10em;" class="enable-order-component-select select-enable">
                <option
                    ng-repeat="item in $ctrl.data.listEnabled track by item.key" 
                    value="{{item.key}}" 
                    ng-selected="item.selected"
                    ng-click="selectKeyEnable(item)"
                >{{item.str}}</option>
            </select>
            <div style="display: block;" class="enable-order-component-enable-select-button">
                <input type="button" ng-click="MoveSelectedItem('up1', 'enable')" ng-value="t('MoveEnabledSelectedItemUp')" />
                <input type="button" ng-click="MoveSelectedItem('down1', 'enable')" ng-value="t('MoveEnabledSelectedItemDown')" />
            </div>
            <hr ng-if="! $ctrl.data.noHrSplit" />
            <div style="display: block;" class="enable-order-component-enable-disable-select-button">
                <input type="button" ng-click="EnableDisableItem('enable')" ng-value="t('EnableSelectedItem')" />
                <input type="button" ng-click="EnableDisableItem('disable')" ng-value="t('DisableSelectedItem')" />
            </div>
            <hr ng-if="! $ctrl.data.noHrSplit" />
            <div style="display: block;" class="enable-order-component-disable-select-button">
                <input type="button" ng-click="MoveSelectedItem('up1', 'disable')" ng-value="t('MoveDisabledSelectedItemUp')" />
                <input type="button" ng-click="MoveSelectedItem('down1', 'disable')" ng-value="t('MoveDisabledSelectedItemDown')" />
            </div>
            <select multiple style="min-height: 15em;min-width: 10em;" class="enable-order-component-select select-disable">
                <option
                    ng-repeat="item in $ctrl.data.listDisabled track by item.key" 
                    value="{{item.key}}" 
                    ng-selected="item.selected"
                    ng-click="selectKeyDisable(item)"
                >{{item.str}}</option>
            </select>
<!--            <button -->
<!--                style="display: block;" -->
<!--                ng-click="test()"-->
<!--            >test</button>-->
                `,
        controller: ['$scope', '$compile', '$element', function (scope: ng.IScope, $compile: ng.ICompileService, $element: ng.IAugmentedJQuery) {
            const $scope = scope as ng.IScope & {
                $ctrl: IController & { data: EnableOrderComponentConfig }
            } & Record<string, any>;
            // $scope.data: OrderComponentConfig;
            // console.log('Order Component Controller', clone($scope));
            // console.log('Order Component Controller', get(clone($scope), '$ctrl'));
            // console.log('Order Component Controller', get($scope, '$ctrl.data'));

            const callOnChange = (action: EnableOrderAction) => {
                if ($scope.$ctrl.data.onChange) {
                    const lEnable = $scope.$ctrl.data.listEnabled.map((item) => {
                        return {
                            key: item.key,
                            str: item.str,
                            selected: item.selected,
                        };
                    });
                    const selectedNEnable = lEnable.find((item) => item.key === $scope.selectedKeyEnable);
                    if (selectedNEnable) {
                        selectedNEnable.selected = true;
                    }
                    const lDisable = $scope.$ctrl.data.listDisabled.map((item) => {
                        return {
                            key: item.key,
                            str: item.str,
                            selected: item.selected,
                        };
                    });
                    const selectedNDisable = lDisable.find((item) => item.key === $scope.selectedKeyDisable);
                    if (selectedNDisable) {
                        selectedNDisable.selected = true;
                    }
                    $scope.$ctrl.data.onChange(action, lEnable, lDisable, $scope.selectedKeyEnable, $scope.selectedKeyDisable, $scope.$ctrl.data);
                }
            };

            $element.css('display', 'block');
            $element.addClass('enable-order-component-host');

            $scope.$ctrl.$onInit = function () {
                // console.log('OrderComponent onInit', $scope.$ctrl.data);
                if ($scope.$ctrl.data.hostClass) {
                    $element.addClass($scope.$ctrl.data.hostClass);
                }
                if ($scope.$ctrl.data.selectEnabledClass) {
                    $element.find('.select-enable').addClass($scope.$ctrl.data.selectEnabledClass);
                }
                if ($scope.$ctrl.data.selectDisabledClass) {
                    $element.find('.select-disable').addClass($scope.$ctrl.data.selectDisabledClass);
                }
                if ($scope.$ctrl.data.buttonClass) {
                    $element.find('button').addClass($scope.$ctrl.data.buttonClass);
                }
            }

            $scope.t = function (textTag: keyof EnableOrderComponentConfig['text']) {
                // console.log('t', textTag, $scope.$ctrl.data.text?.[textTag], $scope.$ctrl.data.text);
                return $scope.$ctrl.data.text?.[textTag] || textTag;
            }

            type ListType = EnableOrderComponentConfig['listEnabled'];

            $scope.selectedKeyEnable = Number.MAX_SAFE_INTEGER;
            $scope.selectedKeyDisable = Number.MAX_SAFE_INTEGER;

            $scope.selectKeyEnable = function (key: ListType[0]) {
                // console.log('selectKey', key);
                $scope.selectedKeyEnable = key.key;
                callOnChange(EnableOrderAction.selectEnable);
            }
            $scope.selectKeyDisable = function (key: ListType[0]) {
                // console.log('selectKey', key);
                $scope.selectedKeyDisable = key.key;
                callOnChange(EnableOrderAction.selectDisable);
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

            $scope.MoveSelectedItem = function (direction: 'up1' | 'down1', listType: 'enable' | 'disable') {
                const selectedKey = listType === 'enable' ? $scope.selectedKeyEnable : $scope.selectedKeyDisable;
                const list = $scope.$ctrl.data[listType === 'enable' ? 'listEnabled' : 'listDisabled'];
                const selectedIndex = list.findIndex((item) => item.key === selectedKey);
                console.log('MoveSelectedItem', [selectedKey, selectedIndex, direction, listType, list]);
                if (selectedIndex === -1) {
                    return;
                }
                if (direction === 'up1' && selectedIndex > 0) {
                    $scope.listItemUp(selectedIndex, list);
                    callOnChange(listType === 'enable' ? EnableOrderAction.enableUp1 : EnableOrderAction.disableUp1);
                } else if (direction === 'down1' && selectedIndex < list.length - 1) {
                    $scope.listItemDown(selectedIndex, list);
                    callOnChange(listType === 'enable' ? EnableOrderAction.enableDown1 : EnableOrderAction.disableDown1);
                }
            }

            $scope.EnableDisableItem = function (action: 'enable' | 'disable') {
                // move selectedKeyEnable to listDisabled OR move selectedKeyDisable to listEnabled
                if (action === 'disable') {
                    const selectedKeyEnable = $scope.selectedKeyEnable;
                    const listEnabled = $scope.$ctrl.data.listEnabled;
                    const listDisabled = $scope.$ctrl.data.listDisabled;
                    const selectedIndexEnable = listEnabled.findIndex((item) => item.key === selectedKeyEnable);
                    console.log('EnableDisableItem', [action, selectedKeyEnable, selectedIndexEnable, action, listEnabled, listDisabled]);
                    if (selectedIndexEnable === -1) {
                        return;
                    }
                    const item = listEnabled.splice(selectedIndexEnable, 1)[0];
                    listDisabled.push(item);
                    callOnChange(EnableOrderAction.toEnable);
                } else if (action === 'enable') {
                    const selectedKeyDisable = $scope.selectedKeyDisable;
                    const listEnabled = $scope.$ctrl.data.listEnabled;
                    const listDisabled = $scope.$ctrl.data.listDisabled;
                    const selectedIndexDisable = listDisabled.findIndex((item) => item.key === selectedKeyDisable);
                    console.log('EnableDisableItem', [action, selectedKeyDisable, selectedIndexDisable, action, listEnabled, listDisabled]);
                    if (selectedIndexDisable === -1) {
                        return;
                    }
                    const item = listDisabled.splice(selectedIndexDisable, 1)[0];
                    listEnabled.push(item);
                    callOnChange(EnableOrderAction.toDisable);
                }
                // clean select state
                $scope.selectedKeyEnable = Number.MAX_SAFE_INTEGER;
                $scope.selectedKeyDisable = Number.MAX_SAFE_INTEGER;
            }

            $scope.test = function () {
                console.log('test');
                console.log('test', $scope);
                console.log('test', $scope.$ctrl);
                console.log('test', $scope.$ctrl.data);
                console.log('test', $scope.selectedKey);
            };
        }],
    });
    return {
        selector: 'enable-order-component',
    };
}

