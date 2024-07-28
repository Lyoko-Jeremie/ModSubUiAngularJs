import {ModSubUiAngularJsBody} from "./ModSubUiAngularJsBody";
import {createOrderComponent} from "./AngularJs/Componnet/OrderComponent";

// @ts-ignore
window.modModSubUiAngularJsBody = new ModSubUiAngularJsBody();


// @ts-ignore
window.modModSubUiAngularJsBody.appContainerManager.ModGuiConfig.registryComponent(createOrderComponent);
