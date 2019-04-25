import { IModel, PropertiesFieldName } from '@start-app/form-builder-model';
import { ListenerFn } from 'eventemitter3';
import { ComponentRegistry } from './component-registry';
import { IViewModel } from './interfaces';
declare type Action = 'select' | 'deselect' | 'cancelSelection' | 'clear' | 'insert' | 'cut' | 'copy' | 'paste' | 'updateModel' | 'delete';
declare type SelectPayload = IViewModel | IViewModel[];
interface IInsertPayload {
    item: IModel;
    parent: IViewModel;
}
declare type Payload = SelectPayload | IInsertPayload | IModel | IModel[];
export declare enum EChangeEvents {
    ModelChange = "ModelChange",
    ViewModelSelect = "ViewModelSelect",
    PropertiesChange = "PropertiesChange",
    SelectMany = "SelectMany"
}
export declare class ControllerBuilder {
    private componentRegistry;
    private propsName;
    private onChange;
    private modelInternal;
    private viewModelInternal;
    private identityToModelMap;
    private modelToViewModelMap;
    private selected;
    private copied;
    private actionMap;
    constructor(componentRegistry: ComponentRegistry, propsName: PropertiesFieldName);
    on(event: string, fn: ListenerFn, context?: any): void;
    off(event: string, fn?: ListenerFn, context?: any, once?: boolean): void;
    dispatch(action: Action, payload?: Payload): any;
    readonly viewModel: IViewModel;
    model: IModel;
    private makeViewModel;
    private select;
    private selectOne;
    private clearSelected;
    private clearCopied;
    private clear;
    private insert;
    private internalInsert;
    private findParentModel;
    private cut;
    private copy;
    private paste;
    private cutModel;
    private copyModel;
    private delete;
    private updateModel;
    private emitModelChange;
}
export declare const TControllerBuilderFactory = "TControllerBuilderFactory";
export {};
