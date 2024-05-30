import { ReactNode, useState } from "react";
import { useCss } from "react-use";

import { ROUTES } from "./routes";
import { useStore } from "./hooks/useStore";
import { mockData } from "./defaultData";
import { Link } from "./shared/library/text/link/link";

type Props = {
  children: ReactNode;
};

export function DEBUG({ children }: Props) {
  const [isDebug, setIsDebug] = useState(false);
  const { setState } = useStore();
  const wrapperStyle = useCss({
    "*, *:after, *:before": {
      outline: "1px solid purple",
      fontFamily: "'Libre Barcode 39', cursive",
    },
  });
  const style = useCss({
    fontFamily: "sans-serif",
    display: "flex",
    justifyContent: "space-between",
    margin: "0.5rem 2rem",
  });

  return (
    <div className={wrapperStyle}>
      <link
        href="https://fonts.googleapis.com/css2?family=Libre+Barcode+39&display=swap"
        rel="stylesheet"
      />
      <div className={style}>
        <div>
          <label>Debug</label>
          <input
            type="checkbox"
            checked={isDebug}
            onChange={() => setIsDebug(!isDebug)}
          />
        </div>
        <div>
          <button
            style={{
              padding: "0.5rem",
            }}
            type="button"
            onClick={setState(() => () => mockData)}
          >
            Utiliser les données de test
          </button>
        </div>
      </div>
      <div
        style={{
          fontFamily: "sans-serif",
        }}
      >
        <label>Pages</label>
        <ul
          style={{
            margin: 0,
          }}
        >
          {Object.entries(ROUTES).map(([key, value]) => (
            <li key={key}>
              <Link to={value}>{key}</Link>
            </li>
          ))}
        </ul>
      </div>
      {children}
    </div>
  );
}
