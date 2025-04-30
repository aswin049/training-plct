"use client"; // Required for hooks and client-side interactions

import React from 'react';
import { useExpenseTracker } from '@/hooks/useExpenseTracker';
import { ExpenseForm } from '@/components/ExpenseForm';
import { ExpenseList } from '@/components/ExpenseList';
import { SummaryDisplay } from '@/components/SummaryDisplay';
import { FilterControls } from '@/components/FilterControls';
import { SpendingChart } from '@/components/SpendingChart';
import { ExportButton } from '@/components/ExportButton';
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const {
    monthlySalary,
    setMonthlySalary,
    expenses, // This is now filteredExpenses from the hook
    addExpense,
    deleteExpense,
    updateExpense,
    startEditing,
    cancelEditing,
    editingExpense, // The expense currently being edited
    totalExpenses,
    remainingBalance,
    filter,
    setFilter,
    exportExpenses,
    spendingByCategory,
  } = useExpenseTracker();

   const { toast } = useToast();

   const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
   };

   const handleAddExpense = (data: Omit<import('@/types').Expense, 'id'>) => {
        addExpense(data);
        toast({
            title: "Expense Added",
            description: `Added ${data.category} expense of ${formatCurrency(data.amount)}.`,
        });
   };

   const handleUpdateExpense = (data: import('@/types').Expense) => {
       updateExpense(data);
        toast({
            title: "Expense Updated",
            description: `Updated expense details.`,
        });
   }

   const handleDeleteExpense = (id: string) => {
        deleteExpense(id);
        toast({
            title: "Expense Deleted",
            variant: "destructive",
            description: `Expense removed successfully.`,
        });
    };

   const handleExport = () => {
        try {
            exportExpenses();
            toast({
                title: "Export Successful",
                description: "Your expense data has been exported.",
            });
        } catch (error) {
            toast({
                title: "Export Failed",
                variant: "destructive",
                description: "Could not export expense data.",
            });
            console.error("Export failed:", error);
        }
   }


  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Expense Tracker Lite</h1>
        <p className="text-muted-foreground">Simple and effective expense tracking.</p>
      </header>

      {/* Summary Section */}
      <SummaryDisplay
        monthlySalary={monthlySalary}
        totalExpenses={totalExpenses}
        remainingBalance={remainingBalance}
        onSalaryUpdate={setMonthlySalary}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form and Chart */}
        <div className="lg:col-span-1 space-y-6">
          <ExpenseForm
            onSubmit={handleAddExpense}
            onUpdate={handleUpdateExpense}
            onCancelEdit={cancelEditing}
            initialData={editingExpense} // Pass editing expense data
          />
           <SpendingChart data={spendingByCategory} />
        </div>

        {/* Right Column: List, Export, and Filter */}
        <div className="lg:col-span-2 space-y-6">
            {/* Expense History */}
            <ExpenseList
                expenses={expenses}
                onDelete={handleDeleteExpense}
                onEdit={startEditing} // Pass startEditing function
            />
            {/* Export Button */}
            <div className="flex justify-end">
                <ExportButton onExport={handleExport} disabled={expenses.length === 0} />
            </div>
        </div>
      </div>
       {/* Filter Controls below the main grid */}
      <FilterControls filter={filter} onFilterChange={setFilter} />


      {/* <footer className="mt-12 text-center text-sm text-muted-foreground">
        Built with Next.js and shadcn/ui.
      </footer> */}
    </div>
  );
}
