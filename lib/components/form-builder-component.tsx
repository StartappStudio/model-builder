import { IModel } from '@start-app/form-builder-model';
import * as React from 'react';
import { FormBuilderContext } from '../context';
import { IViewModel } from '../controller/interfaces';

export class FormBuilderComponent extends React.Component<IViewModel, any> {

    public context!: React.ContextType<typeof FormBuilderContext>;

    public componentDidMount() {
        if (this.context.onComponentModel) {
            this.context.onComponentModel(this.props, this.updateProperties);
        }
    }

    public updateProperties = (model: IModel) => {
        this.setState({ model });
    }
}
