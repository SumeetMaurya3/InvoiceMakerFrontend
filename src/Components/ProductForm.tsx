import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import axios from "axios";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const formSchema = z.object({
  productName: z.string().min(1, { message: "Product Name is required." }),
  productPrice: z.coerce.number().min(1, { message: "Product Price must be positive." }),
  quantity: z.coerce.number().min(1, { message: "Quantity must be at least 1." }),
});

interface ProductFormProps {
  onProductAdded: () => void;
}

export function Productform({ onProductAdded }: ProductFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      productPrice: 0,
      quantity: 1,
    },
  });

  const user = useSelector((state: RootState) => state.user.user);
  const userId = user?._id;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userId) {
      console.error("User not found!");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/product/add`, {
        user_id: userId,
        name: values.productName,
        quantity: values.quantity,
        price: values.productPrice,
      });

      console.log("✅ Product added successfully");
      onProductAdded(); // Notify parent to refresh table
      form.reset();
    } catch (error: any) {
      console.error(
        "❌ Error adding product:",
        error.response?.data?.message || error.message
      );
    }
  }

  return (
    <div className="py-5 bg-black text-white rounded-md shadow-md w-full">
    <h2 className="text-3xl font-bold mb-4 text-start">Add Products</h2>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          <FormField
            control={form.control}
            name="productName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field}  className="py-6 bg-[#27272a] border-[#404040]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="productPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter price" {...field}  className="py-6 bg-[#27272a] border-[#404040]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter quantity" {...field} className="py-6 bg-[#27272a] border-[#404040]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-center">
          <Button
            type="submit"
            className="bg-[#44403c] text-[#a3e635] px-6 py-2 rounded-md"
          >
            Add Product
          </Button>
        </div>
      </form>
    </Form>
  </div>
  );

}
