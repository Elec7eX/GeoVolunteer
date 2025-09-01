import { Login } from "../login/Login";
import { RouteModelInterface, RouteType } from "../utils/Interfaces";
import paths from "./paths";

const routes = {
  login: {
    name: "Login",
    path: paths.login,
    element: <Login />,
    type: RouteType.PUBLIC,
  },
};

function getDeepValuesAsFlatArray(obj: any) {
  let values: any[] = [];
  for (var key in obj) {
    if (obj[key].path) {
      values.push(obj[key]);
    } else {
      var subvalues = getDeepValuesAsFlatArray(obj[key]);
      values = values.concat(subvalues);
    }
  }
  return values;
}

const routeValuesAsFlatArray: RouteModelInterface[] =
  getDeepValuesAsFlatArray(routes);
export const allRoutes: RouteModelInterface[] = routeValuesAsFlatArray;
export const publicRoutes: RouteModelInterface[] =
  routeValuesAsFlatArray.filter((route) => route.type === RouteType.PUBLIC);
export const privateRoutes: RouteModelInterface[] =
  routeValuesAsFlatArray.filter((route) => route.type === RouteType.PRIVATE);
