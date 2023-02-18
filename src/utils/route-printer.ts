/* eslint-disable no-use-before-define */
interface ILayer {
  name: string;
  handle: IRoute;
  route: IRoute;
  regexp: string;
  method: string;
}

interface IRoute {
  stack: ILayer[];
  path: string;
}

// eslint-disable-next-line camelcase
const split = (thing: string | { fast_slash: boolean }) => {
  if (typeof thing === 'string') {
    return thing.split('/');
  }
  if (thing.fast_slash) {
    return [''];
  }
  const match = thing
    .toString()
    .replace('\\/?', '')
    .replace('(?=\\/|$)', '$')
    .match(/^\/\^((?:\\[.*+?^${}()|[\]\\/]|[^.*+?^${}()|[\]\\/])*)\$\//u);
  return match
    ? match[1].replace(/\\(.)/gu, '$1').split('/')
    : [`<complex:${thing.toString()}>`];
};

export const printRoutes = (path: string[], layer: ILayer) => {
  if (layer.route) {
    layer.route.stack.forEach(
      printRoutes.bind(null, path.concat(split(layer.route.path))),
    );
  } else if (layer.name === 'router' && layer.handle.stack) {
    layer.handle.stack.forEach(
      printRoutes.bind(null, path.concat(split(layer.regexp))),
    );
  } else if (layer.method) {
    console.log(
      `${layer.method.toUpperCase().padEnd(10)} ${path
        .concat(split(layer.regexp))
        .filter(Boolean)
        .join('/')}`,
    );
  }
};
