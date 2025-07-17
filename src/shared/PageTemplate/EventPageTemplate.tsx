import { type ReactNode } from "react";
import { PageTemplate } from "./PageTemplate";
import { Event } from "../../models/Event";
import { useTranslation } from "react-i18next";
import { Action, QuickActions } from "../../ui/QuickActions/QuickActions";
import { useStore } from "../../store/StoreProvider";
import { useRoute } from "../../hooks/useRoute";
import { RouteName, ROUTES } from "../../routes";
import { exportData, toExportedData } from "../../service/importExport";

type EventPageTemplateProps = {
  children: ReactNode;
  event: Event;
};

export function EventPageTemplate({ children, event }: EventPageTemplateProps) {
  const { t } = useTranslation();
  const { goTo } = useRoute();
  const [_, setEvent] = useStore(`events.${event._id}`);
  const [___, setEvents] = useStore(`events`);

  const actions = (
    event.isClosed
      ? [
          {
            label: t("page.event.list.actions.delete"),
            icon: "trash",
            onClick: () => {
              // No need to clean up global expenses since they're embedded in events
              setEvents((currentEvents) => {
                const updatedEvents = { ...currentEvents };
                delete updatedEvents[event._id];
                return updatedEvents;
              });
              goTo("EVENT_LIST");
            },
          },
          {
            label: t("page.event.list.actions.unlock"),
            icon: "unlock",
            onClick: () => {
              setEvent((currentEvent) => ({
                ...currentEvent,
                isClosed: false,
              }));
              goTo("EVENT_LIST");
            },
          },
        ]
      : [
          {
            label: t("page.event.list.actions.lock"),
            icon: "lock",
            onClick: () => {
              setEvent((currentEvent) => ({
                ...currentEvent,
                isClosed: true,
              }));
              goTo("EVENT_LIST");
            },
          },
          {
            label: t("page.event.list.actions.updateCategories"),
            icon: "folder",
            as: "link",
            to: "CATEGORIES_EDIT",
            params: { eventId: event._id },
          } as Action<"CATEGORIES_EDIT">,
          {
            label: t("page.event.list.actions.updateParticipants"),
            icon: "user-group",
            as: "link",
            to: "SHARES",
            params: { eventId: event._id },
          } as Action<"SHARES">,
          {
            label: t("page.event.list.actions.addDeposit"),
            icon: "exchange-money",
            as: "link",
            to: "DEPOSIT_ADD",
            params: { eventId: event._id },
          } as Action<"DEPOSIT_ADD">,
          {
            label: t("page.event.list.actions.addExpense"),
            icon: "shopping-cart",
            as: "link",
            to: "EXPENSE_ADD",
            params: { eventId: event._id },
          } as Action<"EXPENSE_ADD">,
        ]
  ) satisfies Action<RouteName>[];

  return (
    <PageTemplate
      title={event.name}
      leftAction={{
        as: "link",
        to: "EVENT_LIST",
        label: t("page.event.list.actions.backToList"),
        icon: "chevron-left",
      }}
      rightActions={[
        {
          label: t("settings.actions.exportEvent"),
          icon: "download",
          onClick: () => {
            exportData(
              event.name,
              toExportedData({
                event,
              })
            );
          },
        },
        {
          as: "link",
          label: t("settings.actions.information"),
          icon: "help",
          to: ROUTES.INFORMATION,
        },
      ]}
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
          to: "EVENT_PARTICIPANT_SHARE",
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
