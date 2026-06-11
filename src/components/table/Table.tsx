import { useEffect, useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { dbService, Transaction } from "@/lib/db";
import { cn } from "@/utils/cn";

const TransactionTable = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const unsub = dbService.listenTransactions((data) => {
      setTransactions(data);
    });
    return () => unsub();
  }, []);

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Tracking ID</TableHead>
            <TableHead className="font-semibold">Product</TableHead>
            <TableHead className="font-semibold">Customer</TableHead>
            <TableHead className="font-semibold">Date</TableHead>
            <TableHead className="font-semibold">Amount</TableHead>
            <TableHead className="font-semibold">Payment Method</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((row) => (
            <TableRow key={row.id} className="hover:bg-muted/30">
              <TableCell className="font-mono text-xs text-muted-foreground">#{row.id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  {row.img && (
                    <img 
                      src={row.img} 
                      alt={row.product} 
                      className="h-8 w-8 rounded-lg object-cover border border-border bg-muted shrink-0" 
                    />
                  )}
                  <span className="font-medium text-foreground">{row.product}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{row.customer}</TableCell>
              <TableCell className="text-muted-foreground text-xs">{row.date}</TableCell>
              <TableCell className="font-medium text-foreground">${row.amount}</TableCell>
              <TableCell className="text-muted-foreground text-xs">{row.method}</TableCell>
              <TableCell>
                <span className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold select-none",
                  {
                    "bg-green-500/10 text-green-600": row.status === "Approved",
                    "bg-amber-500/10 text-amber-600": row.status === "Pending",
                    "bg-red-500/10 text-red-600": row.status === "Rejected",
                  }
                )}>
                  {row.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;
