type RouteHandler = (params: Record<string, string>) => void | Promise<void>;

interface Route {
  pattern: RegExp;
  handler: RouteHandler;
}

export class Router {
  private routes: Route[] = [];
  private notFound: RouteHandler = () => {};

  add(pattern: RegExp, handler: RouteHandler) {
    this.routes.push({ pattern, handler });
  }

  setNotFound(handler: RouteHandler) {
    this.notFound = handler;
  }

  start() {
    window.addEventListener("hashchange", () => this.resolve());
    this.resolve();
  }

  private resolve() {
    const hash = window.location.hash || "#/";
    for (const r of this.routes) {
      const m = hash.match(r.pattern);
      if (m) {
        const params = (m.groups ?? {}) as Record<string, string>;
        r.handler(params);
        return;
      }
    }
    this.notFound({});
  }
}
