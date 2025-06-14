import { Card } from "../../ui/Card/Card";
import { CategoriesForm } from "../events/private/CategoriesForm";
import { Category } from "../../models/Category";
import { EventNotFoundPage } from "../event/private/EventNotFoundPage";
import { PageTemplate } from "../../shared/PageTemplate/PageTemplate";
import { Redirect } from "../../Redirect";
import { useParams } from "react-router-dom";
import { useRoute } from "../../hooks/useRoute";
import { useStore } from "../../store/StoreProvider";
import { useTranslation } from "react-i18next";

export function CategoriesPage() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const { goTo } = useRoute();
  const [currentEvent, setEvent] = useStore(`events.${eventId}`);

  if (!eventId || !currentEvent) {
    return <EventNotFoundPage />;
  }

  if (currentEvent.isClosed) {
    return <Redirect to="EVENT" params={{ eventId: currentEvent._id }} />;
  }

  const updateCategories = (categories: Category[]) => {
    setEvent((event) => ({
      ...event,
      categories: categories.reduce((acc, category) => {
        acc[category._id] = category;
        return acc;
      }, {} as Record<string, Category>),
    }));
    goTo("EVENT", { eventId: currentEvent._id });
  };

  return (
    <PageTemplate title={t("page.event.categories.title")}>
      <Card>
        <CategoriesForm
          defaultCategories={Object.values(currentEvent.categories)}
          cancel={{
            label: t("page.event.categories.actions.cancel"),
            onClick: () => goTo("EVENT", { eventId: currentEvent._id }),
          }}
          submit={{
            label: t("page.event.categories.actions.submit"),
            onClick: updateCategories,
          }}
        />
      </Card>
    </PageTemplate>
  );
}
