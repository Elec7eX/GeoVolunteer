import { ReactElement } from "react";

export enum RouteType {
    PUBLIC,
    PRIVATE
}

export interface RouteModelInterface {
    name: string;
    title?: string;
    element: ReactElement | (() => ReactElement);
    path: string;
    type: RouteType;
}