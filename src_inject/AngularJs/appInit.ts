import ng from 'angular';
import angular from 'angular';
import {ExternalComponentManager} from "./ExternalComponentManager";


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
        protected nameApp: string,
    ) {
        const thisPtr = this;
        this.Main = ng.module(nameApp || 'app', []);

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
<div ng-repeat="c in externalComponentRef.externalComponentsShow">
    <div dynamic-component component-info="c"></div>
</div>
`,
            controller: ['$scope', '$compile', function ($scope: ng.IScope, $compile: ng.ICompileService) {
                // console.log('app-container', thisPtr.externalComponentRef.externalComponentsShow);
                // console.log(externalComponentRef);
                ($scope as any).externalComponentRef = thisPtr.externalComponentRef;
                thisPtr.externalComponentRef.externalComponentsShow;
                // console.log('($scope as any).externalComponentRef', ($scope as any).externalComponentRef);
            }],
        });

        console.log('[ModSubUiAngularJs] NgAppContainer created');
    }

    el?: HTMLElement;

    installApp(el: HTMLElement) {
        if (this.el) {
            console.error('[ModSubUiAngularJs] App already installed');
            return ng.element(el).injector();
        }
        this.el = el;
        this.externalComponentRef.fullFillComponent(this.Main);
        el.appendChild(document.createElement('app-container'));
        return ng.bootstrap(el, [(this.nameApp || 'app')]);
    }

    destroyApp() {
        this.externalComponentRef.cleanComponent();
        if (this.el) {
            // console.log('[NgAppContainer] Destroying app');
            ng.element(this.el).scope().$destroy();
        }
    }
}


// @ts-ignore
// window.installApp = ngAppContainerInstance.installApp.bind(ngAppContainerInstance);
