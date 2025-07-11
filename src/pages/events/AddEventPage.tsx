import { AddEventStep1, Step1Data } from "./private/AddEventStep1";
import { AddEventStep2, Step2Data } from "./private/AddEventStep2";
import { PageTemplate } from "../../shared/PageTemplate/PageTemplate";
import { Stepper } from "../../ui/Stepper/Stepper";
import { useState } from "react";
import { Category, DEFAULT_CATEGORIES } from "../../models/Category";
import { AddEventStep3, Step3Data } from "./private/AddEventStep3";
import { useStore } from "../../store/StoreProvider";
import { Card } from "../../ui/Card/Card";
import { useRoute } from "../../hooks/useRoute";
import { useTranslation } from "react-i18next";
import { generateKey, uid } from "../../service/crypto";
import { Participant } from "../../models/Participant";
import { Account } from "../../models/Account";

const now = new Date();

const initialStateStep1 = {
  name: "",
  description: "",
  dates: {
    start: now,
    end: now,
  },
  arrival: "PM",
  departure: "AM",
  isAutoClose: true,
} as const satisfies Step1Data;

export function AddEventPage() {
  const { t } = useTranslation();
  const { goTo } = useRoute();
  const [_, setEvents] = useStore("events");
  const [currentStep, setCurrentStep] = useState(0);
  const [account, setAccount] = useStore("account");
  const [currentUserId] = useStore("currentParticipantId");
  const [step1Data, setStep1Data] = useState<Step1Data>(initialStateStep1);
  const [step2Data, setStep2Data] = useState<Step2Data>({
    categories: DEFAULT_CATEGORIES.map((category) => ({
      ...category,
      name: t(category.name),
    })),
  });
  const [step3Data, setStep3Data] = useState<Step3Data>({
    participants: [
      {
        _id: currentUserId,
        name: account?.name ?? "",
        updatedAt: new Date(),
        avatar: account?.avatar ?? "",
        share: account?.share ?? {
          adults: 1,
          children: 0,
        },
        participantShare: { type: "default" },
      },
    ],
  });

  const goToStep2 = (data: Step1Data) => {
    setCurrentStep((a) => a + 1);
    setStep1Data(data);
  };
  const goToStep3 = (data: Step2Data) => {
    setCurrentStep((a) => a + 1);
    setStep2Data(data);
  };
  const goToStep4 = (data: Step3Data) => {
    const eventId = uid();
    Promise.resolve()
      .then(() => generateKey(uid()))
      .then((eventKey) => {
        setStep3Data(data);
        setEvents((events) => ({
          ...events,
          [eventId]: {
            _id: eventId,
            name: step1Data.name,
            participants: data.participants.reduce(
              (acc, participant) => ({
                ...acc,
                [participant._id]: {
                  ...participant,
                  updatedAt: new Date(),
                  participantShare: { type: "default" },
                },
              }),
              {} as Record<string, Participant>
            ),
            period: {
              start: step1Data.dates.start,
              end: step1Data.dates.end,
              arrival: step1Data.arrival,
              departure: step1Data.departure,
            },
            description: step1Data.description,
            expenses: {},
            deposits: {},
            categories: step2Data.categories.reduce(
              (acc, category) => ({ ...acc, [category._id]: category }),
              {} as Record<string, Category>
            ),
            updatedAt: new Date(),
          },
        }));

        setAccount((account) => ({
          ...(account as Account),
          events: {
            ...account?.events,
            [eventId]: {
              key: eventKey,
              uid: (account as Account)._id,
            },
          },
        }));

        goTo("EVENT_LIST");
      });
  };

  return (
    <PageTemplate title={t("page.events.add.title")}>
      <Card>
        <Stepper
          currentStep={currentStep}
          steps={[
            {
              title: t("page.events.add.form.step1.title"),
              description: t("page.events.add.form.step1.description"),
            },
            {
              title: t("page.events.add.form.step2.title"),
              description: t("page.events.add.form.step2.description"),
            },
            {
              title: t("page.events.add.form.step3.title"),
              description: t("page.events.add.form.step3.description"),
            },
          ]}
        >
          {currentStep === 0 && (
            <AddEventStep1 onNext={goToStep2} data={step1Data} />
          )}
          {currentStep === 1 && (
            <AddEventStep2
              data={step2Data}
              onNext={goToStep3}
              onPrevious={(data) => {
                setStep2Data(data);
                setCurrentStep((a) => a - 1);
              }}
            />
          )}
          {currentStep === 2 && (
            <AddEventStep3
              data={step3Data}
              onNext={goToStep4}
              onPrevious={(data) => {
                setStep3Data(data);
                setCurrentStep((a) => a - 1);
              }}
            />
          )}
        </Stepper>
      </Card>
    </PageTemplate>
  );
}
