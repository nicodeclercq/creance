import React from "react";
import { Title } from "../../components/text/title";
import { Center } from "../../components/layout/center";
import { Fill } from "../../components/layout/fill";
import { VAR } from "../../theme/style";
import { Flex } from "../../components/layout/flex";
import { Form } from "../../components/form/Form";
import { useAuth } from "../../domain/auth/useAuth";
import { PigCard } from "../../components/PigCard";

export function Login() {
  const { connect } = useAuth();

  return (
    <Fill background={VAR.COLOR.BRAND.MAIN.BASE} scroll>
      <Center>
        <PigCard>
          <Flex padding={{ y: "M" }} gap="M">
            <Title>Bienvenue</Title>
            <Form
              fields={{
                email: {
                  defaultValue: "",
                  label: "Email",
                  isRequired: true,
                  autocomplete: "email",
                },
                password: {
                  defaultValue: "",
                  label: "Mot de passe",
                  isRequired: true,
                  kind: "password",
                  autocomplete: "current-password",
                },
                keepLoggedIn: {
                  defaultValue: true,
                  label: "Se souvenir de moi",
                  kind: "checkbox",
                },
              }}
              onCancel={console.log}
              onSubmit={connect}
            />
          </Flex>
        </PigCard>
      </Center>
    </Fill>
  );
}
