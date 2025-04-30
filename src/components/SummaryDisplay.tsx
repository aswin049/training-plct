import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee, TrendingDown, Wallet } from 'lucide-react'; // Changed DollarSign to IndianRupee

interface SummaryDisplayProps {
  totalMoney: number; // Renamed from monthlySalary
  totalExpenses: number;
  remainingBalance: number;
  onMoneyUpdate: (newMoney: number) => void; // Renamed from onSalaryUpdate
}

export function SummaryDisplay({
  totalMoney, // Renamed from monthlySalary
  totalExpenses,
  remainingBalance,
  onMoneyUpdate, // Renamed from onSalaryUpdate
}: SummaryDisplayProps) {
  const [moneyInput, setMoneyInput] = useState<string>(totalMoney.toString()); // Renamed from salaryInput
  const [isEditingMoney, setIsEditingMoney] = useState(false); // Renamed from isEditingSalary
  const [hasMounted, setHasMounted] = useState(false);

   // Track mount status
   useEffect(() => {
    setHasMounted(true);
   }, []);


   // Sync moneyInput with prop after mount and when not editing
   useEffect(() => {
     if (hasMounted && !isEditingMoney) {
        setMoneyInput(totalMoney.toString()); // Use totalMoney
     }
   }, [totalMoney, isEditingMoney, hasMounted]); // Dependency updated


  const handleMoneyInputChange = (event: React.ChangeEvent<HTMLInputElement>) => { // Renamed from handleSalaryChange
    setMoneyInput(event.target.value);
  };

  const handleSaveMoney = () => { // Renamed from handleSaveSalary
    const newMoney = parseFloat(moneyInput);
    if (!isNaN(newMoney) && newMoney >= 0) {
      onMoneyUpdate(newMoney); // Use onMoneyUpdate
      setIsEditingMoney(false);
    } else {
      // Optionally show an error message
       setMoneyInput(totalMoney.toString()); // Revert input if invalid
    }
  };

   const handleCancelEditMoney = () => { // Renamed from handleCancelEditSalary
    setMoneyInput(totalMoney.toString()); // Revert to original value
    setIsEditingMoney(false);
  };

  const formatCurrency = (amount: number) => {
    // Change currency to INR
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

   // Display 0 or default during SSR/hydration phase, actual value after mount
   const displayMoney = hasMounted ? totalMoney : 0; // Renamed from displaySalary
   const displayTotalExpenses = hasMounted ? totalExpenses : 0;
   const displayRemainingBalance = hasMounted ? remainingBalance : 0;


  return (
    <Card className="mb-6 shadow-md">
      <CardHeader>
        <CardTitle>Financial Summary</CardTitle>
        <CardDescription>Overview of your finances.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Total Money */}
        <Card className="bg-secondary/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Money</CardTitle> {/* Updated Label */}
            <IndianRupee className="h-4 w-4 text-muted-foreground" /> {/* Updated Icon */}
          </CardHeader>
          <CardContent>
            {isEditingMoney ? (
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={moneyInput}
                  onChange={handleMoneyInputChange}
                  className="text-xl font-bold"
                  step="100"
                  min="0"
                />
                <Button size="sm" onClick={handleSaveMoney}>Save</Button> {/* Use handleSaveMoney */}
                <Button size="sm" variant="outline" onClick={handleCancelEditMoney}>Cancel</Button> {/* Use handleCancelEditMoney */}
              </div>
            ) : (
              <div className="flex items-center justify-between">
                 <div className="text-2xl font-bold">{formatCurrency(displayMoney)}</div> {/* Use displayMoney */}
                 <Button variant="ghost" size="sm" onClick={() => setIsEditingMoney(true)} disabled={!hasMounted}> {/* Use setIsEditingMoney */}
                    Edit
                 </Button>
              </div>

            )}
          </CardContent>
        </Card>

        {/* Total Expenses */}
         <Card className="bg-destructive/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold text-destructive">{formatCurrency(displayTotalExpenses)}</div>
             <p className="text-xs text-muted-foreground">
                Amount spent this period
             </p>
          </CardContent>
        </Card>

        {/* Remaining Balance */}
        <Card className="bg-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining Balance</CardTitle>
             <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
             <div className={`text-2xl font-bold ${displayRemainingBalance < 0 ? 'text-destructive' : 'text-primary'}`}>
                {formatCurrency(displayRemainingBalance)}
            </div>
             <p className="text-xs text-muted-foreground">
                Money left from total money
             </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
