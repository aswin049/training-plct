import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingDown, Wallet } from 'lucide-react';

interface SummaryDisplayProps {
  monthlySalary: number;
  totalExpenses: number;
  remainingBalance: number;
  onSalaryUpdate: (newSalary: number) => void;
}

export function SummaryDisplay({
  monthlySalary,
  totalExpenses,
  remainingBalance,
  onSalaryUpdate,
}: SummaryDisplayProps) {
  const [salaryInput, setSalaryInput] = React.useState<string>(monthlySalary.toString());
  const [isEditingSalary, setIsEditingSalary] = React.useState(false);

   React.useEffect(() => {
    // Update local input state if the prop changes (e.g., initial load)
    if (!isEditingSalary) {
      setSalaryInput(monthlySalary.toString());
    }
  }, [monthlySalary, isEditingSalary]);


  const handleSalaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSalaryInput(event.target.value);
  };

  const handleSaveSalary = () => {
    const newSalary = parseFloat(salaryInput);
    if (!isNaN(newSalary) && newSalary >= 0) {
      onSalaryUpdate(newSalary);
      setIsEditingSalary(false);
    } else {
      // Optionally show an error message
       setSalaryInput(monthlySalary.toString()); // Revert input if invalid
    }
  };

   const handleCancelEditSalary = () => {
    setSalaryInput(monthlySalary.toString()); // Revert to original value
    setIsEditingSalary(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <Card className="mb-6 shadow-md">
      <CardHeader>
        <CardTitle>Financial Summary</CardTitle>
        <CardDescription>Overview of your monthly finances.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Monthly Salary */}
        <Card className="bg-secondary/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Salary</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isEditingSalary ? (
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={salaryInput}
                  onChange={handleSalaryChange}
                  className="text-xl font-bold"
                  step="100"
                  min="0"
                />
                <Button size="sm" onClick={handleSaveSalary}>Save</Button>
                <Button size="sm" variant="outline" onClick={handleCancelEditSalary}>Cancel</Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                 <div className="text-2xl font-bold">{formatCurrency(monthlySalary)}</div>
                 <Button variant="ghost" size="sm" onClick={() => setIsEditingSalary(true)}>
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
             <div className="text-2xl font-bold text-destructive">{formatCurrency(totalExpenses)}</div>
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
             <div className={`text-2xl font-bold ${remainingBalance < 0 ? 'text-destructive' : 'text-primary'}`}>
                {formatCurrency(remainingBalance)}
            </div>
             <p className="text-xs text-muted-foreground">
                Money left from salary
             </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
