import React from "react";
import { useForm } from "react-hook-form";

import { uid } from "../../../uid";
import { Label } from "../../../shared/library/text/label/label";
import { Translate } from "../../../shared/translate/translate";
import { Form } from "../../../shared/library/form/form";
import * as Registerable from "../../../models/Registerable";
import { Creance, defaultCreance } from "../../../models/State";
import { useCreanceState } from "../../../hooks/useCreanceState";
import { sort } from "../../../utils/date";
import { useTranslations } from "../../../hooks/useTranslation";
import { useParams } from "react-router-dom";

type Props = {
  onSubmit: () => void;
  onCancel: () => void;
  creance?: Registerable.Registered<Creance>;
};

type Value = string | undefined;
export type Option = {
  label: string | React.ReactNode;
  value: Value;
};

export function CreanceForm({ creance, onSubmit, onCancel }: Props) {
  const id = uid();
  const params = useParams();
  const creanceId = params.creanceId as string;
  const { of, add, update, getAll } = useCreanceState(creanceId);
  const translations = useTranslations();
  const { register, handleSubmit } = useForm();

  const creanceList = getAll();
  const options: Option[] = [
    {
      label: translations["creance.form.fromConfig.none"],
      value: undefined,
    } as Option,
  ].concat(
    creanceList
      .sort((a, b) => sort(b.date, a.date))
      .map((creance) => ({ label: creance.name, value: creance.id }))
  );

  // TODO: check data
  const submit = (data: { fromConfig?: unknown; name?: string }) => {
    const otherCreanceConfig =
      data.fromConfig == null
        ? {}
        : creanceList.reduce(
            (acc, { id, categories, users }) =>
              id === data.fromConfig
                ? {
                    categories,
                    users,
                    initialization: "INITIALIZED",
                  }
                : acc,
            {}
          );

    const newCreance = of({
      ...defaultCreance,
      ...otherCreanceConfig,
      name: data.name ?? "",
      ...creance,
    });
    if (creance) {
      update(newCreance as Registerable.Registered<Creance>);
    } else {
      add(newCreance as Registerable.Unregistered<Creance>);
    }
    onSubmit();
  };

  return (
    <Form
      onSubmit={handleSubmit(submit)}
      onCancel={onCancel}
      submitLabel={
        creance ? "creance.form.submit.update" : "creance.form.submit.add"
      }
    >
      <div>
        <Label htmlFor={`${id}-name`}>
          <Translate name="creance.form.name" />
        </Label>
        <input
          {...register("name")}
          defaultValue={creance?.name}
          id={`${id}-name`}
        />
      </div>
      {creance == null ? (
        <div>
          <Label htmlFor={`${id}-from-config`}>
            <Translate name="creance.form.fromConfig" />
          </Label>
          <select
            {...register("fromConfig")}
            defaultValue={undefined}
            id={`${id}-from-config`}
          >
            {options.map(({ value, label }) => (
              <option key={`${label}-${value}`} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <></>
      )}
    </Form>
  );
}
