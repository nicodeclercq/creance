import * as z from "zod";

import { useEffect, useState } from "react";

import { Container } from "../Container/Container";
import { Drawer } from "@mui/material";
import { Heading } from "../Heading/Heading";

type Message = unknown[];

const Logger = (() => {
  const messages: Message[] = [];
  const listeners: (() => void)[] = [];

  const onAdd = (callback: () => void) => {
    listeners.push(callback);
    return () => {
      const index = listeners.indexOf(callback);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  };

  return {
    log: (title: string, ...args: Message) => {
      messages.push([title, ...args]);
      console.log(...args);
      listeners.forEach((listener) => listener());
    },
    onAdd,
    getMessages: () => messages,
    clear: () => {
      messages.length = 0;
    },
  };
})();

export const log = Logger.log;

export function Debug() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(Logger.getMessages());

  useEffect(
    () =>
      Logger.onAdd(() => {
        setMessages(Logger.getMessages());
      }),
    []
  );

  useEffect(() => {
    const eventHandler = () => {
      const isDebugActive = z
        .union([z.literal("false"), z.literal("true")])
        .transform((v) => v === "true")
        .safeParse(sessionStorage.getItem("debug"));

      if (isDebugActive.success && isDebugActive.data) {
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("dblclick", eventHandler);
    return () => {
      document.removeEventListener("dblclick", eventHandler);
    };
  }, []);

  return (
    <Drawer open={open} onClose={() => setOpen(false)}>
      <Container styles={{ width: "80vw", font: "body-smaller" }}>
        <Heading>Debug</Heading>
        <ul>
          {messages.map((message, index) => (
            <li
              key={index}
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "0.4rem",
                flexWrap: "wrap",
              }}
            >
              {message.map((arg, argIndex) => (
                <span key={argIndex}>
                  {["string", "number"].includes(typeof arg) ? (
                    <span
                      style={{
                        color: argIndex === 0 ? "red" : "rebeccapurple",
                      }}
                    >
                      {arg as string}
                    </span>
                  ) : (
                    <details style={{ display: "inline-block" }}>
                      <summary>
                        <span style={{ color: "rebeccapurple" }}>object</span>
                      </summary>
                      <pre>{JSON.stringify(arg, null, 2)}</pre>
                    </details>
                  )}
                </span>
              ))}
            </li>
          ))}
        </ul>
      </Container>
    </Drawer>
  );
}
