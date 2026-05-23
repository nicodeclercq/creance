import { ROUTES, getPath } from "../../router/routes";

import { Button } from "../../ui/Button/Button";
import { Container } from "../../ui/Container/Container";
import { IconButton } from "../../ui/IconButton/IconButton";
import { Modal } from "../../ui/Modal/Modal";
import { Paragraph } from "../../ui/Paragraph/Paragraph";
import QRCode from "react-qr-code";
import { Stack } from "../../ui/Stack/Stack";
import { useData } from "../../store/useData";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const WAITING_TIME = 2000;

const wait = (time: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });

export function ShareButton() {
  const { t } = useTranslation();
  const { eventId } = useParams();

  const [currentEvent] = useData(`events.collection.${eventId}`);
  const [eventKey] = useData(`account.events.collection.${eventId}.eventId`);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  const shareLink = `${location.origin}${getPath(ROUTES.JOIN, {
    eventId: encodeURIComponent(currentEvent?._id),
    shareId: encodeURIComponent(eventKey),
  })}`;

  console.log("TMP", shareLink, currentEvent, eventKey);

  return currentEvent && eventKey ? (
    <>
      <IconButton
        icon="link"
        label={t("ShareButton.action.label")}
        onClick={() => {
          setIsModalVisible(true);
        }}
      />
      <Modal
        isOpen={isModalVisible}
        isDismissable
        onOpenChange={() => setIsModalVisible(false)}
        title={t("ShareButton.modal.title")}
      >
        <Stack gap="m" alignItems="center">
          <Container
            styles={{
              display: "flex",
              background: "white",
              padding: "m",
              radius: "l",
            }}
          >
            <QRCode
              value={shareLink}
              size={200}
              title={t("ShareButton.modal.qrcode.title")}
            />
          </Container>
          <Paragraph>{t("ShareButton.modal.description")}</Paragraph>
          <Button
            icon={{ name: isLinkCopied ? "check" : "link", position: "start" }}
            onClick={() => {
              navigator.clipboard
                .writeText(shareLink)
                .then(() => {
                  setIsLinkCopied(true);
                  return wait(WAITING_TIME);
                })
                .then(() => {
                  setIsLinkCopied(false);
                  setIsModalVisible(false);
                });
            }}
            label={t(
              isLinkCopied
                ? "ShareButton.modal.action.linkCopied"
                : "ShareButton.modal.action.copyLink",
            )}
          />
        </Stack>
      </Modal>
    </>
  ) : (
    <></>
  );
}
