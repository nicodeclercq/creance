import { ReactNode, useState, useRef } from "react";
import { useKey, useClickAway, useCss } from "react-use";
import usePortal from "react-useportal";

import { Card } from "../card/card";
import { Z_INDEX } from "../../../entities/z-index";
import { SPACING } from "../../../entities/spacing";
import { BORDER_DEFINITION } from "../../../entities/border";
import { ButtonGhost } from "../button/buttonGhost";
import { Theme } from "../../../shared/theme/theme";

type Props = {
  children: ReactNode;
  dropDownContent: { [key: string]: ReactNode };
  position?: "left" | "right";
  onClick?: (key: string) => void;
};
export function Dropdown({
  children,
  dropDownContent,
  position = "left",
  onClick,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const { Portal } = usePortal();
  const [isOpened, setOpened] = useState(false);
  useKey("Escape", () => setOpened(false));
  useClickAway(ref2, () => setOpened(false));

  const wrapperStyle = useCss({
    display: "inline-block",
    position: "relative",
    "@keyframes dropdownAppear": {
      from: {
        opacity: 0,
      },
      to: {
        opacity: 1,
      },
    },
  });
  const dropdownWrapperStyle = useCss({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "transparent",
    padding: SPACING.M,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  });
  const dropdownStyle = useCss({
    [position]: `${
      position === "left"
        ? ref.current?.offsetLeft
        : window.innerWidth -
          (ref.current?.offsetLeft ?? 0) -
          (ref.current?.offsetWidth ?? 0)
    }px`,
    zIndex: Z_INDEX.dropdown,
    position: "absolute",
    top: `${
      (ref.current?.offsetTop ?? 0) + (ref.current?.offsetHeight ?? 0)
    }px`,
    animation: "dropdownAppear ease-in 0.2s",
  });
  const itemStyle = useCss({
    display: "flex",
    margin: 0,
    "& > *": {
      padding: SPACING.S,
    },
    listStyleType: "none",
    whiteSpace: "nowrap",
    "&:not(:first-child)": {
      borderTop: BORDER_DEFINITION.LIGHT,
    },
  });

  const clickOnItem = (key: string) => {
    setOpened(false);
    onClick?.(key);
  };

  return (
    <div ref={ref} className={wrapperStyle}>
      <ButtonGhost onClick={() => setOpened(!isOpened)}>{children}</ButtonGhost>
      {isOpened && (
        <Portal>
          <Theme>
            <div className={dropdownWrapperStyle}>
              <div ref={ref2} className={dropdownStyle}>
                <Card type="light">
                  <ul
                    style={{
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    {Object.entries(dropDownContent).map(([key, content]) => (
                      <li
                        className={itemStyle}
                        onClick={() => clickOnItem(key)}
                        key={key}
                      >
                        {content}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>
          </Theme>
        </Portal>
      )}
    </div>
  );
}
