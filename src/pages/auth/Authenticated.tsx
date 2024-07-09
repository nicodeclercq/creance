import { useState, useEffect, ReactNode } from "react";
import { Session, createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Container } from "../../shared/layout/container/container";
import { Card } from "../../shared/library/card/card";
import { Stack } from "../../shared/layout/stack/stack";

const supabase = createClient(
  "https://pcvdgvtbkejownacrqjo.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjdmRndnRia2Vqb3duYWNycWpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxMTU1MDUsImV4cCI6MjAzMzY5MTUwNX0.STNtFS-enfSDOVaOhZFrQQw9PwGAH_HhMN-0D_-cThQ"
);

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
    <Container background="GREY_LIGHT" height="100vh">
      <Stack spacing="XL" align="CENTER" justify="CENTER">
        <Card>
          <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
        </Card>
      </Stack>
    </Container>
  ) : (
    children
  );
}
