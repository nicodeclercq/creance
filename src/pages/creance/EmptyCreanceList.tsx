import { Illustration } from "../../components/Illustration/Illustration";
import { Flex } from "../../components/layout/flex";
import { Text } from "../../components/text/text";
import { VAR } from "../../theme/style";

export function EmptyCreanceList() {
  return (
    <Flex gap="M" align="CENTER" padding={{ y: "L" }}>
      <Text>Aucune liste de créances.</Text>
      <Text color={VAR.COLOR.NEUTRAL.MAIN.WEAK}>
        Vous pouvez créer une nouvelle liste en cliquant sur le bouton ci-dessus
      </Text>
      <span
        style={{
          display: "flex",
          justifyContent: "end",
          padding: `0 ${VAR.SIZE.PADDING.HORIZONTAL.M}`,
          color: VAR.COLOR.NEUTRAL.SURFACE.WEAK,
          width: "100%",
        }}
      >
        <Illustration name="arrow" width="25%" />
      </span>
    </Flex>
  );
}
