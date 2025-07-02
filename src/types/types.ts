export type Env = {
  DB_URL: string
  DB_TOKEN: string
}

export type Status = 200 | 201 | 400 | 401 | 404 | 500;

export interface ControllerResponse<T> {
  ok: boolean;
  data: T | null;
  message?: string;
  status: Status;
}

