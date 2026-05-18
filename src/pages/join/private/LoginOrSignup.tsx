import { Login } from "./Login";
import { Signup } from "./Signup";
import { useState } from "react";

type LoginOrSignup = {
  initialState: "login" | "signup";
  onNext: (isNewUser: boolean) => void;
};

export function LoginOrSignup({ onNext, initialState }: LoginOrSignup) {
  const [state, setState] = useState(initialState);

  return state === "login" ? (
    <Login
      onNext={() => onNext(false)}
      switchToSignup={() => setState("signup")}
    />
  ) : (
    <Signup
      onNext={() => onNext(true)}
      switchToLogin={() => setState("login")}
    />
  );
}
