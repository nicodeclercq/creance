import { type ReactNode } from "react";
import { PageTemplate } from "./PageTemplate";
import { Event } from "../../models/Event";
import { useTranslation } from "react-i18next";
import { Action, QuickActions } from "../../ui/QuickActions/QuickActions";
import { useStore } from "../../store/StoreProvider";
import { useRoute } from "../../hooks/useRoute";

type EventPageTemplateProps = {
  children: ReactNode;
  event: Event;
};

export function EventPageTemplate({ children, event }: EventPageTemplateProps) {
  const { t } = useTranslation();
  const { goTo } = useRoute();
  const [_, setEvents] = useStore("events");

  const actions: Action[] = event.isClosed
    ? []
    : [
        {
          label: t("page.event.list.actions.updateUsers"),
          icon: "user-group",
          as: "link",
          to: "SHARES",
          params: { eventId: event._id },
        },
        {
          label: t("page.event.list.actions.updateCategories"),
          icon: "folder",
          as: "link",
          to: "CATEGORIES_EDIT",
          params: { eventId: event._id },
        },
        {
          label: t("page.event.list.actions.addExpense"),
          icon: "shopping-cart",
          as: "link",
          to: "EXPENSE_ADD",
          params: { eventId: event._id },
        },
        {
          label: t("page.event.list.actions.lock"),
          icon: "lock",
          onClick: () => {
            setEvents((events) => ({
              ...events,
              [event._id]: {
                ...event,
                isClosed: !event.isClosed,
              },
            }));
            goTo("EVENT_LIST");
          },
        },
      ];

  return (
    <PageTemplate
      title={event.name}
      leftAction={{
        as: "link",
        to: "EVENT_LIST",
        label: t("page.event.list.actions.backToList"),
        icon: "chevron-left",
      }}
      menu={[
        {
          label: t("page.menu.expenses"),
          icon: "shopping-cart",
          as: "link",
          to: "EVENT",
          params: { eventId: event._id },
        },
        {
          label: t("page.menu.shares"),
          icon: "user-share",
          as: "link",
          to: "EVENT_USER_SHARE",
          params: { eventId: event._id },
        },
        {
          label: t("page.menu.distribution"),
          icon: "give-money",
          as: "link",
          to: "EVENT_DISTRIBUTION",
          params: { eventId: event._id },
        },
      ]}
    >
      {children}
      {actions.length > 1 && (
        <QuickActions
          icon="add"
          label={t("component.quickActions.label")}
          actions={actions}
        />
      )}
    </PageTemplate>
  );
}
