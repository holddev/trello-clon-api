export type Env = {
  DB_URL: string
  DB_TOKEN: string
}

type Status = 200 | 201 | 400 | 404 | 500;

export interface ControllerResponse<T> {
  ok: boolean;
  data: T | null;
  message?: string;
  status: Status;
}

