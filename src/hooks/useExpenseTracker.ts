import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Expense, ExpenseCategory, FilterCriteria } from '@/types';
import { loadData, saveData } from '@/lib/storage';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';

const SALARY_KEY = 'monthlySalary';
const EXPENSES_KEY = 'expenses';

export function useExpenseTracker() {
  const [monthlySalary, setMonthlySalaryState] = useState<number>(() => loadData(SALARY_KEY, 0));
  const [expenses, setExpensesState] = useState<Expense[]>(() => loadData(EXPENSES_KEY, []));
  const [filter, setFilter] = useState<FilterCriteria>({});
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  // Persist salary to localStorage
  useEffect(() => {
    saveData(SALARY_KEY, monthlySalary);
  }, [monthlySalary]);

  // Persist expenses to localStorage
  useEffect(() => {
    saveData(EXPENSES_KEY, expenses);
  }, [expenses]);

  const setMonthlySalary = useCallback((newSalary: number) => {
    setMonthlySalaryState(isNaN(newSalary) || newSalary < 0 ? 0 : newSalary);
  }, []);

  const addExpense = useCallback((expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(), // Generate unique ID
      date: expense.date || format(new Date(), 'yyyy-MM-dd'), // Default to today if no date provided
    };
    setExpensesState((prevExpenses) => [...prevExpenses, newExpense].sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()));
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpensesState((prevExpenses) => prevExpenses.filter((exp) => exp.id !== id));
    if (editingExpenseId === id) {
        setEditingExpenseId(null); // Clear editing state if deleted expense was being edited
    }
  }, [editingExpenseId]);

  const updateExpense = useCallback((updatedExpense: Expense) => {
    setExpensesState((prevExpenses) =>
      prevExpenses.map((exp) => (exp.id === updatedExpense.id ? updatedExpense : exp)).sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())
    );
     setEditingExpenseId(null); // Exit editing mode after update
  }, []);

   const startEditing = useCallback((id: string) => {
    setEditingExpenseId(id);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingExpenseId(null);
  }, []);

  const editingExpense = useMemo(() => {
    return expenses.find(exp => exp.id === editingExpenseId) || null;
  }, [expenses, editingExpenseId]);


  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const remainingBalance = useMemo(() => {
    return monthlySalary - totalExpenses;
  }, [monthlySalary, totalExpenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const expenseDate = parseISO(expense.date);
      const matchCategory = !filter.category || expense.category === filter.category;
      const matchStartDate = !filter.startDate || expenseDate >= parseISO(filter.startDate);
      const matchEndDate = !filter.endDate || expenseDate <= parseISO(filter.endDate);
       const matchSearchTerm =
        !filter.searchTerm ||
        expense.description?.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
        expense.amount.toString().includes(filter.searchTerm);

      return matchCategory && matchStartDate && matchEndDate && matchSearchTerm;
    });
  }, [expenses, filter]);

  const exportExpenses = useCallback(() => {
    if (typeof window === 'undefined') return;

    const headers = ["Date", "Category", "Amount", "Description"];
    const csvContent = [
      headers.join(","),
      ...filteredExpenses.map(e =>
        [
          e.date,
          e.category,
          e.amount,
          `"${e.description?.replace(/"/g, '""') || ''}"` // Handle quotes in description
        ].join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `expenses_${format(new Date(), 'yyyyMMdd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, [filteredExpenses]);


  // Calculate data for the spending chart
  const spendingByCategory = useMemo(() => {
    const categoryMap: { [key in ExpenseCategory]?: number } = {};
    filteredExpenses.forEach(expense => {
      categoryMap[expense.category] = (categoryMap[expense.category] || 0) + expense.amount;
    });
    return Object.entries(categoryMap)
      .map(([category, amount]) => ({ category: category as ExpenseCategory, amount }))
      .sort((a, b) => b.amount - a.amount); // Sort for chart display
  }, [filteredExpenses]);


  return {
    monthlySalary,
    setMonthlySalary,
    expenses: filteredExpenses, // Return filtered expenses for display
    allExpenses: expenses, // Provide access to all expenses if needed elsewhere
    addExpense,
    deleteExpense,
    updateExpense,
    startEditing,
    cancelEditing,
    editingExpense,
    editingExpenseId,
    totalExpenses,
    remainingBalance,
    filter,
    setFilter,
    exportExpenses,
    spendingByCategory,
  };
}
