import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExportButtonProps {
  onExport: () => void;
  disabled?: boolean;
}

export function ExportButton({ onExport, disabled = false }: ExportButtonProps) {
  return (
    <Button onClick={onExport} disabled={disabled} variant="outline">
      <Download className="mr-2 h-4 w-4" />
      Export Expenses (CSV)
    </Button>
  );
}
