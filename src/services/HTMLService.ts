import { to2Decimals } from "./../utils/number";
import { THEME_COLOR } from "./../entities/color";
import { Category } from "../models/Category";
import { User } from "../models/User";
import {
  CreditDistribution,
  getExpenseDistributionByAmount,
  getTotalAmount,
  expensesDistribution,
} from "./CalculationService";
import { Expense } from "../models/Expense";
import { Registered } from "../models/Registerable";

const camelToKebabCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

const html = {
  element: ({
    content = "",
    style = {},
    tag = "div",
    attributes,
  }: {
    tag?: string;
    content?: string | string[];
    attributes?: Record<string, string>;
    style?: Record<string, string>;
  }) =>
    `<${tag} ${
      attributes
        ? Object.entries(attributes)
            .map(([name, value]) => `${name}="${value}"`)
            .join("")
        : ""
    } style="${Object.entries(style)
      .map(([name, value]) => `${camelToKebabCase(name)}:${value};`)
      .join("")}">${
      content != null
        ? `${
            content instanceof Array
              ? content.filter((a) => !!a).join("")
              : content
          }</${tag}>`
        : "/>"
    }`,
  title: (content: string, level: number = 2) =>
    html.element({ tag: `h${level}`, content }),
  table: ({
    header,
    data,
    footer,
  }: {
    header: string[];
    data: string[][];
    footer?: string[];
  }) =>
    html.element({
      tag: "table",
      style: {
        borderCollapse: "collapse",
      },
      content: [
        html.element({
          tag: "thead",
          content: html.element({
            tag: "tr",
            content: header.map((content) =>
              html.element({
                tag: "th",
                style: {
                  padding: "0.25rem",
                  textAlign: "left",
                  color: THEME_COLOR.PRIMARY_DARK,
                  borderBottom: "1px solid #555",
                },
                content,
              })
            ),
          }),
        }),
        html.element({
          tag: "tbody",
          content: data.map((row, index) =>
            html.element({
              tag: "tr",
              content: row.map((content) =>
                html.element({
                  tag: "td",
                  style: {
                    padding: "0.25rem",
                    borderBottom:
                      index < data.length - 1 ? "1px solid #AAA" : "none",
                  },
                  content,
                })
              ),
            })
          ),
        }),
        footer
          ? html.element({
              tag: "tfoot",
              content: html.element({
                tag: "tr",
                content: footer.map((content) =>
                  html.element({
                    tag: "td",
                    style: {
                      borderTop: "1px solid #555",
                      paddingTop: "0.25rem",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    },
                    content,
                  })
                ),
              }),
            })
          : "",
      ],
    }),
  card: ({ title, content }: { title?: string; content: string }) =>
    html.element({
      style: {
        borderRadius: "0.5rem",
        boxShadow: "0.5rem 0.5rem 0.25rem rgba(0,0,0,0.2)",
        overflow: "hidden",
      },
      content: [
        title
          ? html.element({
              style: {
                background: THEME_COLOR.PRIMARY,
                color: THEME_COLOR.WHITE,
                padding: "0.5rem 1rem",
              },
              content: html.title(title),
            })
          : "",
        html.element({
          style: { overflow: "auto", padding: "0.5rem 1rem" },
          content,
        }),
      ],
    }),
  avatar: (img: string) =>
    html.element({
      style: {
        borderRadius: "1000px",
        width: "2rem",
        height: "2rem",
        border: "1px solid",
        backgroundImage: `url(${img})`,
        backgroundSize: "cover",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      content: img ? "" : "💵",
    }),
};

export type HTMLData = {
  name: string;
  expenses: Registered<Expense>[];
  distribution: Pick<CreditDistribution, "user" | "distribution">[];
  users: Registered<User>[];
  categories: Registered<Category>[];
  currency: string;
};

function formatDate(date: string | Date) {
  const d = date instanceof Date ? date : new Date(date);
  return `${(d.getDate() + "").padStart(2, "0")}/${(
    d.getMonth() +
    1 +
    ""
  ).padStart(2, "0")}/${d.getFullYear()} à ${(d.getHours() + "").padStart(
    2,
    "0"
  )}h${(d.getMinutes() + "").padStart(2, "0")}`;
}

export function toHTML({
  name,
  expenses,
  distribution,
  users,
  categories,
  currency,
}: HTMLData): string {
  const expenseToHTML = (expense: Registered<Expense>) => {
    const distribution = getExpenseDistributionByAmount(expense);

    return [
      categories.find((category) => expense.category === category.id)?.name ||
        `Catégorie supprimée ${expense.category}`,
      html.element({
        style: { color: THEME_COLOR.PRIMARY_DARK, fontWeight: "bold" },
        content: `${expense.amount}&nbsp;${currency}`,
      }),
      users.find((user) => expense.from === user.id)?.name ||
        `Participant supprimé ${expense.from}`,
      formatDate(expense.date),
      html.element({
        style: {
          maxWidth: "200ch",
          minWidth: "30ch",
        },
        content: expense.description,
      }),
    ].concat(
      users.map(
        (user) => `${to2Decimals(distribution[user.id] || 0)}&nbsp;${currency}`
      )
    );
  };

  const expensesAmountByUser = expensesDistribution(expenses);

  const getUserDistributionHTML = ({
    id,
    name,
  }: {
    id: string;
    name: string;
  }) => {
    const dist = users.map((user) => {
      const d = distribution.find((d) => d.user === id);
      const amount =
        d?.distribution.find((dd) => dd.user === user.id)?.amount ?? 0;
      return amount < 0
        ? `donne ${html.element({
            style: { color: THEME_COLOR.PRIMARY_DARK, fontWeight: "bold" },
            content: `${Math.abs(amount)}&nbsp;${currency}`,
          })} à ${user.name}`
        : amount > 0
        ? `reçoit ${html.element({
            style: { color: THEME_COLOR.PRIMARY_DARK, fontWeight: "bold" },
            content: `${Math.abs(amount)}&nbsp;${currency}`,
          })} de ${user.name}`
        : "-";
    });

    return [name].concat(dist);
  };

  const expensesSection = html.card({
    title: "🛒 Dépenses + ⚖️ Répartition par participant",
    content: html.table({
      header: ["Categorie", "Montant", "Créditeur", "Date", "Note"].concat(
        users.map((user) => `${html.avatar(user.avatar)} ${user.name}`)
      ),
      data: expenses.map(expenseToHTML),
      footer: [
        "TOTAL",
        `${to2Decimals(getTotalAmount(expenses))}&nbsp;${currency}`,
        "",
        "",
        "",
      ].concat(
        users.map(
          (user) =>
            `${to2Decimals(
              expensesAmountByUser[user.id] || 0
            )}&nbsp;${currency}`
        )
      ),
    }),
  });

  const distributionSection = html.card({
    title: "💸 Distribution",
    content: html.table({
      header: [""].concat(
        users.map((user) => `${html.avatar(user.avatar)} ${user.name}`)
      ),
      data: users.map((user) => getUserDistributionHTML(user)),
    }),
  });

  return html.element({
    tag: "html",
    content: [
      html.element({
        tag: "head",
        content: html.element({
          tag: "meta",
          attributes: { charset: "UTF-8" },
        }),
      }),
      html.element({
        tag: "body",
        content: html.element({
          style: {
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            maxWidth: "100%",
            width: "1000px",
            padding: "2rem 1rem",
          },
          content: [
            html.element({
              tag: "h1",
              style: {
                color: THEME_COLOR.PRIMARY_DARK,
                marginBottom: "2rem",
              },
              content: name,
            }),
            expensesSection,
            distributionSection,
            html.element({
              tag: "p",
              style: {
                fontSize: "0.75rem",
                color: "#777",
              },
              content: `généré le ${formatDate(new Date())}`,
            }),
          ],
        }),
      }),
    ],
  });
}
