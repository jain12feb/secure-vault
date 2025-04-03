"use server";

import { db } from "@/lib/db"; // Ensure Prisma Client is properly imported

// Fetch all categories for a specific user
export async function fetchUserCategories(userId) {
  try {
    const categories = await db.category.findMany({
      where: { userId }, // Filters categories by the user's ID
      include: {
        _count: {
          select: { passwords: true }, // Counts the number of passwords for each category
        },
      },
    });

    // Map the result to include the count as a top-level field for convenience
    return categories.map((category) => ({
      ...category,
      count: category._count.passwords, // Add count as a top-level field
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
}

// Create a new category
export async function createCategory(userId, name, description) {
  try {
    const category = await db.category.create({
      data: {
        name,
        description: description || null,
        user: {
          connect: { id: userId },
        },
      },
    });

    return category;
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error("Failed to create category");
  }
}

// Update an existing category
export async function updateCategory(categoryId, name, description) {
  try {
    const updatedCategory = await db.category.update({
      where: { id: categoryId },
      data: {
        name,
        description: description || null,
        updatedAt: new Date(),
      },
    });
    return updatedCategory;
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error("Failed to update category");
  }
}

// Delete a category
export async function deleteCategory(categoryId) {
  try {
    await db.category.delete({
      where: { id: categoryId },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Failed to delete category");
  }
}
