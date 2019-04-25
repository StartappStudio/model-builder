import { IChildComponentDescriptor, IModel } from '@start-app/form-builder-model';
import * as React from 'react';
import { ComponentHost } from '../view/component-host';
import { IComponentDescriptor } from './component-descriptor';
import { IViewModel } from './interfaces';
export declare class ComponentRegistry {
    private components;
    register(componentDescriptor: IComponentDescriptor): void;
    resolveChildComponents(model: IModel): IChildComponentDescriptor[];
    cloneModel(name: string, properties?: object): IModel;
    render(model: IViewModel, index?: number): React.ReactElement<ComponentHost>;
    updateProperties(viewModel: IViewModel, model: IModel): void;
    private findComponent;
}
