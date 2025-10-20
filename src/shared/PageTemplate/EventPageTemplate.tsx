import { useRef, useState, type ReactNode } from "react";
import { PageTemplate } from "./PageTemplate";
import { Event } from "../../models/Event";
import { useTranslation } from "react-i18next";
import { Action, QuickActions } from "../../ui/QuickActions/QuickActions";
import { useData } from "../../store/useData";
import { useRoute } from "../../hooks/useRoute";
import { RouteName, ROUTES } from "../../routes";
import { dateToKey } from "../../utils/date";
import { AddActivityModal } from "../../pages/calendar/private/AddActivityModal";
import { Activity } from "../../models/Activity";
import { useCurrentUser } from "../../store/useCurrentUser";

type EventPageTemplateProps = {
  children: ReactNode;
  event: Event;
};

export function EventPageTemplate({ children, event }: EventPageTemplateProps) {
  const currentDay = useRef(dateToKey(new Date()));
  const { t } = useTranslation();
  const { goTo } = useRoute();
  const [_, setEvent] = useData(`events.${event._id}`);
  const [___, setEvents] = useData(`events`);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const { currentUser } = useCurrentUser();

  const addActivity = (activity: Activity) => {
    setEvent((prev) => ({
      ...prev,
      activities: {
        ...prev.activities,
        [activity._id]: activity,
      },
    }));
  };

  const actions = [
    {
      label: t("page.event.list.actions.addActivity"),
      icon: "calendar-day",
      as: "button",
      onClick: () => {
        setIsActivityModalOpen(true);
      },
    },
    {
      label: t("page.event.list.actions.addExpense"),
      icon: "shopping-cart",
      as: "link",
      to: "TRANSACTION_ADD",
      params: { eventId: event._id },
    } as Action<"TRANSACTION_ADD">,
  ] satisfies Action<RouteName>[];

  const eventActions = event.isClosed
    ? ([
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
      ] as const)
    : ([
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
      ] as const);

  return (
    <>
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
            label: t("page.event.list.actions.updateCategories"),
            icon: "folder",
            as: "link",
            to: "CATEGORIES_EDIT",
            params: { eventId: event._id },
          },
          {
            label: t("page.event.list.actions.updateParticipants"),
            icon: "user-group",
            as: "link",
            to: "EVENT_USERS",
            params: { eventId: event._id },
          },
          {
            as: "link",
            label: t("settings.actions.information"),
            icon: "help",
            to: ROUTES.INFORMATION,
          },
          ...eventActions,
        ]}
        menu={[
          {
            label: t("page.menu.calendar"),
            icon: "calendar-day",
            as: "link",
            to: "EVENT_CALENDAR",
            params: { eventId: event._id },
            hash: currentDay.current,
          },
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
        {actions.length > 1 && !event.isClosed && (
          <QuickActions
            icon="add"
            label={t("component.quickActions.label")}
            actions={actions}
          />
        )}
      </PageTemplate>
      <AddActivityModal
        isOpen={isActivityModalOpen}
        setIsOpen={setIsActivityModalOpen}
        onSubmit={addActivity}
        currentUser={currentUser}
      />
    </>
  );
}
