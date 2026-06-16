import { useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  SortingState,
  ColumnDef
} from "@tanstack/react-table";
import { ChevronDown, ArrowUpDown, Plus, Eye, Trash2, Search, SlidersHorizontal } from "lucide-react";
import { dbService, User, Product } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown";
import { cn } from "@/utils/cn";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const Datatable = () => {
  const location = useLocation();
  const type = location.pathname.startsWith("/products") ? "products" : "users";

  const [data, setData] = useState<any[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState({});

  useEffect(() => {
    let unsub = () => { };
    if (type === "users") {
      unsub = dbService.listenUsers((usersList) => {
        setData(usersList);
      });
    } else {
      unsub = dbService.listenProducts((productsList) => {
        setData(productsList);
      });
    }
    return () => unsub();
  }, [type]);

  const handleDelete = async (id: string) => {
    try {
      if (type === "users") {
        await dbService.deleteUser(id);
      } else {
        await dbService.deleteProduct(id);
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // Define Columns
  const columns = useMemo<ColumnDef<any>[]>(() => {
    if (type === "users") {
      return [
        {
          accessorKey: "id",
          header: "ID",
          cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.index + 1}</span>
        },
        {
          accessorKey: "displayName",
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="-ml-3 h-8 text-xs font-semibold"
            >
              User <ArrowUpDown className="ml-2 h-3 w-3" />
            </Button>
          ),
          cell: ({ row }) => (
            <div className="flex items-center gap-3">
              <img
                src={row.original.img || "/assets/no-img.jpg"}
                alt="avatar"
                className="h-8 w-8 rounded-full object-cover border border-border"
              />
              <div className="flex flex-col">
                <span className="font-medium text-foreground">{row.original.displayName}</span>
                <span className="text-xs text-muted-foreground">@{row.original.username}</span>
              </div>
            </div>
          )
        },
        {
          accessorKey: "email",
          header: "Email",
          cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.email}</span>
        },
        {
          accessorKey: "country",
          header: "Country",
          cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.country || "N/A"}</span>
        },
        {
          accessorKey: "status",
          header: "Status",
          cell: ({ row }) => (
            <span className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold select-none",
              {
                "bg-green-500/10 text-green-600": row.original.status === "active",
                "bg-amber-500/10 text-amber-600": row.original.status === "pending",
                "bg-red-500/10 text-red-600": row.original.status === "passive",
              }
            )}>
              {row.original.status}
            </span>
          )
        },
        {
          id: "actions",
          header: "Actions",
          cell: ({ row }) => (
            <div className="flex items-center gap-2">
              <Link to={`/users/${row.original.id}`}>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="View details">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="Delete"><Trash2 className="h-4 w-4" /></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete this record.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(row.original.id)}>Confirm</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              {/* <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(row.original.id)}
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </Button> */}
            </div>
          )
        }
      ];
    } else {
      // Products Columns
      return [
        {
          accessorKey: "id",
          header: "ID",
          cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.id}</span>
        },
        {
          accessorKey: "title",
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="-ml-3 h-8 text-xs font-semibold"
            >
              Product <ArrowUpDown className="ml-2 h-3 w-3" />
            </Button>
          ),
          cell: ({ row }) => (
            <div className="flex items-center gap-3">
              <img
                src={row.original.img || "/assets/no-image.jpg"}
                alt="product"
                className="h-8 w-8 rounded-lg object-cover border border-border bg-muted"
              />
              <span className="font-medium text-foreground">{row.original.title}</span>
            </div>
          )
        },
        {
          accessorKey: "category",
          header: "Category",
          cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.category}</span>
        },
        {
          accessorKey: "price",
          header: "Price",
          cell: ({ row }) => <span className="font-medium">${Number(row.original.price).toLocaleString()}</span>
        },
        {
          accessorKey: "stock",
          header: "Stock",
          cell: ({ row }) => (
            <span className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold",
              row.original.stock <= 5
                ? "bg-red-500/10 text-red-600 font-bold"
                : "bg-green-500/10 text-green-600"
            )}>
              {row.original.stock} in stock
            </span>
          )
        },
        {
          id: "actions",
          header: "Actions",
          cell: ({ row }) => (
            <div className="flex items-center gap-2">
              <Link to={`/products/${row.original.id}`}>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="View details">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(row.original.id)}
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )
        }
      ];
    }
  }, [type]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 7
      }
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-lg border border-border w-80 max-w-full focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary transition-all">
          <Input
            placeholder={`Filter ${type}...`}
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="border-0 p-0 h-auto focus-visible:ring-0 text-sm"
          />
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs font-semibold cursor-pointer">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Columns
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize text-xs cursor-pointer"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to={`/${type}/new`}>
            <Button size="sm" className="h-9 gap-1.5 text-xs font-bold cursor-pointer shadow-sm">
              <Plus className="h-4 w-4" />
              Add New
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/30"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground text-sm">
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold px-2">
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 px-3 cursor-pointer"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 px-3 cursor-pointer"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Datatable;
