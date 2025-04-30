import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import type { FilterCriteria, ExpenseCategory } from '@/types';
import { ExpenseCategories } from '@/types';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FilterControlsProps {
  filter: FilterCriteria;
  onFilterChange: (filter: FilterCriteria) => void;
}

const ALL_CATEGORIES_VALUE = "__ALL__"; // Use a non-empty value

export function FilterControls({ filter, onFilterChange }: FilterControlsProps) {
  // Internal state uses '' for all, matching FilterCriteria type
  const [category, setCategory] = useState(filter.category || '');
  const [startDate, setStartDate] = useState<Date | undefined>(filter.startDate ? new Date(filter.startDate) : undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(filter.endDate ? new Date(filter.endDate) : undefined);
  const [searchTerm, setSearchTerm] = useState(filter.searchTerm || '');

  // Update internal state if external filter prop changes
  useEffect(() => {
    setCategory(filter.category || '');
    setStartDate(filter.startDate ? new Date(filter.startDate) : undefined);
    setEndDate(filter.endDate ? new Date(filter.endDate) : undefined);
    setSearchTerm(filter.searchTerm || '');
  }, [filter]);


  const handleCategoryChange = (value: string) => {
    // Convert __ALL__ back to '' for internal state and filter criteria
    setCategory(value === ALL_CATEGORIES_VALUE ? '' : value as ExpenseCategory);
  };

  const handleApplyFilters = () => {
    onFilterChange({
      category: category as ExpenseCategory | '', // Already '' for all
      startDate: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
      endDate: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
      searchTerm: searchTerm || undefined,
    });
  };

  const handleClearFilters = () => {
    setCategory('');
    setStartDate(undefined);
    setEndDate(undefined);
    setSearchTerm('');
    onFilterChange({}); // Clear filters in parent
  };

  // Select component value needs to handle mapping '' to __ALL__
  const selectValue = category === '' ? ALL_CATEGORIES_VALUE : category;

  return (
    <Card className="mb-6 shadow-md">
       <CardHeader>
            <CardTitle>Filter Expenses</CardTitle>
        </CardHeader>
         <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
                {/* Category Filter */}
                <div className="space-y-2">
                    <label htmlFor="category-filter" className="text-sm font-medium">Category</label>
                    <Select value={selectValue} onValueChange={handleCategoryChange}>
                        <SelectTrigger id="category-filter">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            {/* Use the non-empty value for the "All" option */}
                            <SelectItem value={ALL_CATEGORIES_VALUE}>All Categories</SelectItem>
                            {ExpenseCategories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                                {cat}
                            </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Start Date Filter */}
                <div className="space-y-2">
                    <label htmlFor="start-date-filter" className="text-sm font-medium">Start Date</label>
                     <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="start-date-filter"
                                variant={"outline"}
                                className={cn(
                                "w-full justify-start text-left font-normal",
                                !startDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {startDate ? format(startDate, "PPP") : "Pick a start date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                             disabled={(date) =>
                                (endDate && date > endDate) || date > new Date()
                            }
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* End Date Filter */}
                <div className="space-y-2">
                     <label htmlFor="end-date-filter" className="text-sm font-medium">End Date</label>
                     <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="end-date-filter"
                                variant={"outline"}
                                className={cn(
                                "w-full justify-start text-left font-normal",
                                !endDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {endDate ? format(endDate, "PPP") : "Pick an end date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            disabled={(date) =>
                                (startDate && date < startDate) || date > new Date()
                            }
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Search Term Filter */}
                <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                    <label htmlFor="search-filter" className="text-sm font-medium">Search</label>
                    <div className="relative">
                         <Input
                            id="search-filter"
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pr-8" // Add padding for the icon
                        />
                         <Search className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </div>

                </div>

                 {/* Action Buttons */}
                <div className="flex items-end space-x-2 sm:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Button onClick={handleApplyFilters} className="w-full sm:w-auto">Apply Filters</Button>
                    <Button variant="outline" onClick={handleClearFilters} className="w-full sm:w-auto">
                        <X className="mr-1 h-4 w-4" /> Clear
                    </Button>
                </div>
            </div>
         </CardContent>
    </Card>
  );
}
