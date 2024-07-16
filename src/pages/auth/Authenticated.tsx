import { useState, useEffect, ReactNode } from "react";
import { Session, createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Container } from "../../shared/layout/container/container";
import { Card } from "../../shared/library/card/card";
import { Stack } from "../../shared/layout/stack/stack";
import { secrets } from "../../secrets";

const supabase = createClient(secrets.supabaseUrl, secrets.supabaseKey);

type Props = {
  children: ReactNode;
};

export function Authenticated({ children }: Props) {
  const [session, setSession] = useState<Session>();

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
    <Container background="ACCENT" height="100vh">
      <Stack spacing="XL" align="CENTER" justify="CENTER">
        <Card>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            showLinks={false}
          />
        </Card>
      </Stack>
    </Container>
  ) : (
    children
  );
}
