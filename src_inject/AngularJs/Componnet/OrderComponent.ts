import ng from "angular";
import {ComponentRegistryCallback} from "../ExternalComponentManager";

export interface OrderComponentConfig {
}

export const createOrderComponent: ComponentRegistryCallback = (rootAppModule: ng.IModule) => {
    rootAppModule.component('orderComponent', {
        bindings: {data: '<'},
        template: `
                    <div>
                        {{JSON.stringify(data)}}
                        <select multiple>
                            <option value="volvo" selected>Volvo</option>
                            <option value="saab">Saab</option>
                            <option value="mercedes">Mercedes</option>
                            <option value="audi">Audi</option>
                        </select>
                    </div>
                `,
        controller: ['$scope', '$compile', function ($scope: ng.IScope, $compile: ng.ICompileService) {
            // $scope.data: OrderComponentConfig;
            console.log('Order Component Controller');
        }],
    });
    return {
        selector: 'order-component',
    };
}

