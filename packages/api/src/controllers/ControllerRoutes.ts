export class ControllerRoutes<U extends string> {
  root: string;
  routes: Record<U, string>;
  constructor(root: string, routes: Record<U, string>) {
    this.root = root;
    this.routes = routes;
  }

  fullPath(key: U) {
    return this.root + this.routes[key];
  }
  path(key: U) {
    return this.routes[key];
  }
}
