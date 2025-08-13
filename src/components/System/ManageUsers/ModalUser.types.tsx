export interface Group {
    id: string;
    name: string;
}

export interface UserData {
    id: number;
    email: string;
    username: string;
    phone: string;
    password: string;
    address: string;
    group: string;
}

export interface ValidInputs {
    email: boolean;
    username: boolean;
    phone: boolean;
    password: boolean;
    address: boolean;
    group: boolean;
}

export interface ModalUserProps {
    Title: string;
    show: boolean;
    hide: () => void;
    action: 'CREATE' | 'UPDATE';
    dataModalUser: any;
}
