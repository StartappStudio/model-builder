import { IModel, PropertiesFieldName } from '@start-app/form-builder-model';
import * as React from 'react';
import { FormBuilderContext } from './context';
import { ComponentRegistry } from './controller/component-registry';
import { ControllerBuilder, EChangeEvents } from './controller/controller-builder';
import { IViewModel } from './controller/interfaces';
import { IUndoRedoService } from './controller/undo-redo-service.interface';
import { IComponentEvents, IModelBuilderTheme } from './view/interfaces';
import Main from './view/main';
import { ThemeProvider } from './view/styled-components';

export interface IModelBuilderProps {
    registry: ComponentRegistry;
    undoRedoService: IUndoRedoService;
    change: (model: IModel) => void;
    select: (model: IModel) => void;
    copy: (models: IModel[]) => void;
    copied: () => IModel[];
    theme: IModelBuilderTheme;
    model: any;
    propsName?: PropertiesFieldName;
}

export enum KeyCode {
    Delete = 46,
    Copy = 'KeyC',
    Paste = 'KeyV',
    Cut = 'KeyX',
    Undo = 'KeyZ',
    Escape = 'Escape'
}

export class ModelBuilder extends React.Component<IModelBuilderProps, IViewModel> {

    private controllerBuilder: ControllerBuilder;
    private undoRedoService: IUndoRedoService;
    private modelMap = new Map<IViewModel, (model: IViewModel) => void>();
    private containersMap = new Map<IViewModel, (model: IViewModel) => void>();

    private events: IComponentEvents = this.wrap({
        onDragStart: (event: React.DragEvent, model: IViewModel) => this.onDragStart(event, model),
        onDragOver: () => true,
        onDrop: (event: React.DragEvent, model: IViewModel) => this.onDrop(event, model),
        onInsertComponent: (event: React.DragEvent, viewModel: IViewModel) => this.onInsertComponent(event, viewModel),
        onClick: (event: React.MouseEvent, model: IViewModel) => this.onClick(event, model),
        onKeyUp: (event: React.KeyboardEvent) => this.onKeyUp(event)
    });

    constructor(props: IModelBuilderProps) {
        super(props);

        this.controllerBuilder = new ControllerBuilder(props.registry, props.propsName || 'props');
        this.controllerBuilder.model = this.props.model;
        this.undoRedoService = props.undoRedoService;
        this.state = props.model;
    }

    public componentDidMount() {
        this.controllerBuilder.on(EChangeEvents.PropertiesChange, this.onPropertiesChangeListener);
        this.controllerBuilder.on(EChangeEvents.ModelChange, this.onModelChangeListener);
        this.controllerBuilder.on(EChangeEvents.ViewModelSelect, this.onModelSelectListener);
        this.controllerBuilder.on(EChangeEvents.SelectMany, this.onSelectManyListener);
    }

    public componentWillUnmount() {
        this.controllerBuilder.off(EChangeEvents.PropertiesChange, this.onPropertiesChangeListener);
        this.controllerBuilder.off(EChangeEvents.ModelChange, this.onModelChangeListener);
        this.controllerBuilder.off(EChangeEvents.ViewModelSelect, this.onModelSelectListener);
        this.controllerBuilder.off(EChangeEvents.SelectMany, this.onSelectManyListener);
    }

    public render() {
        if (this.state !== this.props.model) {
            this.state = this.props.model;
            this.controllerBuilder.model = this.props.model;
        }

        const context = {
            registry: this.props.registry,
            events: this.events,
            onViewModel: (model: IViewModel, setState: (model: IViewModel) => void) => this.onViewModel(model, setState),
            onComponentModel: (model: IViewModel, setState: (model: IViewModel) => void) => this.onComponentModel(model, setState)
        };

        if (this.state) {
            return (
                <ThemeProvider theme={this.props.theme}>
                    <FormBuilderContext.Provider value={context}>
                        <Main {...this.controllerBuilder.viewModel} />
                    </FormBuilderContext.Provider>
                </ThemeProvider>
            );
        } else {
            return <div>Loading...</div>;
        }
    }

    public updateModel(model: IModel) {
        this.controllerBuilder.dispatch('updateModel', model);
    }

    private onSelectManyListener = (models: IViewModel[]) => {
        models.forEach((model) => {
            const updateFn = this.modelMap.get(model);
            if (updateFn) {
                updateFn(model);
            }
        });
    }

    private onPropertiesChangeListener = (model: IViewModel) => {
        const updateFn = this.modelMap.get(model);
        if (updateFn) {
            updateFn(model);
        }
    }

    private onModelChangeListener = (model: IModel) => {
        this.setState(() => {
            return this.controllerBuilder.viewModel;
        });
        this.props.change(model);
    }

    private onModelSelectListener = (model: IModel) => {
        this.props.select(model);
    }

    private onViewModel(model: IViewModel, setState: (model: IViewModel) => void): void {
        this.modelMap.set(model, setState);
    }

    private onComponentModel(model: IViewModel, setState: (model: IViewModel) => void): void {
        this.containersMap.set(model, setState);
    }

    private wrap(events: object): IComponentEvents {
        const result = {};

        Object.keys(events).forEach((eventName) => {
            result[eventName] = (event: Event, model: IViewModel) => {
                const processed = events[eventName](event, model);
                if (processed) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            };
        });

        return result;
    }

    private onDragStart(event: React.DragEvent, model: IViewModel) {
        this.controllerBuilder.dispatch('cancelSelection');
        this.controllerBuilder.dispatch('select', model);
        this.controllerBuilder.dispatch('cut');

        event.stopPropagation();
        return false;
    }

    private onDrop(event: React.DragEvent, model: IViewModel) {
        this.controllerBuilder.dispatch('select', model);
        this.controllerBuilder.dispatch('paste');
        this.props.change(this.controllerBuilder.model);
        return true;
    }

    private onInsertComponent(event: React.DragEvent, viewModel: IViewModel) {
        const model = JSON.parse(event.dataTransfer.getData('studio-form-builder-plugin'));
        this.controllerBuilder.dispatch('insert', { item: model, parent: viewModel });
        this.props.change(this.controllerBuilder.model);
        return true;
    }

    private onClick(event: React.MouseEvent, model: IViewModel) {

        if (!event.ctrlKey) {
            this.controllerBuilder.dispatch('cancelSelection');
        }

        this.controllerBuilder.dispatch('select', model);
        return true;
    }

    private onKeyUp(event: React.KeyboardEvent) {

        const code = event.nativeEvent.code;
        const ctrl = event.ctrlKey;

        if (code === KeyCode.Escape) {
            this.controllerBuilder.dispatch('clear');
            return true;
        }

        if (event.keyCode === KeyCode.Delete) {
            this.controllerBuilder.dispatch('delete');
            return true;
        }

        if (ctrl && (code === KeyCode.Copy)) {
            const models = this.controllerBuilder.dispatch('copy');
            this.props.copy(models);
            return true;
        }

        if (ctrl && (code === KeyCode.Paste)) {
            const models = this.props.copied();
            this.controllerBuilder.dispatch('paste', models);
            return true;
        }

        if (ctrl && (code === KeyCode.Cut)) {
            const models = this.controllerBuilder.dispatch('cut');
            this.props.copy(models);
            return true;
        }

        if (ctrl && (code === KeyCode.Undo)) {
            this.controllerBuilder.model = this.undoRedoService.undo();
            return true;
        }

        if (ctrl && event.shiftKey && (code === KeyCode.Undo)) {
            return true;
        }
    }
}
