import React, { useEffect, useState } from "react";
import Header from "./Header";
import Categories from "./Categories";
import MenuCard from "./MenuCard";
import Popup from "./Popup";
import axios from "axios";

interface Category {
  id: number;
  nama: string;
}

interface MenuItem {
  id: number;
  nama: string;
  harga: number;
  deskripsi: string;
  kategori_id: number;
  gambar: string;
}

interface CartItem {
  menu_id: string;
  kuantiti: number;
}

const MenuPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get("kategori-menu");
      setCategories(response.data.categories);
    };

    const fetchMenuItems = async () => {
      const response = await axios.get("menu");
      setMenuItems(response.data.menu);
    };

    const fetchCartItems = async () => {
      const response = await axios.get("cart");
      const items: CartItem[] = response.data.cart;
      const totalItems = items.length;
      setCartItemCount(totalItems);
    };

    fetchCategories();
    fetchMenuItems();
    fetchCartItems();
  }, []);

  const filteredMenuItems = selectedCategory
    ? menuItems.filter((item) => item.kategori_id === selectedCategory)
    : menuItems;

  const updateCartCount = () => {
    setCartItemCount((prev) => prev + 1);
  };

  const handleAddToCart = (menuId: number) => {
    setSelectedMenuId(menuId);
    setPopupVisible(true);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
  };

  return (
    <div className="min-h-screen bg-black">
      <Header cartItemCount={cartItemCount} />
      <Categories
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-2">
        {Array.isArray(filteredMenuItems) &&
          filteredMenuItems.map((item) => (
            <MenuCard
              key={item.id}
              nama={item.nama}
              harga={item.harga}
              deskripsi={item.deskripsi}
              gambar={item.gambar}
              onAddToCart={() => handleAddToCart(item.id)}
            />
          ))}
      </div>
      <Popup
        visible={popupVisible}
        onClose={handleClosePopup}
        menuId={selectedMenuId!}
        quantity={quantity}
        setQuantity={setQuantity}
        updateCartCount={updateCartCount}
      />
    </div>
  );
};

export default MenuPage;
