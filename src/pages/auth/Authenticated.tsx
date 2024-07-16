import { useState, useEffect, ReactNode } from "react";
import { Session, createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Container } from "../../shared/layout/container/container";
import { Card } from "../../shared/library/card/card";
import { Stack } from "../../shared/layout/stack/stack";
import { secrets } from "../../secrets";
import { THEME_COLOR } from "../../entities/color";
import { useTranslations } from "../../hooks/useTranslation";

const supabase = createClient(secrets.supabaseUrl, secrets.supabaseKey);

type Props = {
  children: ReactNode;
};

export function Authenticated({ children }: Props) {
  const [session, setSession] = useState<Session>();
  const translations = useTranslations();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session ?? undefined);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? undefined);
    });

    return () => subscription.unsubscribe();
  }, []);

  return !session ? (
    <Container background="PRIMARY" height="100vh" paddingY="XXL">
      <Stack spacing="XL" align="CENTER" justify="CENTER">
        <Card>
          <Auth
            supabaseClient={supabase}
            localization={{
              variables: {
                sign_in: {
                  email_label: translations["auth.input.email"],
                  password_label: translations["auth.input.password"],
                  button_label: translations["auth.button.login"],
                },
              },
            }}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: THEME_COLOR.ACCENT,
                    brandAccent: THEME_COLOR.ACCENT_DARK,
                    brandButtonText: THEME_COLOR.WHITE,
                  },
                  fonts: {
                    bodyFontFamily: "Roboto",
                    labelFontFamily: "Cormorant",
                    inputFontFamily: "Roboto",
                  },
                  radii: {
                    buttonBorderRadius: "9999rem",
                  },
                },
              },
            }}
            showLinks={false}
          />
        </Card>
      </Stack>
    </Container>
  ) : (
    children
  );
}
