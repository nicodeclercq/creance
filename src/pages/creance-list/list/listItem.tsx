import { Creance } from "../../../models/State";
import { Registered } from "../../../models/Registerable";
import { Accordion } from "../../../components/accordion";
import { Columns } from "../../../shared/layout/columns/columns";
import { Link } from "../../../shared/library/text/link/link";
import { ROUTES } from "../../../routes";
import { Avatar } from "../../../shared/library/avatar/avatar";
import { ColumnRigid } from "../../../shared/layout/columns/column-rigid";
import { Text } from "../../../shared/library/text/text/text";
import { Stack } from "../../../shared/layout/stack/stack";
import { Date } from "../../../components/date/date";
import { Confirm } from "../../../shared/library/modal/confirm";
import { ButtonGhost } from "../../../shared/library/button/buttonGhost";
import { Icon, ICONS } from "../../../shared/library/icon/icon";
import { Translate } from "../../../shared/translate/translate";
import { useCreanceState } from "../../../hooks/useCreanceState";
import { ButtonPrimary } from "../../../shared/library/button/buttonPrimary";
import { useRoute } from "../../../hooks/useRoute";
import { COLOR, toCssValue } from "../../../entities/color";
import { RADIUS } from "../../../entities/radius";

type Props = {
  creance: Registered<Creance>;
};

export function ListItem({ creance }: Props) {
  const { remove, isLocked } = useCreanceState(creance.id);
  const { goTo } = useRoute();

  const goToEditPage = () => {
    goTo(ROUTES.CREANCE_EDIT, { creanceId: creance.id });
  };

  return (
    <Accordion
      title={
        <Link
          to={ROUTES.EXPENSE_LIST}
          parameters={{ creanceId: creance.id }}
          display="block"
        >
          <Columns spacing="S">
            <ColumnRigid>
              {isLocked(creance) ? (
                <div
                  style={{
                    position: "relative",
                    filter: "saturate(0.25)",
                  }}
                >
                  <div
                    style={{
                      zIndex: 1,
                      position: "absolute",
                      bottom: "0rem",
                      left: "-0.125rem",
                      background: toCssValue(COLOR.WHITE),
                      color: toCssValue(COLOR.GREY_DARK),
                      borderRadius: RADIUS.rounded,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon name="LOCK" />
                  </div>
                  <Avatar icon={ICONS.PIG} name={creance.name} hideName />
                </div>
              ) : (
                <Avatar icon={ICONS.PIG} name={creance.name} hideName />
              )}
            </ColumnRigid>
            <Stack isFull>
              {creance.endDate ? (
                <Text color={COLOR.GREY_DARK} decoration="line-through">
                  {creance.name}
                </Text>
              ) : (
                <Text>{creance.name}</Text>
              )}
              <Date value={creance.date} />
            </Stack>
          </Columns>
        </Link>
      }
    >
      <Columns spacing="M" margin="S">
        <ColumnRigid>
          <Confirm
            onConfirm={() => remove(creance.id)}
            trigger={(open) => (
              <ButtonGhost iconLeft={ICONS.TRASH} onClick={open}>
                <Translate name="delete" />
              </ButtonGhost>
            )}
            action="delete"
          >
            <Text>
              <Translate name="creance.confirm.delete" />
            </Text>
          </Confirm>
        </ColumnRigid>
        <ColumnRigid>
          <ButtonPrimary iconLeft={ICONS.PENCIL} onClick={goToEditPage}>
            <Translate name="edit" />
          </ButtonPrimary>
        </ColumnRigid>
      </Columns>
    </Accordion>
  );
}
