import { useEffect, useState } from "react";
import {
  Dialog,
  type DialogConfig,
  type DialogInstance,
  type DialogResult,
} from "./Dialog";

export type { DialogConfig, DialogResult };

const DialogStackManager = (function createDialogStackManager() {
  const instances = new Set<DialogInstance>();
  const listeners = new Set<(dailogs: DialogInstance[]) => void>();

  const notifyListeners = () => {
    listeners.forEach((listener) => listener(Array.from(instances)));
  };

  const add = (instance: DialogInstance) => {
    console.log("add dialog", instance.config.title);
    instances.add(instance);
    notifyListeners();
  };
  const remove = (instance: DialogInstance) => {
    instances.delete(instance);
    notifyListeners();
  };

  return {
    add,
    remove,
    getAll() {
      return Array.from(instances);
    },
    subscribe(onChange: (dialogs: DialogInstance[]) => void) {
      listeners.add(onChange);

      return () => {
        listeners.delete(onChange);
      };
    },
  };
})();

export function DialogStackHook() {
  const [dialogs, setDialogs] = useState(DialogStackManager.getAll());

  useEffect(() => DialogStackManager.subscribe(setDialogs), []);

  return (
    <>
      {dialogs.map((instance) => (
        <Dialog
          key={instance.id.toString()}
          instance={instance}
          onClose={() => DialogStackManager.remove(instance)}
        />
      ))}
    </>
  );
}

/**
 * @example
 * ```
 * openDialog({
 *   component: ({defaultData, onSubmit}) => (
 *    <button onClick={() => onSubmit(`Hello ${defaultData}`)}>Say Hello to {defaultData}</button>
 *   ),
 *   title: "Hello",
 *   defaultData: "World",
 * }).then((result) => {
 *   console.log(result.data);
 * });
 * ```
 */
export function openDialog<T = undefined>(
  config: Omit<DialogConfig<T>, "isDismissable">,
  defaultData?: T,
): Promise<DialogResult<T>> {
  return new Promise((resolve) => {
    const instance: DialogInstance<T> = {
      id: Symbol(),
      config: { ...config, isDismissable: false },
      resolve,
      defaultData,
    };

    DialogStackManager.add(instance as DialogInstance);
  });
}
