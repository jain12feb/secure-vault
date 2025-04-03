"use client";

import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCategory } from "@/context-api/AppProvider";

// Schema for form validation
const formSchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(50, "Category name must be 50 characters or less"),
  description: z.string().optional(),
});

export default function CategoriesPage() {
  const {
    categories,
    isCategoriesLoading,
    addOrUpdateCategory,
    editingCategory,
    isDialogOpen,
    removeCategory,
    setEditingCategory,
    setIsDialogOpen,
    isCategoryUpdating,
  } = useCategory();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (values) => {
    await addOrUpdateCategory(values);
    form.reset();
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    form.setValue("name", category?.name);
    form.setValue("description", category?.description);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage your password categories
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingCategory(null);
                form.reset();
              }}
            >
              <Plus />
              <span className="hidden sm:block">Add Category</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter category name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter category description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>

                  <Button
                    disabled={
                      isCategoryUpdating ||
                      Object.keys(form.formState.errors).filter(
                        (e) => e != null
                      )[0]
                    }
                    type="submit"
                  >
                    {isCategoryUpdating
                      ? editingCategory
                        ? "Updating..."
                        : "Adding..."
                      : editingCategory
                      ? "Update"
                      : "Add"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Count</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isCategoriesLoading
            ? Array.from([1, 2, 3]).map((item) => (
                <tr key={item}>
                  <td className="p-4 w-40">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </td>
                  <td className="p-4 w-10">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </td>
                  <td className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex space-x-2">
                      <div className="h-10 w-10 bg-gray-200 rounded"></div>
                      <div className="h-10 w-10 bg-gray-200 rounded"></div>
                    </div>
                  </td>
                </tr>
              ))
            : categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="w-40">{category.name}</TableCell>
                  <TableCell className="w-10">{category.count}</TableCell>
                  {/* Placeholder for description */}
                  <TableCell>{category.description || "-"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
