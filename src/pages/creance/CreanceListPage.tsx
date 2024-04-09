import { MainLayout } from "../_layout/MainLayout";
import { List } from "../../components/List";
import { useCreance } from "../../application/useCreance";
import { FloatingButton } from "../../components/FloatingButton";
import { useCurrentUser } from "../../application/useCurrentUser";
import { Grid } from "../../components/layout/grid";
import { Title } from "../../components/text/title";
import { EmptyCreanceList } from "./EmptyCreanceList";
import { LinkAsIconButton } from "../../components/LinkAsIconButton";

export function CreanceListPage() {
  const [user] = useCurrentUser();
  const { list } = useCreance();

  return (
    <MainLayout user={user}>
      <List
        header={
          <Grid columns={["auto", "min-content"]} align="CENTER">
            <Title inheritColor>Liste des créances</Title>
            <LinkAsIconButton
              type="secondary"
              to="ADD_CREANCE"
              icon="add"
              size="L"
            />
          </Grid>
        }
        onEmpty={<EmptyCreanceList />}
        items={list}
        hasSeparators
        itemRenderer={(creance) => <span>{creance.name}</span>}
      />
      <FloatingButton icon="add" onClick={() => console.log("[YOUPI]")} />
    </MainLayout>
  );
}
