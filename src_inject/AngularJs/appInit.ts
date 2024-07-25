import ng from 'angular';
import angular from 'angular';


export class NgAppContainer {
    Main: ng.IModule;

    externalComponentRef: ExternalComponentManager;

    constructor() {
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

        this.externalComponentRef = new ExternalComponentManager(this.Main);
        console.log('NgAppContainer created');
    }

    installApp(el: HTMLElement) {
        this.externalComponentRef.fullFillComponent();
        ng.bootstrap(el, ['app']);
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

    constructor(
        protected _M: ng.IModule,
    ) {
    }

    addComponent(componentInfo: AppExternalComponentInfo<any>) {
        if (this.isInit) {
            console.error('Cannot add component after fullFillComponent');
            return;
        }
        this._externalComponents.push(componentInfo);
    }

    fullFillComponent() {
        this.isInit = true;
        this._externalComponents.forEach((c) => {
            let selector: string;
            if (c.componentCreateInfo) {
                const componentInfo = c.componentCreateInfo();
                this._M.component(componentInfo.componentName, componentInfo.componentOptions);
                selector = componentInfo.selector;
            } else if (c.componentRegister) {
                selector = c.componentRegister(this._M).selector;
            } else {
                return;
            }
            c.selector = selector;
        });
    }

    get externalComponents() {
        return this._externalComponents;
    }

    get M() {
        return this._M;
    }
}

const ngAppContainerInstance = new NgAppContainer();

ngAppContainerInstance.externalComponentRef.addComponent({
    selector: 'a-component1',
    componentCreateInfo: () => {
        return {
            selector: 'a-component1',
            componentName: 'aComponent1',
            componentOptions: {
                bindings: {data: '<'},
                template: '<div>Component 1: {{$ctrl.data}}</div>'
            }
        }
    },
    data: 1,
});
ngAppContainerInstance.externalComponentRef.addComponent({
    selector: 'a-component2',
    componentRegister: rootAppModule => {
        rootAppModule.component('aComponent2', {
            bindings: {data: '<'},
            template: '<div>Component 2: {{$ctrl.data}}</div>'
        });
        return {
            selector: 'a-component2',
        };
    },
    data: 2,
});

// @ts-ignore
window.installApp = ngAppContainerInstance.installApp.bind(ngAppContainerInstance);
