import { createClient } from "@supabase/supabase-js";
import { secrets } from "../secrets";
import { Creance } from "../models/State";
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
    return {
      id,
      created_at,
      created_by,
      value: JSON.stringify(value),
    };
  },
};

export const getAllCreances = () =>
  supabase
    .from("creance")
    .select("*")
    .order("created_at", { ascending: false })
    .then(({ data, error }) => {
      if (error) {
        console.error(error);
        throw new Error(error.message);
      }
      console.log("data", data);
      return data;
    });

export const createCreance = (creance: Registerable.Registered<Creance>) => {
  return supabase
    .from("creance")
    .insert({ value: JSON.stringify(creance) })
    .single()
    .then(({ data, error }) => {
      if (error) {
        throw error;
      }

      console.log("inserted", data);
      return data;
    });
};

export const updateCreance = (creance: Registerable.Registered<Creance>) =>
  supabase
    .from("creance")
    .update([creanceAdapter.to(creance)])
    .eq("id", creance.id)
    .single()
    .then(({ data, error }) => {
      if (error) {
        throw error;
      }

      console.log("upsert", data, error);
      return data;
    });

export const deleteCreance = (
  creanceId: Registerable.Registered<Creance>["id"]
) => supabase.from("creance").delete().eq("id", creanceId).single();

// TODO
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
