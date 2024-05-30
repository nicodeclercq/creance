import { Category } from "./../models/Category";
import { User } from "./../models/User";
import {
  CreditDistribution,
  getExpenseDistributionByAmount,
  getTotalAmount,
  expensesDistribution,
} from "./CalculationService";
import { Expense } from "./../models/Expense";
import { Registered } from "./../models/Registerable";

const LINE_JUMP = `
`;
const SEPARATOR = ";";

export type CSVData = {
  expenses: Registered<Expense>[];
  distribution: Pick<CreditDistribution, "user" | "distribution">[];
  users: Registered<User>[];
  categories: Registered<Category>[];
  currency: string;
};

const fillLine = (totalLength: number) => (data: Array<string | number>) => {
  const length = totalLength - data.length;
  if (length < 0 || isNaN(length)) {
    console.error(length, totalLength, data);
  }
  return (
    data.join(SEPARATOR) +
    new Array(totalLength - data.length).fill(SEPARATOR).join("")
  );
};

function formatDate(date: string | Date) {
  const d = date instanceof Date ? date : new Date(date);
  return `${(d.getDate() + "").padStart(2, "0")}/${(
    d.getMonth() +
    1 +
    ""
  ).padStart(2, "0")}/${d.getFullYear()} à ${d.getHours()}h${d.getMinutes()}`;
}

export function toCSV({
  expenses,
  distribution,
  users,
  categories,
  currency,
}: CSVData): string {
  const LENGTH = 5 + users.length;

  const expenseToCSV = (expense: Registered<Expense>) => {
    const distribution = getExpenseDistributionByAmount(expense);

    return [
      users.find((user) => expense.from === user.id)?.name ||
        `Participant supprimé ${expense.from}`,
      categories.find((category) => expense.category === category.id)?.name ||
        `Catégorie supprimée ${expense.category}`,
      `${expense.amount} ${currency}`,
      formatDate(expense.date),
      expense.description,
      ...users.map((user) => `${distribution[user.id] || "0"} ${currency}`),
    ];
  };

  const expensesAmountByUser = expensesDistribution(expenses);

  const getUserDistributionCSV = ({
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
        ? `donne ${Math.abs(amount)} ${currency} à ${user.name}`
        : amount > 0
        ? `reçoit ${Math.abs(amount)} ${currency} de ${user.name}`
        : "-";
    });

    return [name, "", "", "", "", ...dist];
  };
  return [
    ["\ufeffCréditeur", "Categorie", "Montant", "Date", "Note"].concat(
      users.map((user) => user.name)
    ),
    ...expenses.map(expenseToCSV),
    [
      "TOTAL",
      "",
      `${getTotalAmount(expenses)} ${currency}`,
      "",
      "",
      ...users.map(
        (user) => `${expensesAmountByUser[user.id] || 0} ${currency}`
      ),
    ],
    [],
    ["Distribution"],
    ...users.map(getUserDistributionCSV),
  ]
    .map(fillLine(LENGTH))
    .join(LINE_JUMP);
}
