import * as React from 'react';
import { FormBuilderContext } from '../../context';
import { IViewModel } from '../../controller/interfaces';
import { ContainerWrap } from '../../view/component-host.style';
import { FormBuilderComponent } from '../form-builder-component';

export class Container extends FormBuilderComponent {

    public static contextType = FormBuilderContext;
    public context!: React.ContextType<typeof FormBuilderContext>;

    public render() {
        let components = [];
        if (this.props.md && this.props.md.components) {
            components = this.props.md.components.map((model: IViewModel, i: number) => {
                return this.context.registry.render(model, i);
            });
        }

        return (
            <ContainerWrap md={this.props.md}
                data-name='container'
            >
                {components}
            </ContainerWrap>
        );
    }
}
