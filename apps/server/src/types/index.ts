export type RouteReponseT<T = undefined> = {
  success: boolean;
  data: T;
  message: string;
};
