import { Illustration, isIllustration } from "../Illustration/Illustration";
import { Bleed } from "../Bleed/Bleed";
import { Card } from "../Card/Card";
import { Container } from "../Container/Container";
import { Grid } from "../Grid/Grid";
import { MediaHidden } from "../MediaHidden/MediaHidden";
import { MediaOnly } from "../MediaOnly/MediaOnly";
import type { ReactNode } from "react";

type MediaCardProps = {
  children: ReactNode;
  image: string;
  color?: string;
};

function Image({ image, color }: { image: string; color: string }) {
  return (
    <>
      <MediaOnly media={"default"} styles={{ width: "100%", height: "100%" }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            minHeight: "8rem",
            backgroundImage: `url(${image})`,
            backgroundColor: color,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            borderTopLeftRadius: "var(--ui-semantic-radius-m)",
            borderTopRightRadius: "var(--ui-semantic-radius-m)",
          }}
        />
      </MediaOnly>
      <MediaHidden media={"default"} styles={{ width: "100%", height: "100%" }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            minHeight: "8rem",
            backgroundImage: `url(${image})`,
            backgroundColor: color,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            borderTopLeftRadius: "var(--ui-semantic-radius-m)",
            borderBottomLeftRadius: "var(--ui-semantic-radius-m)",
          }}
        />
      </MediaHidden>
    </>
  );
}

export function MediaCard({
  children,
  image,
  color = "transparent",
}: MediaCardProps) {
  return (
    <Card>
      <Grid columns={{ default: 1, md: ["15rem", "auto"] }} gap="m">
        {isIllustration(image) ? (
          <Container
            styles={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Illustration name={image} />
          </Container>
        ) : (
          <Bleed
            direction={{
              default: ["top", "left", "right"],
              md: ["top", "left", "bottom"],
            }}
            height={{ default: "10rem", md: "100%" }}
          >
            <Image image={image} color={color} />
          </Bleed>
        )}
        {children}
      </Grid>
    </Card>
  );
}
