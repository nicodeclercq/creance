import React, { useEffect, useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';

export function usePortal(selector: string) {
  const [child, setChild] = useState<React.ReactNode>();

  useEffect(() => {
    const element = document.querySelector(selector);
    
    if(element) {
      ReactDOM
        .createRoot(element!)
        .render(<>{child}</>);
    }

    () => {
      const element = document.querySelector(selector);
      if (element) {
        element.innerHTML = '';
      }
    }
  }, [selector, child]);

  return useMemo(() => ({
    show: setChild,
  }), []);
}