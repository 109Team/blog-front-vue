export interface NavBarItem {
    id: number;
    label: string;
    href?: string;
    route?: string;
    actived?: boolean;
    fn?: (item?: object) => void;
}
