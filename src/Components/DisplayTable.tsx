import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    SortingState,
  } from "@tanstack/react-table";
  import { useState } from "react";
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
  import { Button } from "@/Components/ui/button";
  import { ArrowUpDown } from "lucide-react";
  
  // Define the data type for products
  type Product = {
    name: string;
    price: number;
    quantity: number;
    totalPrice: number;
  };
  
  type DisplayTableProps = {
    dat: Product[]; // Accept product data from parent
  };
  
  export default function DisplayTable({ dat }: DisplayTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
  
    // Calculate subtotal and total with tax
    const subTotal = dat.reduce((acc, item) => acc + item.totalPrice, 0);
    const totalWithTax = subTotal * 1.18;
  
    // Define columns
    const columns: ColumnDef<Product>[] = [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("name")}</div>,
      },
      {
        accessorKey: "price",
        header: "Price", // No sorting here
        cell: ({ row }) => <div>INR {row.getValue("price")}</div>,
      },
      {
        accessorKey: "quantity",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Quantity <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("quantity")}</div>,
      },
      {
        accessorKey: "totalPrice",
        header: "Total Price",
        cell: ({ row }) => <div>INR {row.getValue("totalPrice")}</div>,
      },
    ];
    
  
    const table = useReactTable({
      data: dat, 
      columns,
      state: {
        sorting,
      },
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
    });
  
    return (
      <div className="w-full rounded-md border bg-black text-white my-5">
        <Table>
          <TableHeader className="bg-white text-black">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
  
          {/* Table Body */}
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No products available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableRow></TableRow>
          <TableRow>
            <TableCell colSpan={3} className="text-right font-bold">Sub-Total</TableCell>
            <TableCell>INR {subTotal.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3} className="text-right font-bold">Incl + GST 18%</TableCell>
            <TableCell>INR {totalWithTax.toFixed(2)}</TableCell>
          </TableRow>
        </Table>
      </div>
    );
  }
  