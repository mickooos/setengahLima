import React from "react";

interface CategoryProps {
  categories: { id: number; nama: string }[];
  selectedCategory: number | null;
  onSelectCategory: (id: number | null) => void;
}

const Categories: React.FC<CategoryProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex lg:justify-center gap-4 overflow-x-auto p-4">
      <button
        onClick={() => onSelectCategory(null)}
        className={`px-4 py-2 rounded-lg font-medium ${
          selectedCategory === null ? "bg-amber-950 text-white" : "bg-white"
        }`}
      >
        All Course
      </button>
      {Array.isArray(categories) &&
        categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-medium ${
              selectedCategory === category.id
                ? "bg-amber-950 text-white"
                : "bg-white"
            }`}
          >
            {category.nama}
          </button>
        ))}
    </div>
  );
};

export default Categories;
