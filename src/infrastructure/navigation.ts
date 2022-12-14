import { ROUTE, RouteName, RoutePath } from '../router';

type ParameterNames<Path extends string> =
    Path extends `:${infer Name}/${infer Rest}`   ? Name | ParameterNames<Rest>
  : Path extends `:${infer Name}`                 ? Name
  : Path extends `${string}/${infer Rest}` ? ParameterNames<Rest>
  : /* otherwise */                                 never;

type Params<Path extends `/${string}`> = {
  [key in ParameterNames<Path>]: string | number | boolean;
};
type ParamsFromRouteName<PathName extends RouteName> = Params<RoutePath<PathName>>;


export const getPath = <R extends RouteName>(route: R, ...params: ({} extends ParamsFromRouteName<R> ? [] : [ParamsFromRouteName<R>])): string => {
  const path: string = ROUTE[route];
  const parameters = params[0] ?? {} as Record<string, string>;

  const replaceInPath = (path: string, [name, value]: [string, string]) => path.replace(
    new RegExp(`:${name}`, 'g'),
    encodeURIComponent(value)
  );

  return Object
    .entries(parameters)
    .reduce(replaceInPath, path);
};