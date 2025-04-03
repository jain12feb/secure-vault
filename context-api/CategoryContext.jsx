"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  createCategory,
  deleteCategory,
  fetchUserCategories,
  updateCategory,
} from "@/actions/categoryActions";
import { useUserProfile } from "./UserProfileContext";

// Create the context
const CategoryContext = createContext({
  isCategoriesLoading: true,
  categories: [],
  isDialogOpen: false,
  setIsDialogOpen: () => {},
  editingCategory: null,
  setEditingCategory: () => {},
  addOrUpdateCategory: () => {},
  removeCategory: () => {},
  isCategoryUpdating: false,
  setCategoryUpdating: () => {},
});

// Create the provider component
export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [isCategoriesLoading, setCategoriesLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isCategoryUpdating, setCategoryUpdating] = useState(false);

  const { toast } = useToast();
  const { user } = useUserProfile();

  // Load categories initially
  const loadCategories = async (userId) => {
    if (!userId) return;

    try {
      setCategoriesLoading(true);
      const fetchedCategories = await fetchUserCategories(userId);
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast({
        title: "Error",
        description: "Failed to load categories.",
        variant: "destructive",
      });
    } finally {
      setCategoriesLoading(false);
    }
  };

  const addOrUpdateCategory = async (categoryData) => {
    setCategoryUpdating(true);
    try {
      if (editingCategory) {
        // Update category logic here (implement server action for updating)
        const updatedCategory = await updateCategory(
          editingCategory.id,
          categoryData.name,
          categoryData.description
        );
        setCategories(
          categories.map((cat) =>
            cat.id === editingCategory.id ? { ...updatedCategory } : cat
          )
        );
        toast({
          title: "Category updated",
          description: `Category "${editingCategory.name}" has been updated".`,
        });
      } else {
        // Add category logic here (implement server action for adding)
        const newCategory = {
          // id: String(categories.length + 1),
          name: categoryData.name,
          description: categoryData.description,
          // createdAt: new Date().toISOString().split("T")[0],
          // updatedAt: new Date().toISOString().split("T")[0],
          // passwordCount: 0,
          // noteCount: 0,
          // count: 0,
        };
        const addedCategory = await createCategory(
          user?.id,
          newCategory.name,
          newCategory.description
        );
        setCategories([...categories, addedCategory]);
        toast({
          title: "Category added",
          description: `New category "${categoryData.name}" has been added.`,
        });
      }
      setIsDialogOpen(false);
      // setEditingCategory(null);
    } catch (error) {
      console.log("Error adding or updating category:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to add or update category.",
        variant: "destructive",
      });
    } finally {
      setCategoryUpdating(false);
    }
  };

  const removeCategory = async (categoryId) => {
    try {
      // Implement server action for deleting a category
      const isCategoryDeleted = await deleteCategory(categoryId);
      if (isCategoryDeleted?.success) {
        setCategories(categories.filter((cat) => cat.id !== categoryId));
        toast({
          title: "Category deleted",
          description: "The category has been deleted.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to delete category.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadCategories(user.id);
    }
  }, [user?.id]);

  // Context value
  const value = {
    isCategoriesLoading,
    categories,
    isDialogOpen,
    setIsDialogOpen,
    editingCategory,
    setEditingCategory,
    addOrUpdateCategory,
    removeCategory,
    isCategoryUpdating,
    setCategoryUpdating,
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};

// Custom hook to use the category context
export function useCategory() {
  const context = useContext(CategoryContext);

  if (context === null) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }

  return context;
}
