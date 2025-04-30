import React from 'react';
import { TrendingUp } from "lucide-react"
import { Pie, PieChart, Sector } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { ExpenseCategory } from '@/types';

interface SpendingChartProps {
  data: { category: ExpenseCategory; amount: number }[];
}

const chartConfig = {
  amount: {
    label: "Amount",
  },
  Food: { label: "Food", color: "hsl(var(--chart-1))" },
  Transport: { label: "Transport", color: "hsl(var(--chart-2))" },
  Utilities: { label: "Utilities", color: "hsl(var(--chart-3))" },
  Entertainment: { label: "Entertainment", color: "hsl(var(--chart-4))" },
  Shopping: { label: "Shopping", color: "hsl(var(--chart-5))" },
  Health: { label: "Health", color: "hsl(var(--chart-1))" }, // Re-using colors for simplicity
  Housing: { label: "Housing", color: "hsl(var(--chart-2))" },
  Other: { label: "Other", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig

export function SpendingChart({ data }: SpendingChartProps) {
   const totalAmount = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.amount, 0)
  }, [data])

  if (data.length === 0) {
    return (
       <Card className="flex flex-col shadow-md">
            <CardHeader className="items-center pb-0">
                <CardTitle>Spending Breakdown</CardTitle>
                <CardDescription>Distribution of expenses by category</CardDescription>
            </CardHeader>
             <CardContent className="flex-1 flex items-center justify-center pb-0">
                 <p className="text-muted-foreground">No spending data available for the selected period.</p>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                 <div className="flex items-center gap-2 font-medium leading-none">
                    Total Spending: $0.00
                </div>
            </CardFooter>
        </Card>
    );
  }

  return (
    <Card className="flex flex-col shadow-md">
      <CardHeader className="items-center pb-0">
        <CardTitle>Spending Breakdown</CardTitle>
        <CardDescription>Distribution of expenses by category</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]" // Adjusted max height
        >
          <PieChart>
             <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="category" />} // Ensure nameKey matches data key
            />
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category" // Key for category name in data
              innerRadius={60}
              strokeWidth={5}
            >
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Total Spending: ${totalAmount.toFixed(2)}
           <TrendingUp className="h-4 w-4" />
        </div>
         <div className="leading-none text-muted-foreground">
          Showing spending distribution for the filtered period
        </div>
      </CardFooter>
    </Card>
  )
}
