export type APIRequest = {
    classname: string;
    method: string;
    paramtab: [ParamLine];
}

export type ParamLine = {
    name: string;
    data: string;
}

export type APIResponse = {
    data: [ParamRes];
    message: string;
    state: string;
}

export type ParamRes = {
    kind: string;
    name: string;
    value: any;
}

