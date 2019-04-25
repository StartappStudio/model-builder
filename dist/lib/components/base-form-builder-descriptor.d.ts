import { IChildComponentDescriptor, IModel } from '@start-app/form-builder-model';
import * as React from 'react';
import { IComponentDescriptor } from '../controller/component-descriptor';
import { ComponentRegistry } from '../controller/component-registry';
import { IComponentProperties, IViewModel } from '../controller/interfaces';
import { FormBuilderComponent } from './form-builder-component';
export declare abstract class BaseFormBuilderDescriptor implements IComponentDescriptor {
    abstract name: string;
    registry: ComponentRegistry;
    resolveChildComponents(model: IModel): IChildComponentDescriptor[];
    cloneModel(properties?: object): object;
    updateProperties(model: IComponentProperties): IComponentProperties;
    abstract render(model: IViewModel): React.ReactElement<FormBuilderComponent>;
}
