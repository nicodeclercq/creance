import { PieChart as Chart, pieArcLabelClasses } from "@mui/x-charts";

import { Price } from "../Price/Price";

type Data = {
  id: string;
  label: string;
  value: string;
  color: string;
};

type PieProps = {
  label?: string;
  data: Data[];
};

export function PieChart({ data, label }: PieProps) {
  return (
    <Chart
      data-component="PieChart"
      aria-label={label}
      aria-hidden={label ? undefined : true}
      series={[
        {
          data: data.map((item) => ({
            id: item.id,
            label: (
              <>
                {item.label}:{" "}
                <Price as="span" styles={{ fontSize: "smaller" }}>
                  {item.value}
                </Price>
              </>
            ) as unknown as string,
            value: parseFloat(item.value),
            color: item.color,
          })),
          highlightScope: { fade: "global", highlight: "item" },
          innerRadius: 40,
          outerRadius: 64,
          cornerRadius: 8,
          paddingAngle: 4,
          valueFormatter: () => "",
        },
      ]}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          font: "var(--ui-semantic-font-body-smaller)",
          fill: "var(--ui-semantic-color-neutral-default)",
        },
        "& .MuiPieArc-root": {
          strokeWidth: 0,
        },
      }}
      slotProps={{
        legend: {
          sx: {
            font: "var(--ui-semantic-font-body-smaller)",
            color: "var(--ui-semantic-color-neutral-default)",
          },
        },
      }}
      width={170}
      height={170}
    />
  );
}
