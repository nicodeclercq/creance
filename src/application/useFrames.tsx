import { useEffect, useState } from "react";

export const useFrames = (frames: React.ReactNode[], time: number) => {
  const [frameNb, setFrameNb] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const newFrameNb = frameNb + 1 >= frames.length ? 0 : frameNb + 1;
      setFrameNb(newFrameNb);
    }, time / frames.length);

    return () => clearInterval(interval);
  });

  return frames[frameNb];
};
