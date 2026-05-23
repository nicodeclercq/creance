import { useRef, useState, type ReactNode } from "react";
import { pipe } from "fp-ts/function";
import * as ArrayFP from "fp-ts/Array";
import { PageTemplate } from "./PageTemplate";
import type { Event } from "../../models/Event";
import { useTranslation } from "react-i18next";
import type { Action } from "../../ui/QuickActions/QuickActions";
import { QuickActions } from "../../ui/QuickActions/QuickActions";
import { useData } from "../../store/useData";
import { useRoute } from "../../hooks/useRoute";
import type { RouteName } from "../../router/routes";
import { ROUTES } from "../../router/routes";
import { dateToKey } from "../../utils/date";
import { AddActivityModal } from "../../pages/calendar/private/AddActivityModal";
import type { Activity } from "../../models/Activity";
import { MediaOnly } from "../../ui/MediaOnly/MediaOnly";
import { EditEventModal } from "../../pages/events/private/EditEventModal";
import type { Step1Data } from "../../pages/events/private/EventStep1Form";
import {
  addMergeableCollectionItem,
  deleteMergeableCollectionItem,
  updateMergeableRecord,
} from "../../models/mergeable";
import type { MenuProps } from "./Menu/Menu";

type EventPageTemplateProps = {
  children: ReactNode;
  event: Event;
};

export function EventPageTemplate({ children, event }: EventPageTemplateProps) {
  const currentDay = useRef(dateToKey(new Date()));
  const { t } = useTranslation();
  const { goTo } = useRoute();
  const [_, setEvent] = useData(`events.collection.${event._id}`);
  const [___, setEvents] = useData(`events`);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);

  const addActivity = (activity: Activity) => {
    setEvent((prev) => ({
      ...prev,
      activities: addMergeableCollectionItem(
        activity._id,
        activity,
        prev.activities,
      ),
    }));
  };

  const updateEvent = (data: Step1Data) => {
    setEvent((prev) =>
      updateMergeableRecord({
        ...prev,
        name: data.name,
        description: data.description,
        period: {
          start: data.dates.start,
          end: data.dates.end,
          arrival: data.arrival,
          departure: data.departure,
        },
        isAutoClose: data.isAutoClose,
      }),
    );
  };

  const actions = pipe(
    [
      event.hasProgram
        ? {
            label: t("page.event.list.actions.addActivity"),
            icon: "calendar-day",
            as: "button",
            onClick: () => {
              setIsActivityModalOpen(true);
            },
          }
        : undefined,
      {
        label: t("page.event.list.actions.addExpense"),
        icon: "shopping-cart",
        as: "link",
        to: "TRANSACTION_ADD",
        params: { eventId: event._id },
      } as Action<"TRANSACTION_ADD">,
    ] satisfies Array<Action<RouteName> | undefined>,
    ArrayFP.filter((a) => a != null),
  );

  const menu = pipe(
    [
      event.hasProgram
        ? {
            label: t("page.menu.calendar"),
            icon: "calendar-day",
            as: "link",
            to: "EVENT_CALENDAR",
            params: { eventId: event._id },
            hash: currentDay.current,
          }
        : undefined,
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
    ] as const,
    ArrayFP.filter((a) => a != null),
  ) as MenuProps["actions"];

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
            setEvents((currentEvents) =>
              deleteMergeableCollectionItem(event._id, currentEvents),
            );
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
            label: t("page.event.list.actions.editEvent"),
            icon: "edit",
            as: "button",
            onClick: () => setIsEditEventModalOpen(true),
          },
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
        menu={menu}
      >
        {children}
        {!event.isClosed && (
          <MediaOnly media={["default", "sm"]}>
            <QuickActions
              icon="add"
              label={t("component.quickActions.label")}
              actions={actions}
            />
          </MediaOnly>
        )}
      </PageTemplate>
      <AddActivityModal
        isOpen={isActivityModalOpen}
        setIsOpen={setIsActivityModalOpen}
        onSubmit={addActivity}
      />
      <EditEventModal
        event={event}
        isOpen={isEditEventModalOpen}
        setIsOpen={setIsEditEventModalOpen}
        onSubmit={updateEvent}
      />
    </>
  );
}
