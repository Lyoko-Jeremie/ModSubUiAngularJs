import ng from 'angular';
import angular from 'angular';


export function getNg() {
    return ng;
}

export function getAngular() {
    return angular;
}

export class NgAppContainer {
    Main: ng.IModule;


    constructor(
        protected externalComponentRef: ExternalComponentManager,
    ) {
        const thisPtr = this;
        this.Main = ng.module('app', []);

        this.Main.directive('dynamicComponent', function ($compile: ng.ICompileService) {
            return {
                restrict: 'A',
                scope: {
                    componentInfo: '='
                },
                link: function (scope: ng.IScope | any, element) {
                    const componentElement = angular.element('<' + scope.componentInfo.selector + '></' + scope.componentInfo.selector + '>');
                    componentElement.attr('data', 'componentInfo.data');
                    element.append(componentElement);
                    $compile(componentElement)(scope);
                }
            };
        });

        this.Main.component('appContainer', {
            // bindings: {externalComponents: '<'},
            template: `
{{externalComponentRef.externalComponents.length}}
<div ng-repeat="c in externalComponentRef.externalComponents">
    <div dynamic-component component-info="c"></div>
</div>
`,
            controller: ['$scope', '$compile', function ($scope: ng.IScope, $compile: ng.ICompileService) {
                // console.log('app-container');
                // console.log(externalComponentRef);
                ($scope as any).externalComponentRef = thisPtr.externalComponentRef;
            }],
        });

        console.log('NgAppContainer created');
    }

    el?: HTMLElement;

    installApp(el: HTMLElement) {
        if (this.el) {
            console.error('App already installed');
            return;
        }
        this.el = el;
        this.externalComponentRef.fullFillComponent(this.Main);
        ng.bootstrap(el, ['app']);
    }

    destroyApp() {
        if (this.el) {
            ng.element(this.el).scope().$destroy();
        }
    }
}


export interface AppExternalComponentInfo<DataType extends (any | undefined)> {
    selector: string;
    componentCreateInfo?: () => {
        selector: string,
        componentName: string,
        componentOptions: ng.IComponentOptions,
    };
    componentRegister?: (rootAppModule: ng.IModule) => {
        selector: string,
    };
    data?: DataType;
}

export class ExternalComponentManager {
    protected _externalComponents: AppExternalComponentInfo<any>[] = [];

    protected isInit = false;

    constructor() {
    }

    addComponent(componentInfo: AppExternalComponentInfo<any>) {
        if (this.isInit) {
            console.error('Cannot add component after fullFillComponent');
            return;
        }
        this._externalComponents.push(componentInfo);
    }

    fullFillComponent(
        _M: ng.IModule,
    ) {
        this.isInit = true;
        this._externalComponents.forEach((c) => {
            let selector: string;
            if (c.componentCreateInfo) {
                const componentInfo = c.componentCreateInfo();
                _M.component(componentInfo.componentName, componentInfo.componentOptions);
                selector = componentInfo.selector;
            } else if (c.componentRegister) {
                selector = c.componentRegister(_M).selector;
            } else {
                return;
            }
            c.selector = selector;
        });
    }

    get externalComponents() {
        return this._externalComponents;
    }

}

// ngAppContainerInstance.externalComponentRef.addComponent({
//     selector: 'a-component1',
//     componentCreateInfo: () => {
//         return {
//             selector: 'a-component1',
//             componentName: 'aComponent1',
//             componentOptions: {
//                 bindings: {data: '<'},
//                 template: '<div>Component 1: {{$ctrl.data}}</div>'
//             }
//         }
//     },
//     data: 1,
// } satisfies AppExternalComponentInfo<any>);
// ngAppContainerInstance.externalComponentRef.addComponent({
//     selector: 'a-component2',
//     componentRegister: rootAppModule => {
//         rootAppModule.component('aComponent2', {
//             bindings: {data: '<'},
//             template: '<div>Component 2: {{$ctrl.data}}</div>'
//         });
//         return {
//             selector: 'a-component2',
//         };
//     },
//     data: 2,
// } satisfies AppExternalComponentInfo<any>);

// @ts-ignore
// window.installApp = ngAppContainerInstance.installApp.bind(ngAppContainerInstance);
