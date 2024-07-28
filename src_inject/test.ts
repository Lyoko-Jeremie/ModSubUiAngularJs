import {ModSubUiAngularJsBody} from "./ModSubUiAngularJsBody";
import {createOrderComponent} from "./AngularJs/Componnet/OrderComponent";
import {createEnableOrderComponent} from "./AngularJs/Componnet/EnableOrderComponent";

// @ts-ignore
window.modModSubUiAngularJsBody = new ModSubUiAngularJsBody();


// @ts-ignore
window.modModSubUiAngularJsBody.appContainerManager.ModGuiConfig.registryComponent(createOrderComponent);
// @ts-ignore
window.modModSubUiAngularJsBody.appContainerManager.ModGuiConfig.registryComponent(createEnableOrderComponent);
