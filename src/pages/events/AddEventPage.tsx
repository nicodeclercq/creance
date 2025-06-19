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
import { uid } from "../../uid";
import { useTranslation } from "react-i18next";

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
  const [users, setUsers] = useStore("users");
  const [_, setEvents] = useStore("events");
  const [currentStep, setCurrentStep] = useState(0);
  const [step1Data, setStep1Data] = useState<Step1Data>(initialStateStep1);
  const [step2Data, setStep2Data] = useState<Step2Data>({
    categories: DEFAULT_CATEGORIES.map((category) => ({
      ...category,
      name: t(category.name),
    })),
  });
  const [step3Data, setStep3Data] = useState<Step3Data>({
    users: Object.values(users),
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
    setStep3Data(data);
    setEvents((events) => {
      const id = uid();

      return {
        ...events,
        [id]: {
          _id: id,
          name: step1Data.name,
          shares: data.users.reduce(
            (acc, user) => ({
              ...acc,
              [user._id]: { type: "default" },
            }),
            {}
          ),
          period: {
            start: step1Data.dates.start,
            end: step1Data.dates.end,
            arrival: step1Data.arrival,
            departure: step1Data.departure,
          },
          description: step1Data.description,
          expenses: [],
          deposits: [],
          categories: step2Data.categories.reduce(
            (acc, category) => ({ ...acc, [category._id]: category }),
            {} as Record<string, Category>
          ),
          participants: data.users.map((user) => user._id),
          updatedAt: new Date(),
        },
      };
    });
    setUsers((currentUsers) => {
      const additionalUsers = data.users
        .filter((user) => user._id in currentUsers === false)
        .reduce(
          (acc, user) => ({
            ...acc,
            [user._id]: { ...user, updatedAt: new Date() },
          }),
          {}
        );
      return { ...currentUsers, ...additionalUsers };
    });
    goTo("EVENT_LIST");
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
