import 'reflect-metadata';
import {
    Component,
    EventEmitter,
    Inject,
    Injectable,
    Input,
    NgModule,
    OnInit,
    Output,
    bundle,
    Directive
} from 'ng-metadata/core';
import ng from 'angular';
import {NgModuleMetadataType} from "ng-metadata/src/core/directives/metadata_directives";

let globalInjectService: undefined | ng.auto.IInjectorService = undefined;

export interface AppExternalComponentInfo<DataType extends (any | undefined)> {
    selector: string;
    component: NonNullable<NgModuleMetadataType['declarations']>[0];
    data: DataType;
}

@Component({
    selector: 'a-component',
    template: `<div>{{name}}</div>`
})
export class AComponent {
    name = 'Martin';

    onCall() { /*...*/
    }
}

const externalComponentRef: {
    externalComponents: AppExternalComponentInfo<any>[],
} = {
    externalComponents: [
        {
            selector: 'a-component',
            component: AComponent,
            data: undefined,
        }
    ],
};

@Directive({
    selector: '[dynamicComponent]',
})
class DynamicComponentDirective {
    @Input() componentInfo!: AppExternalComponentInfo<any>;

    static link(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, controller: any, transclude: ng.ITranscludeFunction) {

        const $compile: ng.ICompileService = globalInjectService?.get('$compile')!;

        const componentElement = ng.element('<' + attrs.componentInfo.selector + '></' + attrs.componentInfo.selector + '>');
        componentElement.attr('data', 'componentInfo.data');
        element.append(componentElement);
        const ij = ng.injector(['ng']);
        console.log('ij', ij);

        console.log('$compile', $compile)
        $compile(componentElement)(scope);

    }

    // constructor(
    //     @Inject('$compile') $compile: ng.ICompileService,
    // ) {
    // }

}

function addDynamicComponentDirective(m: ng.IModule) {
    m.directive('dynamicComponent', function ($compile) {
        return {
            restrict: 'A',
            scope: {
                componentInfo: '='
            },
            link: function (scope: ng.IScope | any, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, controller: any,) {
                var componentElement = ng.element('<' + scope.componentInfo.selector + '></' + scope.componentInfo.selector + '>');
                componentElement.attr('data', 'componentInfo.data');
                element.append(componentElement);
                $compile(componentElement)(scope);
            }
        };
    });
    console.log('addDynamicComponentDirective', m);
}

@Component({
    selector: 'app-container',
    template: `
<div>
    {{JSON.stringify($ctrl)}}
<!--    {{JSON.stringify($ctrl.externalComponents)}}-->
<!--    {{$ctrl.externalComponents.length}}-->
<!--    <div ng-repeat="c in $ctrl.externalComponents">-->
<!--        <div dynamicComponent componentInfo="c"></div>-->
<!--    </div>-->
</div>`
})
class AppComponent implements OnInit {
    externalComponents!: AppExternalComponentInfo<any>[];

    constructor(
        @Inject('$scope') $scope: ng.IScope,
    ) {
    }

    ngOnInit(): any {
        this.externalComponents = externalComponentRef.externalComponents;
        console.log('this.externalComponents.length', JSON.stringify(this.externalComponents))
        console.log(externalComponentRef.externalComponents)
    }

}

@NgModule({
    declarations: [
        AppComponent,
        DynamicComponentDirective,
        ...externalComponentRef.externalComponents.map(c => c.component),
    ],
    providers: []
})
class AppModule {
}

console.log('AppModule', AppModule);

export function installApp(appRootElem: Element) {

    // platformBrowserDynamic().bootstrapModule(AppModule);
    ng.element(document).ready(() => {
        const Ng1AppModule = bundle(AppModule, []);
        addDynamicComponentDirective(Ng1AppModule);
        const Ng1AppModuleName = Ng1AppModule.name;
        const N1AppModule = ng.module(Ng1AppModuleName, [Ng1AppModuleName]);
        // const appRootElem = document.querySelector('#my-app') || document.body;
        globalInjectService = ng.bootstrap(appRootElem, [N1AppModule.name], {strictDi: true})

        console.log('start')
    });
}

// @ts-ignore
window.installApp = installApp;
// @ts-ignore
window.externalComponentRef = externalComponentRef;
