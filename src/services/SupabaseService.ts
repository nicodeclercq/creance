import { createClient } from "@supabase/supabase-js";
import { Observable, delay, distinctUntilChanged } from "rxjs";
import { secrets } from "../secrets";
import { Creance, State } from "../models/State";
import * as Registerable from "../models/Registerable";
import { filterObject } from "../utils/object";

const creances: Record<
  string,
  {
    id?: number;
    created_at?: string;
    created_by?: string;
    value: Registerable.Registered<Creance>;
  }
> = {};

const supabase = createClient(secrets.supabaseUrl, secrets.supabaseKey);

type CreanceDTO = {
  id?: number;
  created_at?: string;
  created_by?: string;
  value: string;
};

const creanceAdapter = {
  from: (creance: CreanceDTO): Registerable.Registered<Creance> => {
    const value = JSON.parse(creance.value);
    creances[value.id] = {
      id: creance.id,
      created_at: creance.created_at,
      created_by: creance.created_by,
      value,
    };
    return Registerable.register(value);
  },
  to: (creance: Registerable.Registered<Creance>) => {
    const { id, created_at, created_by, value } = creances[creance.id] ?? {};
    return filterObject(
      {
        id,
        created_at,
        created_by,
        value: JSON.stringify(value),
      },
      (a) => a != null
    );
  },
};

export const getAllCreances = () =>
  supabase
    .from("creance")
    .select("*")
    .then(({ data, error }) => {
      if (error) {
        console.error(error);
        throw new Error(error.message);
      }
      return data;
    });

const isEqual = (
  a: Registerable.Registered<Creance>,
  b: Registerable.Registered<Creance>
) => JSON.stringify(a) === JSON.stringify(b);

export const saveState = ({ state }: { state: State }) => {
  state.creances.forEach((creance) => {
    if (creances[creance.id]) {
      if (!isEqual(creances[creance.id].value, creance)) {
        supabase
          .from("creance")
          .upsert([creanceAdapter.to(creance)])
          .then(({ data, error }) => {
            console.log("upsert", data, error);
          });
      }
    } else {
      supabase
        .from("creance")
        .insert([creanceAdapter.to(creance)])
        .then(({ data, error }) => {
          console.log("insert", data, error);
        });
    }
  });
};

export const connect = (state: Observable<State>) => {
  const subscription = state
    .pipe(distinctUntilChanged(), delay(100))
    .subscribe({
      next: (state) => {
        saveState({ state });
      },
    });

  return () => subscription.unsubscribe();
};

export const onChange = () =>
  supabase
    .channel("custom-all-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "creance" },
      (payload) => {
        console.log("Supabase Change received!", payload);
        // callBack();
      }
    )
    .subscribe();
