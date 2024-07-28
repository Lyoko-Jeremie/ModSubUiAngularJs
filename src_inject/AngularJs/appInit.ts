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
<div ng-repeat="c in externalComponentRef.externalComponentsShow">
    <div dynamic-component component-info="c"></div>
</div>
`,
            controller: ['$scope', '$compile', function ($scope: ng.IScope, $compile: ng.ICompileService) {
                // console.log('app-container', thisPtr.externalComponentRef.externalComponentsShow);
                // console.log(externalComponentRef);
                ($scope as any).externalComponentRef = thisPtr.externalComponentRef;
                thisPtr.externalComponentRef.externalComponentsShow;
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


// @ts-ignore
// window.installApp = ngAppContainerInstance.installApp.bind(ngAppContainerInstance);
