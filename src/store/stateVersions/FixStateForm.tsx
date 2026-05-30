import { Button } from "../../ui/Button/Button";
import { Columns } from "../../ui/Columns/Columns";
import { Container } from "../../ui/Container/Container";
import { Paragraph } from "../../ui/Paragraph/Paragraph";
import { Stack } from "../../ui/Stack/Stack";
import { stateSchema, type State } from "../state";
import { useState } from "react";
import z from "zod";

type Props = {
  defaultState: unknown;
  onSubmit: (state: State) => void;
  onCancel: () => void;
};

const parse = (state: string) => {
  const jsonSchema = z
    .string()
    .refine((value) => {
      try {
        JSON.parse(value);
        return true;
      } catch (_) {
        return false;
      }
    })
    .transform((value) => JSON.parse(value));

  const jsonResult = jsonSchema.safeParse(state);

  return jsonResult.success
    ? stateSchema.safeParse(jsonResult.data)
    : jsonResult;
};

export function FixTextForm({ defaultState, onCancel, onSubmit }: Props) {
  const [state, setState] = useState(JSON.stringify(defaultState, null, 2));
  const validationResult = parse(state);

  return (
    <Stack
      gap="m"
      styles={{
        maxWidth: "90vw",
        minWidth: "90vw",
      }}
    >
      {validationResult.error && (
        <Container styles={{ color: "failure-default" }}>
          <pre
            style={{
              font: "inherit",
              fontSize: "0.8em",
              maxHeight: "10rem",
              width: "100%",
              wordBreak: "break-all",
              overflowY: "auto",
            }}
          >
            {z.prettifyError(validationResult.error)}
          </pre>
        </Container>
      )}
      {validationResult.success && (
        <Paragraph
          styles={{
            color: "success-strong",
          }}
        >
          ✅ All fixed
        </Paragraph>
      )}
      <textarea
        style={{
          width: "100%",
          height: "30rem",
          resize: "vertical",
        }}
        value={state}
        onChange={(e) => setState(e.target.value)}
      />
      <Columns gap="m" justify="end">
        <Button variant="secondary" label="Cancel" onClick={onCancel} />
        <Button
          isDisabled={!validationResult.success}
          label="Continue"
          onClick={() => {
            if (validationResult.success) onSubmit(validationResult.data);
          }}
        />
      </Columns>
    </Stack>
  );
}
