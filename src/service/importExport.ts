import * as ArrayFP from "fp-ts/Array";
import * as Either from "fp-ts/Either";
import * as z from "zod";

import {
  depositSchema as defaultDepositSchema,
  eventSchema as defaultEventSchema,
  expenseSchema as defaultExpenseSchema,
  userSchema as defaultUserSchema,
} from "../adapters/json";
import { flow, pipe } from "fp-ts/function";

import { Deposit } from "../models/Deposit";
import { Event } from "../models/Event";
import { Expense } from "../models/Expense";
import { User } from "../models/User";
import { withoutKey } from "../helpers/object";

const userSchema = defaultUserSchema.omit({
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
    users: z.array(userSchema),
    expenses: z.array(expenseSchema),
    deposits: z.array(depositSchema),
  });

type ExportedData = z.infer<typeof eventSchema>;

export function toExportedData({
  event,
  users,
}: {
  event: Event;
  users: Record<string, User>;
}): ExportedData {
  return {
    ...withoutKey(event, "updatedAt"),
    users: Object.keys(event.shares).map((userId) =>
      withoutKey(users[userId], "updatedAt")
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
    users: Record<string, User>;
  }
> {
  const now = new Date();
  const { users: dataUsers, expenses, deposits, ...eventData } = data;

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

  const event: Event = {
    ...eventData,
    updatedAt: now,
    expenses: expensesMap,
    deposits: depositsMap,
  };

  const users: Record<string, User> = dataUsers.reduce(
    (acc, user) => ({
      ...acc,
      [user._id]: {
        ...user,
        updatedAt: now,
      },
    }),
    {}
  );

  return Either.right({
    event,
    users,
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
    users: Record<string, User>;
  };
}): Either.Either<
  Error,
  {
    events: Record<string, Event>;
    users: Record<string, User>;
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
        users: Record<string, User>;
      } = {
        events: {},
        users: {},
      };

      if (!areEqual(currentEvent, formattedData.event)) {
        result.events[formattedData.event._id] = formattedData.event;
      }
      result.users = Object.values(formattedData.users).reduce((acc, user) => {
        if (
          !currentState.users[user._id] ||
          !areEqual(currentState.users[user._id], user)
        ) {
          acc[user._id] = user;
        }

        return acc;
      }, {} as Record<string, User>);

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
    users: Record<string, User>;
  };
}): Either.Either<
  Error,
  {
    events: Record<string, Event>;
    users: Record<string, User>;
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
          acc.users = { ...acc.users, ...modification.users };

          return acc;
        },
        {
          events: {},
          users: {},
        } as {
          events: Record<string, Event>;
          users: Record<string, User>;
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
    users: Record<string, User>;
  };
}): Promise<
  Either.Either<
    Error,
    {
      events: Record<string, Event>;
      users: Record<string, User>;
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

export function importData({
  events,
  users,
}: {
  events: Record<string, Event>;
  users: Record<string, User>;
}) {
  return new Promise<
    Either.Either<
      Error,
      {
        events: Record<string, Event>;
        users: Record<string, User>;
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
          users,
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
