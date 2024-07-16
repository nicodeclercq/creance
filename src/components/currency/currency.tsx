import { useSettings } from "../../hooks/useSettings";
import { Translate } from "../../shared/translate/translate";
import { FONT } from "../../entities/font";
import { to2Decimals } from "../../utils/number";

export function Currency({ value }: { value: number }) {
  const [{ currency }] = useSettings();

  return (
    <span style={{ font: FONT.NUMERIC }}>
      <Translate
        name="currency"
        parameters={{ value: to2Decimals(value), currency }}
      />
    </span>
  );
}
