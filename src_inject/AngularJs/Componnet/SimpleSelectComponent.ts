import ng, {IController} from "angular";
import {ComponentRegistryCallback} from "../ExternalComponentManagerInterface";

export interface SimpleSelectComponentConfig {
    list: {
        key: string;
        str: string;
        selected: boolean;
    }[];
    onChange?: (
        list: SimpleSelectComponentConfig['list'],
        selectedKey: string,
        config: SimpleSelectComponentConfig & Record<any, any>,
    ) => void;
    hostClass?: string;
    selectClass?: string;
    buttonClass?: string;
    text?: {
        // title?: string,
    };
}

export const createSimpleSelectComponent: ComponentRegistryCallback = (rootAppModule: ng.IModule) => {
    rootAppModule.component('simpleSelectComponent', {
        bindings: {data: '<'},
        template: `
<!--            <div class="simple-select-component-title" style="font-size: x-large;margin: 0 auto 0.25em 0.5em;">{{t('title')}}</div>-->
            <select multiple style="min-width: 10em;" class="simple-select-component-select">
                <option
                    ng-repeat="item in $ctrl.data.list track by item.key" 
                    value="{{item.key}}" 
                    ng-selected="item.selected"
                    ng-click="selectKey(item)"
                >{{item.str}}</option>
            </select>
<!--            <div style="display: block;" class="simple-select-component-button">-->
<!--                <input type="button" ng-click="MoveSelectedItem('up1')" value="t('MoveSelectedItemUp')" />-->
<!--                <input type="button" ng-click="MoveSelectedItem('down1')" value="t('MoveSelectedItemDown')" />-->
<!--            </div>-->
                `,
        controller: ['$scope', '$compile', '$element', function (scope: ng.IScope, $compile: ng.ICompileService, $element: ng.IAugmentedJQuery) {
            const $scope = scope as ng.IScope & {
                $ctrl: IController & { data: SimpleSelectComponentConfig }
            } & Record<string, any>;
            // $scope.data: OrderComponentConfig;
            // console.log('simple-select Component Controller', clone($scope));
            // console.log('simple-select Component Controller', get(clone($scope), '$ctrl'));
            // console.log('simple-select Component Controller', get($scope, '$ctrl.data'));

            const callOnChange = () => {
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
                        $scope.$ctrl.data.onChange(l, $scope.selectedKey, $scope.$ctrl.data);
                    } catch (e) {
                        console.error('[ModSubUiAngularJs] SimpleSelectComponent. Error in callOnChange', e);
                    }
                }
            };

            $scope.t = function (textTag: keyof SimpleSelectComponentConfig['text']) {
                // console.log('t', textTag, $scope.$ctrl.data.text?.[textTag], $scope.$ctrl.data.text);
                return $scope.$ctrl.data.text?.[textTag] || textTag;
            }

            $element.css('display', 'block');
            $element.css('padding', '0.5em 0');
            $element.addClass('simple-select-component-host');

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

            type ListType = SimpleSelectComponentConfig['list'];

            $scope.selectedKey = Number.MAX_SAFE_INTEGER;

            $scope.selectKey = function (key: ListType[0]) {
                // console.log('selectKey', key);
                $scope.selectedKey = key.key;
                callOnChange();
            }

        }],
    });
    return {
        selector: 'simple-select-component',
    };
}

