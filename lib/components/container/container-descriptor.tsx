import { IChildComponentDescriptor, IModel } from '@start-app/form-builder-model';
import * as React from 'react';
import { IComponentDescriptor } from '../../controller/component-descriptor';
import { IComponentProperties, IContainerProperties, IViewModel } from '../../controller/interfaces';
import { FormBuilderComponent } from '../form-builder-component';
import { Container } from './container';

export class ContainerComponentDescriptor implements IComponentDescriptor {
    public name = 'container';

    public resolveChildComponents(model: IModel): IChildComponentDescriptor[] {
        return [
            {
                property: 'components',
                model: model.md.components
            }
        ];
    }

    public cloneModel(properties: IContainerProperties = {}): object {
        return {
            ...properties,
            components: []
        };
    }

    public updateProperties(model: IComponentProperties, viewModel: IComponentProperties): IComponentProperties {
        return {
            ...model,
            components: viewModel.components
        };
    }

    public render(model: IViewModel): React.ReactElement<FormBuilderComponent> {
        return <Container {...model} />;
    }
}
