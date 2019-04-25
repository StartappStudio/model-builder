import { IViewModel } from '../controller/interfaces';
export interface IComponentEvents {
    onDragStart?: (event: React.DragEvent, model: IViewModel) => void;
    onDragOver?: (event: React.DragEvent, model: IViewModel) => void;
    onDrop?: (event: React.DragEvent, model: IViewModel) => void;
    onInsertComponent?: (event: React.DragEvent, viewModel: IViewModel) => void;
    onClick?: (event: React.MouseEvent, model: IViewModel) => void;
    onKeyUp?: (event: React.KeyboardEvent) => void;
}
export interface IModelBuilderTheme {
    componentHostContainer: {
        background: string;
    };
    containerHost: {
        borderColor: string;
        activeBorderColor: string;
    };
    containerWrap: {
        scrollbarTrackColor: string;
        scrollbarThumbColor: string;
    };
    badge: {
        background: string;
        textColor: string;
    };
    defaultComponent: {
        borderColor: string;
        textColor: string;
    };
    typography: {
        sizes: {
            text: string;
            badge: string;
        };
        font: string;
        weights: {
            bold: string;
        };
    };
}
export declare type OnViewModelEvent = (model: IViewModel, updateModel: (model: IViewModel) => void) => void;
