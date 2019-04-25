import * as React from 'react';
import { FormBuilderContext } from '../context';
import { IComponentDescriptor } from '../controller/component-descriptor';
import { ComponentState, IViewModel } from '../controller/interfaces';
import { ComponentHostContainer, ContainerBadge, ContainerHost } from './component-host.style';

export interface IComponentHostProps {
    model: IViewModel;
    descriptor: IComponentDescriptor;
}

export class ComponentHost extends React.Component<IComponentHostProps> {

    public static contextType = FormBuilderContext;
    public context!: React.ContextType<typeof FormBuilderContext>;

    private containerElement: HTMLDivElement;
    private badgeElement: HTMLDivElement;
    private active: boolean;

    constructor(props: IComponentHostProps) {
        super(props);
    }

    public render() {
        const model = this.props.model;
        this.context.onViewModel(model, this.updateModel);
        const widthStyle = { width: model.md.width };

        return (
            <ComponentHostContainer data-name='component-host'
                style={widthStyle}
                draggable={true}
                onDragStart={(event) => this.context.events.onDragStart(event, model)}
                onDragOver={(event) => this.onDragOver(event) }
                onDragLeave={() => this.active ? this.resetActive() : void 0 }
                onDrop={(event) => this.onDrop(event, model)}
                onClick={(event) => this.context.events.onClick(event, model)}
            >
                <ContainerHost
                    state={model}
                    ref={(el: HTMLDivElement) => this.containerElement = el }
                >
                    <ContainerBadge
                        data-name='container-badge'
                        show={model.state !== ComponentState.None}
                        ref={(el: HTMLDivElement) => this.badgeElement = el }
                    >
                        {model.name}
                    </ContainerBadge>

                    {this.props.descriptor.render(model)}

                </ContainerHost>
            </ComponentHostContainer>
        );
    }

    private setActive(): void {
        this.containerElement.classList.add('active-container');
        this.badgeElement.classList.add('active-badge');
        this.active = true;
    }

    private resetActive(): void {
        this.containerElement.classList.remove('active-container');
        this.badgeElement.classList.remove('active-badge');
        this.active = false;
    }

    private onDragOver(event: React.DragEvent) {
        event.preventDefault();
        event.stopPropagation();

        if (!this.active) {
            this.setActive();
        }
    }

    private onDrop(event: React.DragEvent<HTMLDivElement>, viewModel: IViewModel) {
        this.resetActive();
        const data = event.dataTransfer.getData('studio-form-builder-plugin');
        if (data) {
            this.context.events.onInsertComponent(event, viewModel);
        } else {
            this.context.events.onDrop(event, viewModel);
        }
    }

    private updateModel = (model: IViewModel) => {
        this.setState({ model });
    }
}
