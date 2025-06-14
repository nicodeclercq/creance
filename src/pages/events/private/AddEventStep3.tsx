import { Controller, useFieldArray, useForm } from "react-hook-form";

import { Avatar } from "../../../ui/Avatar/Avatar";
import { Form } from "../../../ui/Form/Form";
import { Fragment } from "react/jsx-runtime";
import { Grid } from "../../../ui/Grid/Grid";
import { IconButton } from "../../../ui/IconButton/IconButton";
import { InputNumber } from "../../../ui/FormField/InputNumber/InputNumber";
import { InputText } from "../../../ui/FormField/InputText/InputText";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import { User } from "../../../models/User";
import styles from "./AddEventStep3.module.css";
import { uid } from "../../../uid";
import { useStore } from "../../../store/StoreProvider";
import { useTranslation } from "react-i18next";

export type Step3Data = {
  users: User[];
};
type AddEventStep3Props = {
  data: Step3Data;
  onNext: (data: Step3Data) => void;
  onPrevious: (data: Step3Data) => void;
};

type AddUsersFormProps = {
  users: User[];
  onAdd: (user: User) => void;
};

type AddUsersFormData = {
  name: string;
  adult: number;
  children: number;
};
function AddUsersForm({ onAdd, users }: AddUsersFormProps) {
  const { t } = useTranslation();
  const { control, handleSubmit, watch, reset } = useForm<AddUsersFormData>({
    defaultValues: {
      name: "",
      adult: 1,
      children: 0,
    },
  });

  const addUser = (data: AddUsersFormData) => {
    const newUser: User = {
      _id: uid(),
      name: data.name,
      avatar: data.name,
      share: {
        adult: data.adult,
        children: data.children,
      },
      updatedAt: new Date(),
    };
    onAdd(newUser);
    reset();
  };

  return (
    <div className={styles.addUserForm}>
      <div>
        <div style={{ font: "var(--ui-semantic-font-body-small)" }}>&nbsp;</div>
        <Avatar label={watch("name")} size="m" />
      </div>
      <Controller
        control={control}
        rules={{
          required: t("page.events.add.form.user.name.validation.required"),
          validate: {
            isUnique: (value) => {
              const isUnique = !users.some((user) => user.name === value);
              return (
                isUnique ||
                t("page.events.add.form.user.name.validation.isUnique")
              );
            },
          },
        }}
        name="name"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <div className={styles.name}>
            <InputText
              type="text"
              value={value}
              onChange={onChange}
              label={t("page.events.add.form.user.name.label")}
              isRequired
              error={error?.message}
            />
          </div>
        )}
      />
      <div>
        <div style={{ font: "var(--ui-semantic-font-body-small)" }}>&nbsp;</div>
        <IconButton
          icon="add"
          label={t("page.events.add.form.user.share.submit")}
          onClick={handleSubmit(addUser)}
          variant="tertiary"
        />
      </div>
      <div className={styles.fieldLegend}>
        {t("page.events.add.form.user.share.label")}
      </div>
      <Controller
        control={control}
        rules={{
          min: {
            value: 0,
            message: t("page.events.add.form.user.share.adults.validation.min"),
          },
        }}
        name="adult"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <InputNumber
            as="number"
            type="number"
            value={value}
            onChange={onChange}
            label={t("page.events.add.form.user.share.adults.label")}
            isRequired
            error={error?.message}
          />
        )}
      />
      <Controller
        control={control}
        rules={{
          min: {
            value: 0,
            message: t(
              "page.events.add.form.user.share.children.validation.min"
            ),
          },
        }}
        name="children"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <InputNumber
            as="number"
            type="number"
            value={value}
            onChange={onChange}
            label={t("page.events.add.form.user.share.children.label")}
            isRequired
            error={error?.message}
          />
        )}
      />
    </div>
  );
}

export function AddEventStep3({
  data,
  onNext,
  onPrevious,
}: AddEventStep3Props) {
  const { t } = useTranslation();
  const [currentUserId] = useStore("currentUserId");
  const { control, handleSubmit, watch, formState, getValues } =
    useForm<Step3Data>({
      defaultValues: data,
      mode: "onBlur",
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "users",
  });

  const removeUser = (id: string) => () => {
    const index = fields.findIndex((item) => item._id === id);
    remove(index);
  };
  const hasError = Object.keys(formState.errors).length > 0;
  return (
    <Form
      hasError={hasError}
      handleSubmit={handleSubmit}
      submit={{
        label: t("page.events.add.form.submit"),
        onClick: onNext,
      }}
      cancel={{
        label: t("page.events.add.form.previous"),
        onClick: () => onPrevious(getValues()),
      }}
    >
      <Grid
        columns={["min-content", "1fr", "min-content"]}
        gap="s"
        align="center"
        justify="start"
      >
        {fields.map((item) => (
          <Fragment key={item._id}>
            <Avatar label={item.name} size="m" />
            <div>
              <Paragraph styles={{ flexGrow: true }}>{item.name}</Paragraph>
              <Paragraph styles={{ font: "body-smaller" }}>
                {t("page.events.add.form.user.share.count", {
                  adults: item.share.adult,
                  children: item.share.children,
                })}
              </Paragraph>
            </div>
            {item._id === currentUserId ? (
              <span></span>
            ) : (
              <IconButton
                variant="tertiary"
                icon="trash"
                label={t("page.events.add.form.user.remove", {
                  name: item.name,
                })}
                onClick={removeUser(item._id)}
              />
            )}
          </Fragment>
        ))}
      </Grid>
      <AddUsersForm
        onAdd={(user: User) => append(user)}
        users={watch("users")}
      />
    </Form>
  );
}
