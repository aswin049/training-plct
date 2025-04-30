import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Expense, ExpenseCategory, FilterCriteria } from '@/types';
import { loadData, saveData } from '@/lib/storage';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';

const TOTAL_MONEY_KEY = 'totalMoney'; // Renamed from SALARY_KEY
const EXPENSES_KEY = 'expenses';

export function useExpenseTracker() {
  // State to track if the component has mounted (client-side)
  const [isClient, setIsClient] = useState(false);

  // Initialize state with server-safe default values
  const [totalMoney, setTotalMoneyState] = useState<number>(0); // Renamed from monthlySalary
  const [expenses, setExpensesState] = useState<Expense[]>([]);
  const [filter, setFilter] = useState<FilterCriteria>({});
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);


  // Load data from localStorage only after component has mounted on the client
  useEffect(() => {
    setIsClient(true); // Mark as client-side mounted
    setTotalMoneyState(loadData(TOTAL_MONEY_KEY, 0)); // Use TOTAL_MONEY_KEY
    const loadedExpenses = loadData(EXPENSES_KEY, []);
    // Ensure expenses are sorted when loaded initially
    setExpensesState(loadedExpenses.sort((a: Expense, b: Expense) => parseISO(b.date).getTime() - parseISO(a.date).getTime()));
  }, []); // Empty dependency array ensures this runs only once on mount

  // Persist total money to localStorage when it changes (only on client)
  useEffect(() => {
    if (isClient) {
      saveData(TOTAL_MONEY_KEY, totalMoney); // Use TOTAL_MONEY_KEY
    }
  }, [totalMoney, isClient]); // Dependency updated

  // Persist expenses to localStorage when they change (only on client)
  useEffect(() => {
    if (isClient) {
      saveData(EXPENSES_KEY, expenses);
    }
  }, [expenses, isClient]);

  const setTotalMoney = useCallback((newMoney: number) => { // Renamed from setMonthlySalary
    setTotalMoneyState(isNaN(newMoney) || newMoney < 0 ? 0 : newMoney);
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
    // Ensure this runs only on client after mount
    if (!isClient) return null;
    return expenses.find(exp => exp.id === editingExpenseId) || null;
  }, [expenses, editingExpenseId, isClient]);


  const filteredExpenses = useMemo(() => {
    // Return empty array on server or before client mount
    if (!isClient) return [];
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
  }, [expenses, filter, isClient]);

    const totalExpenses = useMemo(() => {
    // Return 0 on server or before client mount
    if (!isClient) return 0;
    // Calculate based on the *original* unfiltered expenses array
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses, isClient]); // Depends on the full expenses list

  const remainingBalance = useMemo(() => {
     // Return server-safe value initially
    if (!isClient) return 0;
    return totalMoney - totalExpenses; // Use totalMoney
  }, [totalMoney, totalExpenses, isClient]); // Dependency updated


  const exportExpenses = useCallback(() => {
    if (typeof window === 'undefined' || !isClient) return; // Ensure client-side only

    const headers = ["Date", "Category", "Amount", "Description"];
    // Export based on currently filtered expenses
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
  }, [filteredExpenses, isClient]); // Depends on filtered expenses and isClient


  // Calculate data for the spending chart
  const spendingByCategory = useMemo(() => {
    // Return empty array on server or before client mount
    if (!isClient) return [];
    const categoryMap: { [key in ExpenseCategory]?: number } = {};
    // Calculate based on filtered expenses
    filteredExpenses.forEach(expense => {
      categoryMap[expense.category] = (categoryMap[expense.category] || 0) + expense.amount;
    });
    return Object.entries(categoryMap)
      .map(([category, amount]) => ({ category: category as ExpenseCategory, amount }))
      .sort((a, b) => b.amount - a.amount); // Sort for chart display
  }, [filteredExpenses, isClient]); // Depends on filtered expenses


  // Return values consistent with initial server render until client mounts
  return {
    totalMoney: isClient ? totalMoney : 0, // Renamed from monthlySalary
    setTotalMoney, // Renamed from setMonthlySalary
    expenses: filteredExpenses, // Already handles isClient
    allExpenses: isClient ? expenses : [], // Return full list only on client
    addExpense,
    deleteExpense,
    updateExpense,
    startEditing,
    cancelEditing,
    editingExpense, // Already handles isClient
    editingExpenseId,
    totalExpenses, // Already handles isClient
    remainingBalance, // Already handles isClient
    filter,
    setFilter,
    exportExpenses,
    spendingByCategory, // Already handles isClient
  };
}
