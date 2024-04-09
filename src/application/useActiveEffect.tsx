import { css } from "@emotion/css";
import { RefObject, useMemo } from "react";
import { useMouseHovered } from "react-use";
import { VAR } from "../theme/style";
import { removeUndefined } from "../infrastructure/object";

type Props = {
  position?: "absolute" | "fixed" | "sticky" | "relative";
  color?: string;
};

export const useActiveEffect = (ref: RefObject<Element>, option?: Props) => {
  const usedOptions = {
    position: "relative",
    color: VAR.COLOR.ACCENT.MAIN.WEAKER,
    ...removeUndefined(option),
  };
  const { elX, elY, elH, elW } = useMouseHovered(ref, {
    bound: true,
    whenHovered: true,
  });

  const beforeStyle = useMemo(
    () =>
      css(`
    position: ${usedOptions.position};
    overflow: hidden;

    ::before{
      content: '';
      z-index:0;
      position: absolute;
      width: 1px;
      height: 1px;
      background: ${usedOptions.color};
      transition: transform 0.1s ease-in;
      transform-origin: center;
      border-radius: 9999px;
      mix-blend-mode: multiply;
    }
    :hover{
      ::before{
        top: ${elY}px;
        left: ${elX}px;
      }
    }
    :active{
      ::before{
        transform: scale(${elH > elW ? elH * 2 : elW * 2});
      }
    }
  `),
    [elX, elY, elH, elW, option]
  );

  return { beforeStyle } as const;
};
