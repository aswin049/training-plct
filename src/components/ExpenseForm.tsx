import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Save, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Expense, ExpenseCategory } from '@/types';
import { ExpenseCategories } from '@/types';
import { cn } from '@/lib/utils';

const expenseFormSchema = z.object({
  amount: z.coerce.number().positive({ message: 'Amount must be positive.' }),
  category: z.enum(ExpenseCategories, { required_error: 'Category is required.' }),
  description: z.string().optional(),
  date: z.date({ required_error: 'Date is required.' }),
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

interface ExpenseFormProps {
  onSubmit: (data: Omit<Expense, 'id'>) => void;
  onUpdate?: (data: Expense) => void;
  onCancelEdit?: () => void;
  initialData?: Expense | null; // For editing
}

export function ExpenseForm({ onSubmit, onUpdate, onCancelEdit, initialData }: ExpenseFormProps) {
  const isEditing = !!initialData;

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      amount: undefined,
      category: undefined,
      description: '',
      date: new Date(),
    },
  });

   useEffect(() => {
    if (initialData) {
      form.reset({
        amount: initialData.amount,
        category: initialData.category as ExpenseCategory, // Ensure type safety
        description: initialData.description || '',
        date: initialData.date ? new Date(initialData.date) : new Date(), // Parse string date
      });
    } else {
       form.reset({ // Reset to default when not editing
        amount: undefined,
        category: undefined,
        description: '',
        date: new Date(),
      });
    }
  }, [initialData, form]);

  const handleFormSubmit = (data: ExpenseFormValues) => {
    const expenseData = {
      amount: data.amount,
      category: data.category,
      description: data.description,
      date: format(data.date, 'yyyy-MM-dd'), // Format date to string
    };

    if (isEditing && initialData && onUpdate) {
        onUpdate({ ...expenseData, id: initialData.id });
    } else if (!isEditing) {
        onSubmit(expenseData);
        form.reset(); // Reset form after adding
         form.setValue('date', new Date()); // Keep date as today after reset
    }
  };


  return (
    <Card className="w-full shadow-md">
        <CardHeader>
            <CardTitle>{isEditing ? 'Edit Expense' : 'Add New Expense'}</CardTitle>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Amount (₹)</FormLabel>
                    <FormControl>
                        <Input type="number" step="0.01" placeholder="₹0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {ExpenseCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                            {category}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                        <Textarea placeholder="e.g., Lunch with colleagues" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                 <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Expense</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          {/* Removed FormControl wrapper here */}
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] justify-start text-left font-normal", // Use justify-start
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 opacity-50" /> {/* Icon first */}
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2 pt-2">
                    {isEditing && (
                        <Button type="button" variant="outline" onClick={onCancelEdit}>
                            <XCircle className="mr-2 h-4 w-4" /> Cancel
                        </Button>
                    )}
                    <Button type="submit" className="bg-primary hover:bg-primary/90">
                        <Save className="mr-2 h-4 w-4" /> {isEditing ? 'Update Expense' : 'Add Expense'}
                    </Button>
                </div>
            </form>
            </Form>
         </CardContent>
    </Card>
  );
}
