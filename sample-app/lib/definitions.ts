export type APIRequest = {
  classname: string;
  method: string;
  paramtab: [ParamLine?];
};

export type ParamLine = {
  name: string;
  data: string;
};

export type APIResponse = {
  data: [ParamRes];
  message: string;
  state: string;
};

export type ParamRes = {
  kind: string;
  name: string;
  value: any;
};

export enum MessageType {
  Information = "I",
  Success = "S",
  Warning = "W",
  Error = "E",
}

export type AppData = {
  userPassBase64str?: string;
  firstName?: string;
  lastName?: string;
  client?: string;
  email?: string;
  login: (client: string, user: string, password: string) => void;
  logout: () => void;
};
