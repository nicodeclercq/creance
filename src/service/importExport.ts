import * as ArrayFP from "fp-ts/Array";
import * as Either from "fp-ts/Either";
import * as z from "zod";

import {
  depositSchema as defaultDepositSchema,
  eventSchema as defaultEventSchema,
  expenseSchema as defaultExpenseSchema,
  participantSchema as defaultParticipantSchema,
} from "../adapters/json";
import { flow, pipe } from "fp-ts/function";

import { Deposit } from "../models/Deposit";
import { Event } from "../models/Event";
import { Expense } from "../models/Expense";
import { Participant } from "../models/Participant";
import { uid } from "./crypto";
import { withoutKey } from "../helpers/object";

const participantSchema = defaultParticipantSchema.omit({
  updatedAt: true,
});
const expenseSchema = defaultExpenseSchema.omit({
  updatedAt: true,
});
const depositSchema = defaultDepositSchema.omit({
  updatedAt: true,
});
const eventSchema = defaultEventSchema
  .omit({
    updatedAt: true,
    expenses: true,
    deposits: true,
  })
  .extend({
    participants: z.array(participantSchema),
    expenses: z.array(expenseSchema),
    deposits: z.array(depositSchema),
  });

type ExportedData = z.infer<typeof eventSchema>;

export function toExportedData({ event }: { event: Event }): ExportedData {
  return {
    ...withoutKey(event, "updatedAt"),
    participants: Object.values(event.participants).map((participant) =>
      withoutKey(participant, "updatedAt")
    ),
    expenses: Object.values(event.expenses).map((expense) =>
      withoutKey(expense, "updatedAt")
    ),
    deposits: Object.values(event.deposits).map((deposit) =>
      withoutKey(deposit, "updatedAt")
    ),
  };
}

export function fromExportedData(data: ExportedData): Either.Either<
  Error,
  {
    event: Event;
  }
> {
  const now = new Date();
  const {
    participants: dataParticipants,
    expenses,
    deposits,
    ...eventData
  } = data;

  const expensesMap: Record<string, Expense> = expenses.reduce(
    (acc, expense) => ({
      ...acc,
      [expense._id]: {
        ...expense,
        updatedAt: now,
      },
    }),
    {}
  );

  const depositsMap: Record<string, Deposit> = deposits.reduce(
    (acc, deposit) => ({
      ...acc,
      [deposit._id]: {
        ...deposit,
        updatedAt: now,
      },
    }),
    {}
  );

  const participantsMap: Record<string, Participant> = dataParticipants.reduce(
    (acc, participant) => ({
      ...acc,
      [participant._id]: {
        ...participant,
        updatedAt: now,
      },
    }),
    {}
  );

  const event: Event = {
    ...eventData,
    updatedAt: now,
    participants: participantsMap,
    expenses: expensesMap,
    deposits: depositsMap,
  };

  return Either.right({
    event,
  });
}

function removeSpecialChars(str: string) {
  return str.replace(/[^a-zA-Z0-9]/g, "_");
}

export function exportData(name: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${removeSpecialChars(name)}-${new Date().toISOString()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function getEventModifications({
  data,
  currentState,
}: {
  data: ExportedData;
  currentState: {
    events: Record<string, Event>;
  };
}): Either.Either<
  Error,
  {
    events: Record<string, Event>;
  }
> {
  const areEqual = <T extends { updatedAt: Date }>(
    a: T | undefined,
    b: T | undefined
  ) => {
    if (a != null && b != null) {
      const { updatedAt: updateAtA, ...dataA } = a;
      const { updatedAt: updateAtB, ...dataB } = b;
      JSON.stringify(dataA) === JSON.stringify(dataB);
    }
    return false;
  };

  return pipe(
    fromExportedData(data),
    Either.map((formattedData) => {
      const currentEvent = currentState.events[formattedData.event._id];
      const result: {
        events: Record<string, Event>;
      } = {
        events: {},
      };

      if (!areEqual(currentEvent, formattedData.event)) {
        result.events[formattedData.event._id] = formattedData.event;
      }

      return result;
    })
  );
}

function getArrayOfEventsModifications({
  data,
  currentState,
}: {
  data: ExportedData[];
  currentState: {
    events: Record<string, Event>;
  };
}): Either.Either<
  Error,
  {
    events: Record<string, Event>;
  }
> {
  return pipe(
    data,
    ArrayFP.map((event) =>
      getEventModifications({ data: event, currentState })
    ),
    Either.sequenceArray,
    Either.map((modifications) =>
      modifications.reduce(
        (acc, modification) => {
          acc.events = { ...acc.events, ...modification.events };

          return acc;
        },
        {
          events: {},
        } as {
          events: Record<string, Event>;
        }
      )
    )
  );
}

export function readData({
  file,
  currentState,
}: {
  file: File;
  currentState: {
    events: Record<string, Event>;
  };
}): Promise<
  Either.Either<
    Error,
    {
      events: Record<string, Event>;
    }
  >
> {
  return new Promise<Either.Either<Error, string>>((resolve) => {
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(Either.right(event.target.result as string));
        } else {
          resolve(Either.left(new Error("File is empty or invalid.")));
        }
      };
      reader.onabort = () => {
        resolve(Either.left(new Error("File reading was aborted.")));
      };
      reader.onerror = () => {
        resolve(Either.left(new Error("File reading failed.")));
      };
      reader.readAsText(file, "UTF-8");
    } catch (error) {
      resolve(Either.left(new Error("Failed to parse file.")));
    }
  }).then(
    flow(
      Either.map((data) => JSON.parse(data)),
      Either.chain((data: unknown) => {
        const arrayOfEvents = z.array(eventSchema).safeParse(data);
        if (arrayOfEvents.success) {
          return getArrayOfEventsModifications({
            data: arrayOfEvents.data,
            currentState,
          });
        }
        const singleEvent = eventSchema.safeParse(data);
        if (singleEvent.success) {
          return getEventModifications({
            data: singleEvent.data,
            currentState,
          });
        }
        console.error("Invalid data format:", singleEvent.error);

        return Either.left(new Error("Invalid data format."));
      })
    )
  );
}

export function importData({ events }: { events: Record<string, Event> }) {
  return new Promise<
    Either.Either<
      Error,
      {
        events: Record<string, Event>;
      }
    >
  >((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;
      return readData({
        file,
        currentState: {
          events,
        },
      })
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          console.error("Import failed:", error);
          resolve(Either.left(error));
        });
    };
    input.click();
  });
}

export function exportEventAsJson(event: Event): string {
  const data = {
    name: event.name,
    description: event.description,
    period: event.period,
    participants: Object.values(event.participants).map((participant) =>
      withoutKey(participant, "updatedAt")
    ),
    categories: Object.values(event.categories),
    expenses: Object.values(event.expenses).map((expense) =>
      withoutKey(expense, "updatedAt")
    ),
    deposits: Object.values(event.deposits).map((deposit) =>
      withoutKey(deposit, "updatedAt")
    ),
    isAutoClose: event.isAutoClose,
  };

  return JSON.stringify(data, null, 2);
}

export function importEventFromJson(json: string): Event {
  const data = JSON.parse(json);
  const {
    participants: dataParticipants,
    expenses,
    deposits,
    ...eventData
  } = data;

  const participants = dataParticipants.reduce(
    (acc: Record<string, Participant>, participant: Participant) => {
      acc[participant._id] = participant;
      return acc;
    },
    {}
  );

  const eventExpenses = expenses.reduce(
    (acc: Record<string, Expense>, expense: Expense) => {
      acc[expense._id] = expense;
      return acc;
    },
    {}
  );

  const eventDeposits = deposits.reduce(
    (acc: Record<string, Deposit>, deposit: Deposit) => {
      acc[deposit._id] = deposit;
      return acc;
    },
    {}
  );

  const event: Event = {
    _id: uid(),
    participants,
    expenses: eventExpenses,
    deposits: eventDeposits,
    updatedAt: new Date(),
    ...eventData,
  };

  return event;
}
