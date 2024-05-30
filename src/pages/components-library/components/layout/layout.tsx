import { ComponentPreview } from "../../components-preview/components-preview";
import { Container } from "../../../../shared/layout/container/container";
import { Stack } from "../../../../shared/layout/stack/stack";
import { Inline } from "../../../../shared/layout/inline/inline";
import { Columns } from "../../../../shared/layout/columns/columns";
import { ColumnFlexible } from "../../../../shared/layout/columns/column-flexible";
import { ColumnRigid } from "../../../../shared/layout/columns/column-rigid";

const Placeholder = () => (
  <div
    style={{
      background: `
      linear-gradient(#DDD 4px, transparent 0),
      linear-gradient(45deg, transparent 74px, transparent 75px, #CCC 75px, #CCC 76px, transparent 77px, transparent 109px),
      linear-gradient(-45deg, transparent 75px, transparent 76px, #CCC 76px, #CCC 77px, transparent 78px, transparent 109px),
      #DDD
    `,
      backgroundSize: "100px 100px, 100px 100px, 100px 100px",
      backgroundPosition: "0px 0px, 0px 0px, 0px 0px",
      border: "1px solid",
      height: "5rem",
      overflow: "hidden",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "grey",
      textShadow: "1px 1px 1px #DDD",
    }}
  >
    Placeholder
  </div>
);

export function Layout() {
  return (
    <>
      <h2>Layout</h2>

      <ComponentPreview label="Container">
        <div style={{ background: "pink", border: "1px dashed grey" }}>
          <Container>
            <Placeholder></Placeholder>
          </Container>
        </div>
        <div style={{ background: "pink", border: "1px dashed grey" }}>
          <Container padding="XXS" paddingX="XXS">
            <Placeholder></Placeholder>
          </Container>
        </div>
        <div style={{ background: "pink", border: "1px dashed grey" }}>
          <Container padding="XS">
            <Placeholder></Placeholder>
          </Container>
        </div>
        <div style={{ background: "pink", border: "1px dashed grey" }}>
          <Container padding="S">
            <Placeholder></Placeholder>
          </Container>
        </div>
        <div style={{ background: "pink", border: "1px dashed grey" }}>
          <Container padding="M">
            <Placeholder></Placeholder>
          </Container>
        </div>
        <div style={{ background: "pink", border: "1px dashed grey" }}>
          <Container padding="L">
            <Placeholder></Placeholder>
          </Container>
        </div>
        <div style={{ background: "pink", border: "1px dashed grey" }}>
          <Container padding="XL">
            <Placeholder></Placeholder>
          </Container>
        </div>
        <div style={{ background: "pink", border: "1px dashed grey" }}>
          <Container padding="XXL">
            <Placeholder></Placeholder>
          </Container>
        </div>
        <div style={{ background: "pink", border: "1px dashed grey" }}>
          <Container paddingX="XL">
            <Placeholder></Placeholder>
          </Container>
        </div>
        <div style={{ background: "pink", border: "1px dashed grey" }}>
          <Container paddingX="L" paddingY="M">
            <Placeholder></Placeholder>
          </Container>
        </div>
        <Container padding="S" border="DEFAULT">
          Hello World
        </Container>
        <Container padding="S" border="LIGHT" background="ERROR">
          Hello World
        </Container>
        <Container padding="S" background="PRIMARY">
          Hello World
        </Container>
        <Container radius="default" padding="S" background="PRIMARY">
          Hello World
        </Container>
        <div>
          <Container
            padding="S"
            shadow="M"
            radius="rounded"
            height="2rem"
            width="2rem"
            background="ACCENT"
            isInline={true}
          >
            Yo
          </Container>
        </div>
      </ComponentPreview>

      <ComponentPreview label="Stack">
        <div style={{ background: "pink", border: "1px dashed grey" }}>
          <Stack>
            <div style={{ background: "white", border: "1px solid" }}>
              <Placeholder />
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              <Placeholder />
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              <Placeholder />
            </div>
          </Stack>
        </div>
        <div style={{ background: "pink", border: "1px dashed grey" }}>
          <Stack spacing="XXS">
            <div style={{ background: "white", border: "1px solid" }}>
              <Placeholder />
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              <Placeholder />
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              <Placeholder />
            </div>
          </Stack>
        </div>
        <div style={{ background: "pink", border: "1px dashed grey" }}>
          <Stack spacing="XS">
            <div style={{ background: "white", border: "1px solid" }}>
              <Placeholder />
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              <Placeholder />
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              <Placeholder />
            </div>
          </Stack>
        </div>
        <div style={{ background: "pink", border: "1px dashed grey" }}>
          <Stack spacing="S">
            <div style={{ background: "white", border: "1px solid" }}>
              <Placeholder />
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              <Placeholder />
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              <Placeholder />
            </div>
          </Stack>
        </div>
        <div style={{ background: "pink", border: "1px dashed grey" }}>
          <Stack spacing="L">
            <div style={{ background: "white", border: "1px solid" }}>
              <Placeholder />
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              <Placeholder />
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              <Placeholder />
            </div>
          </Stack>
        </div>
        <div style={{ background: "pink", border: "1px dashed grey" }}>
          <Stack spacing="XL">
            <div style={{ background: "white", border: "1px solid" }}>
              <Placeholder />
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              <Placeholder />
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              <Placeholder />
            </div>
          </Stack>
        </div>
        <div style={{ background: "pink", border: "1px dashed grey" }}>
          <Stack spacing="XXL">
            <div style={{ background: "white", border: "1px solid" }}>
              <Placeholder />
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              <Placeholder />
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              <Placeholder />
            </div>
          </Stack>
        </div>
      </ComponentPreview>

      <ComponentPreview label="Inline">
        <div style={{ background: "pink", border: "1px dashed grey" }}>
          <Inline>
            <div style={{ background: "white", border: "1px solid" }}>
              <Placeholder />
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              <Placeholder />
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              <Placeholder />
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              <Placeholder />
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              <Placeholder />
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              <Placeholder />
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              <Placeholder />
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              <Placeholder />
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              <Placeholder />
            </div>
          </Inline>
        </div>
        <div style={{ background: "pink", border: "1px dashed grey" }}>
          <Inline>
            <div style={{ background: "white", border: "1px solid" }}>
              Hello
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              World
            </div>
            <div style={{ background: "white", border: "1px solid" }}>!!!</div>
            <div style={{ background: "white", border: "1px solid" }}>
              Hello
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              World
            </div>
            <div style={{ background: "white", border: "1px solid" }}>!!!</div>
            <div style={{ background: "white", border: "1px solid" }}>
              Hello
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              World
            </div>
            <div style={{ background: "white", border: "1px solid" }}>!!!</div>
          </Inline>
        </div>
        <div style={{ background: "pink", border: "1px dashed grey" }}>
          <Inline spacing="XXS">
            <div style={{ background: "white", border: "1px solid" }}>
              Hello
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              World
            </div>
            <div style={{ background: "white", border: "1px solid" }}>!!!</div>
            <div style={{ background: "white", border: "1px solid" }}>
              Hello
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              World
            </div>
            <div style={{ background: "white", border: "1px solid" }}>!!!</div>
            <div style={{ background: "white", border: "1px solid" }}>
              Hello
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              World
            </div>
            <div style={{ background: "white", border: "1px solid" }}>!!!</div>
          </Inline>
        </div>
        <div style={{ background: "pink", border: "1px dashed grey" }}>
          <Inline spacing="XS">
            <div style={{ background: "white", border: "1px solid" }}>
              Hello
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              World
            </div>
            <div style={{ background: "white", border: "1px solid" }}>!!!</div>
            <div style={{ background: "white", border: "1px solid" }}>
              Hello
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              World
            </div>
            <div style={{ background: "white", border: "1px solid" }}>!!!</div>
            <div style={{ background: "white", border: "1px solid" }}>
              Hello
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              World
            </div>
            <div style={{ background: "white", border: "1px solid" }}>!!!</div>
          </Inline>
        </div>
        <div style={{ background: "pink", border: "1px dashed grey" }}>
          <Inline spacing="S">
            <div style={{ background: "white", border: "1px solid" }}>
              Hello
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              World
            </div>
            <div style={{ background: "white", border: "1px solid" }}>!!!</div>
            <div style={{ background: "white", border: "1px solid" }}>
              Hello
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              World
            </div>
            <div style={{ background: "white", border: "1px solid" }}>!!!</div>
            <div style={{ background: "white", border: "1px solid" }}>
              Hello
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              World
            </div>
            <div style={{ background: "white", border: "1px solid" }}>!!!</div>
          </Inline>
        </div>
        <div style={{ background: "pink", border: "1px dashed grey" }}>
          <Inline spacing="L">
            <div style={{ background: "white", border: "1px solid" }}>
              Hello
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              World
            </div>
            <div style={{ background: "white", border: "1px solid" }}>!!!</div>
            <div style={{ background: "white", border: "1px solid" }}>
              Hello
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              World
            </div>
            <div style={{ background: "white", border: "1px solid" }}>!!!</div>
            <div style={{ background: "white", border: "1px solid" }}>
              Hello
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              World
            </div>
            <div style={{ background: "white", border: "1px solid" }}>!!!</div>
          </Inline>
        </div>
        <div style={{ background: "pink", border: "1px dashed grey" }}>
          <Inline spacing="XL">
            <div style={{ background: "white", border: "1px solid" }}>
              Hello
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              World
            </div>
            <div style={{ background: "white", border: "1px solid" }}>!!!</div>
            <div style={{ background: "white", border: "1px solid" }}>
              Hello
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              World
            </div>
            <div style={{ background: "white", border: "1px solid" }}>!!!</div>
            <div style={{ background: "white", border: "1px solid" }}>
              Hello
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              World
            </div>
            <div style={{ background: "white", border: "1px solid" }}>!!!</div>
          </Inline>
        </div>
        <div style={{ background: "pink", border: "1px dashed grey" }}>
          <Inline spacing="XXL">
            <div style={{ background: "white", border: "1px solid" }}>
              Hello
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              World
            </div>
            <div style={{ background: "white", border: "1px solid" }}>!!!</div>
            <div style={{ background: "white", border: "1px solid" }}>
              Hello
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              World
            </div>
            <div style={{ background: "white", border: "1px solid" }}>!!!</div>
            <div style={{ background: "white", border: "1px solid" }}>
              Hello
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              World
            </div>
            <div style={{ background: "white", border: "1px solid" }}>!!!</div>
          </Inline>
        </div>
        <div style={{ background: "pink", border: "1px dashed grey" }}>
          <Inline spacingX="XL" spacingY="XS">
            <div style={{ background: "white", border: "1px solid" }}>
              Hello
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              World
            </div>
            <div style={{ background: "white", border: "1px solid" }}>!!!</div>
            <div style={{ background: "white", border: "1px solid" }}>
              Hello
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              World
            </div>
            <div style={{ background: "white", border: "1px solid" }}>!!!</div>
            <div style={{ background: "white", border: "1px solid" }}>
              Hello
            </div>
            <div style={{ background: "white", border: "1px solid" }}>
              World
            </div>
            <div style={{ background: "white", border: "1px solid" }}>!!!</div>
          </Inline>
        </div>
      </ComponentPreview>
      <ComponentPreview label="Columns">
        <div style={{ background: "pink", border: "1px dashed grey" }}>
          <Columns spacing="M">
            <ColumnRigid>
              <Placeholder />
            </ColumnRigid>
            <ColumnFlexible>
              <Placeholder />
            </ColumnFlexible>
            <ColumnRigid>
              <Placeholder />
            </ColumnRigid>
          </Columns>
        </div>
        <div style={{ background: "pink", border: "1px dashed grey" }}>
          <Columns align="CENTER" spacing="S">
            <ColumnFlexible>
              <Placeholder />
            </ColumnFlexible>
            <ColumnRigid>
              <span style={{ background: "white", border: "1px solid" }}>
                Hello
              </span>
            </ColumnRigid>
            <ColumnRigid>
              <span style={{ background: "white", border: "1px solid" }}>
                World
              </span>
            </ColumnRigid>
            <ColumnFlexible>
              <Placeholder />
            </ColumnFlexible>
          </Columns>
        </div>
        <div style={{ background: "pink", border: "1px dashed grey" }}>
          <Columns justify="SPACE_EVENLY" align="CENTER" spacing="S">
            <ColumnFlexible>
              <Placeholder />
            </ColumnFlexible>
            <ColumnFlexible align="END">
              <div style={{ background: "white", border: "1px solid" }}>
                Hello
              </div>
            </ColumnFlexible>
            <ColumnFlexible align="START">
              <div style={{ background: "white", border: "1px solid" }}>
                World
              </div>
            </ColumnFlexible>
            <ColumnFlexible align="CENTER">
              <div style={{ background: "white", border: "1px solid" }}>
                !!!
              </div>
            </ColumnFlexible>
          </Columns>
        </div>
      </ComponentPreview>
    </>
  );
}
