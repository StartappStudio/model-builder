import { IModel, PropertiesFieldName } from '@start-app/form-builder-model';
import * as React from 'react';
import { ComponentRegistry } from './controller/component-registry';
import { IViewModel } from './controller/interfaces';
import { IUndoRedoService } from './controller/undo-redo-service.interface';
import { IModelBuilderTheme } from './view/interfaces';
export interface IModelBuilderProps {
    registry: ComponentRegistry;
    undoRedoService: IUndoRedoService;
    change: (model: IModel) => void;
    select: (model: IModel) => void;
    copy: (models: IModel[]) => void;
    copied: () => IModel[];
    theme: IModelBuilderTheme;
    propsName?: PropertiesFieldName;
}
export declare enum KeyCode {
    Delete = 46,
    Copy = "KeyC",
    Paste = "KeyV",
    Cut = "KeyX",
    Undo = "KeyZ",
    Escape = "Escape"
}
export declare class ModelBuilder extends React.Component<IModelBuilderProps, IViewModel> {
    private controllerBuilder;
    private undoRedoService;
    private modelMap;
    private containersMap;
    private events;
    constructor(props: IModelBuilderProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    updateModel(model: IModel): void;
    private onSelectManyListener;
    private onPropertiesChangeListener;
    private onModelChangeListener;
    private onModelSelectListener;
    private onViewModel;
    private onComponentModel;
    private wrap;
    private onDragStart;
    private onDrop;
    private onInsertComponent;
    private onClick;
    private onKeyUp;
}
