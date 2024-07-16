import { useNavigate, useLocation } from "react-router-dom";

const fromString = <A extends { [key: string]: string | undefined }>(
  queryParams: string
) =>
  decodeURI(queryParams)
    .replace(/\?/, "")
    .split("&")
    .map((param) => param.split("="))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {} as A);

const toString = (queryParams: { [key: string]: string | undefined }) =>
  `?${Object.entries(queryParams)
    .map((entry) => entry.map((a) => encodeURI(a || "")))
    .map(([key, value]) => `${key}=${value}`)
    .join("&")}`;

export function useQueryParams<
  A extends { [key: string]: string | undefined }
>() {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams: A = fromString(location.search);
  const setQueryParams = (newParams: A) => {
    const params = Object.entries(newParams)
      .filter(([key, value]) => key.length > 0 && value && value.length > 0)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {} as A);

    navigate({
      ...location,
      search: toString(params),
    });
  };

  return [queryParams, setQueryParams] as const;
}
