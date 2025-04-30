import React from 'react';
import { format, parseISO } from 'date-fns';
import { Edit, Trash2, XCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Expense } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export function ExpenseList({ expenses, onDelete, onEdit }: ExpenseListProps) {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <Card className="shadow-md">
         <CardHeader>
            <CardTitle>Expense History</CardTitle>
        </CardHeader>
        <CardContent>
            <ScrollArea className="h-[400px] w-full rounded-md border">
            <Table>
                <TableHeader className="sticky top-0 bg-secondary">
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {expenses.length === 0 ? (
                    <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No expenses recorded yet.
                    </TableCell>
                    </TableRow>
                ) : (
                    expenses.map((expense) => (
                    <TableRow key={expense.id}>
                        <TableCell className="font-medium">
                         {format(parseISO(expense.date), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                        <Badge variant="secondary">{expense.category}</Badge>
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
                        <TableCell className="max-w-[200px] truncate text-muted-foreground">
                        {expense.description || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(expense.id)}
                            aria-label="Edit expense"
                            className="mr-1 text-primary hover:text-primary/80"
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(expense.id)}
                            aria-label="Delete expense"
                            className="text-destructive hover:text-destructive/80"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        </TableCell>
                    </TableRow>
                    ))
                )}
                </TableBody>
            </Table>
            </ScrollArea>
        </CardContent>
    </Card>
  );
}
