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
    totalMoney, // Renamed from monthlySalary
    setTotalMoney, // Renamed from setMonthlySalary
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
    <div className="container mx-auto p-4 md:p-8 space-y-6 flex flex-col min-h-screen"> {/* Added flex flex-col min-h-screen */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary">DEV Financial Tracker</h1>
        <p className="text-muted-foreground">Simple and effective expense tracking.</p>
      </header>

      {/* Summary Section */}
      <SummaryDisplay
        totalMoney={totalMoney} // Renamed from monthlySalary
        totalExpenses={totalExpenses}
        remainingBalance={remainingBalance}
        onMoneyUpdate={setTotalMoney} // Renamed from onSalaryUpdate
      />

      {/* Main Content Grid - Added flex-grow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
        {/* Left Column: Form and Chart */}
        <div className="lg:col-span-1 space-y-6 flex flex-col"> {/* Added flex flex-col */}
          <ExpenseForm
            onSubmit={handleAddExpense}
            onUpdate={handleUpdateExpense}
            onCancelEdit={cancelEditing}
            initialData={editingExpense} // Pass editing expense data
          />
           <SpendingChart data={spendingByCategory} />
        </div>

        {/* Right Column: List and Export */}
        <div className="lg:col-span-2 space-y-6 flex flex-col"> {/* Added flex flex-col */}
            {/* Expense History */}
            <div className="flex-grow"> {/* Added flex-grow wrapper */}
                <ExpenseList
                    expenses={expenses}
                    onDelete={handleDeleteExpense}
                    onEdit={startEditing} // Pass startEditing function
                />
            </div>
             {/* Export Button */}
            <div className="flex justify-end mt-4"> {/* Added margin top */}
                <ExportButton onExport={handleExport} disabled={expenses.length === 0} />
            </div>
        </div>
      </div>

       {/* Filter Controls at the bottom */}
      <div className="mt-6"> {/* Added margin top */}
         <FilterControls filter={filter} onFilterChange={setFilter} />
      </div>


      <footer className="mt-auto pt-8 text-center text-sm text-muted-foreground"> {/* Used mt-auto and pt-8 */}
        Built by Aswindev S B with help of AI
      </footer>
    </div>
  );
}
