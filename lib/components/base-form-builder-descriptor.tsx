import { IChildComponentDescriptor, IModel } from '@start-app/form-builder-model';
import * as React from 'react';
import { IComponentDescriptor } from '../controller/component-descriptor';
import { ComponentRegistry } from '../controller/component-registry';
import { IComponentProperties, IViewModel } from '../controller/interfaces';
import { FormBuilderComponent } from './form-builder-component';

export abstract class BaseFormBuilderDescriptor implements IComponentDescriptor {

    public abstract name = '';
    public registry: ComponentRegistry;

    public resolveChildComponents(model: IModel): IChildComponentDescriptor[] {
        return [];
    }

    public cloneModel(properties: object = {}): object {
        return JSON.parse(JSON.stringify(properties));
    }

    public updateProperties(model: IComponentProperties): IComponentProperties {
        return {
            ...model
        };
    }

    public abstract render(model: IViewModel): React.ReactElement<FormBuilderComponent>;
}
