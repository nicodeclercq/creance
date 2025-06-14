import { RouteName, getPath } from "../routes";

import { useNavigate } from "react-router-dom";

export const useRoute = () => {
  const navigate = useNavigate();

  return {
    goTo: (route: RouteName, parameters?: { [key: string]: string }) =>
      navigate(getPath(route, parameters)),
    back: () => navigate(-1),
    forward: () => navigate(1),
  };
};
