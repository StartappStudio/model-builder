import * as React from 'react';
import { ComponentRegistry } from './controller/component-registry';
import { IComponentEvents, OnViewModelEvent } from './view/interfaces';
export interface IFormBuilderContext {
    registry: ComponentRegistry;
    events: IComponentEvents;
    onViewModel: OnViewModelEvent;
    onComponentModel: OnViewModelEvent;
}
export declare const FormBuilderContext: React.Context<IFormBuilderContext>;
