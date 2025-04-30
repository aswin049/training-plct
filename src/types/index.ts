export interface Expense {
  id: string;
  amount: number;
  category: string;
  description?: string;
  date: string; // Store date as ISO string for consistency
}

export const ExpenseCategories = [
  "Food",
  "Transport",
  "Utilities",
  "Entertainment",
  "Shopping",
  "Health",
  "Housing",
  "Other",
] as const;

export type ExpenseCategory = typeof ExpenseCategories[number];

export interface FilterCriteria {
  category?: ExpenseCategory | '';
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
}
