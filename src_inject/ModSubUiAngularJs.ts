import {
    AppExternalComponentInfo,
    ExternalComponentManager,
    NgAppContainer,
    getAngular,
    getNg
} from './AngularJs/appInit';
import type ng from "angular";

export class ModSubUiAngularJs {
    externalComponentManager: ExternalComponentManager;
    ngAppContainerInstance?: NgAppContainer;

    getNg: () => ng.IAngularStatic = getNg;
    getAngular: () => ng.IAngularStatic = getAngular;

    constructor() {
        this.externalComponentManager = new ExternalComponentManager();
    }

    bootstrap(el: HTMLElement) {
        this.ngAppContainerInstance?.destroyApp();
        this.ngAppContainerInstance = new NgAppContainer(this.externalComponentManager);
        this.ngAppContainerInstance.installApp(el);
    }

    release() {
        this.ngAppContainerInstance?.destroyApp();
        this.ngAppContainerInstance = undefined;
    }

    addComponent<T>(componentInfo: AppExternalComponentInfo<T>) {
        this.externalComponentManager.addComponent(componentInfo);
    }

}
