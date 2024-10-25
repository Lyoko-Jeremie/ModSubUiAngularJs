import {ExternalComponentManager} from "./AngularJs/ExternalComponentManager";

export const ExternalComponentManagerListName = [
    'ModGuiConfig',
    'ModInGameConfig',
] as const;

export type ExternalComponentManagerListNameType = typeof ExternalComponentManagerListName[number];

export type bootstrapFunctionType = (el: HTMLElement) => void;
export type releaseFunctionType = () => void;
export type addComponentFunctionType = ExternalComponentManager['addComponent'];
export type cleanComponentFunctionType = ExternalComponentManager['addComponent'];
export type registryComponentFunctionType = ExternalComponentManager['registryComponent'];

export type AppContainerManagerMethodsType = {
    [K in ExternalComponentManagerListNameType as `bootstrap${ /*Capitalize<K>*/ K}`]: bootstrapFunctionType;
} & {
    [K in ExternalComponentManagerListNameType as `release${ /*Capitalize<K>*/ K}`]: releaseFunctionType;
} & {
    [K in ExternalComponentManagerListNameType as `addComponent${ /*Capitalize<K>*/ K}`]: addComponentFunctionType;
} & {
    [K in ExternalComponentManagerListNameType as `cleanComponent${ /*Capitalize<K>*/ K}`]: cleanComponentFunctionType;
} & {
    [K in ExternalComponentManagerListNameType as `registryComponent${ /*Capitalize<K>*/ K}`]: registryComponentFunctionType;
};

export interface AppContainerManagerMethodsInterface extends AppContainerManagerMethodsType {
}

export type AppContainerManagerMethodsInterfaceKey = keyof AppContainerManagerMethodsInterface;
