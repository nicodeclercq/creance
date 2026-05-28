import type { Step1Data } from "../../pages/events/private/EventStep1Form";
import type { Step2Data } from "./private/AddEventStep2";
import { AddEventStep2 } from "./private/AddEventStep2";
import { PageTemplate } from "../../shared/PageTemplate/PageTemplate";
import { Stepper } from "../../ui/Stepper/Stepper";
import { useState } from "react";
import { DEFAULT_CATEGORIES } from "../../models/Category";
import type { Step3Data } from "./private/AddEventStep3";
import { AddEventStep3 } from "./private/AddEventStep3";
import { Card } from "../../ui/Card/Card";
import { useRoute } from "../../hooks/useRoute";
import { useTranslation } from "react-i18next";
import { generateKey, uid } from "../../service/crypto";
import type { Account } from "../../models/Account";
import { EventStep1Form } from "./private/EventStep1Form";
import {
  addMergeableCollectionItem,
  createEmptyMergeableCollection,
  createMergeableRecord,
  updateMergeableCollection,
  updateMergeableRecord,
} from "../../models/mergeable";
import { useCurrentUser } from "../../store/useCurrentUser";
import { useStoreData } from "../../store/useData";

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
  const [, setState] = useStoreData();
  const [currentStep, setCurrentStep] = useState(0);
  const { currentUser, userId } = useCurrentUser();
  const [step1Data, setStep1Data] = useState<Step1Data>(initialStateStep1);
  const [step2Data, setStep2Data] = useState<Step2Data>({
    categories: DEFAULT_CATEGORIES.map((category) => ({
      ...category,
      name: t(category.name),
    })),
  });
  const [step3Data, setStep3Data] = useState<Step3Data>({
    participants: [
      createMergeableRecord({
        _id: userId,
        name: currentUser.name,
        avatar: currentUser.avatar,
        share: currentUser.share,
        participantShare: { type: "default" },
      }),
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

    const dates =
      step1Data.dates.start > step1Data.dates.end
        ? {
            start: step1Data.dates.end,
            end: step1Data.dates.start,
          }
        : step1Data.dates;

    Promise.resolve()
      .then(() => generateKey(uid()))
      .then((eventKey) => {
        setStep3Data(data);

        setState(({ account, events, ...other }) => ({
          ...other,
          account: updateMergeableRecord({
            ...(account as Account),
            events: addMergeableCollectionItem(
              eventId,
              {
                eventId: eventKey,
                userId,
              },
              account.events,
            ),
          }),
          events: addMergeableCollectionItem(
            eventId,
            {
              _id: eventId,
              name: step1Data.name,
              hasProgram: step1Data.hasProgram,
              participants: updateMergeableCollection(data.participants),
              period: {
                start: dates.start,
                end: dates.end,
                arrival: step1Data.arrival,
                departure: step1Data.departure,
              },
              description: step1Data.description,
              expenses: createEmptyMergeableCollection(),
              deposits: createEmptyMergeableCollection(),
              categories: updateMergeableCollection(step2Data.categories),
              activities: createEmptyMergeableCollection(),
              mealManager: {},
            },
            events,
          ),
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
            <EventStep1Form
              defaultValues={step1Data}
              onSubmit={goToStep2}
              submitLabel={t("page.events.add.form.submit")}
              cancel={{
                as: "link",
                label: t("page.events.add.form.cancel"),
                to: "EVENT_LIST",
              }}
            />
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
