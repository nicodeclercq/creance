import { useStore } from './useStore';

export const useSettings = () => {
  const { state } = useStore();

  return [{ currency: state.settings.currency }] as const;
}