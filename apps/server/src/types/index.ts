export type RouteReponseT<T = undefined> = {
  status: boolean;
  data: T;
  message: string;
};
