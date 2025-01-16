import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CartItem {
  id: number;
  image: string;
  title: string;
  subTitle: string;
  price: number;
  quantity: number;
  temperature?: 'hot' | 'iced';
  size?: 'sm' | 'md' | 'lg';
}

const CART_STORAGE_KEY = '@cart_items';

export const storage = {
  // Add item to cart
  async addToCart(item: Omit<CartItem, 'quantity'>): Promise<void> {
    try {
      const currentCart = await this.getCartItems();
      const existingItemIndex = currentCart.findIndex(
        (cartItem) => 
          cartItem.id === item.id && 
          cartItem.temperature === item.temperature &&
          cartItem.size === item.size
      );

      if (existingItemIndex > -1) {
        // Item exists, increment quantity
        currentCart[existingItemIndex].quantity += 1;
      } else {
        // New item, add to cart
        currentCart.push({ ...item, quantity: 1 });
      }

      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(currentCart));
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  },

  // Get all cart items
  async getCartItems(): Promise<CartItem[]> {
    try {
      const items = await AsyncStorage.getItem(CART_STORAGE_KEY);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error('Error getting cart items:', error);
      return [];
    }
  },

  // Get cart total quantity
  async getCartQuantity(): Promise<number> {
    try {
      const items = await this.getCartItems();
      return items.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      console.error('Error getting cart quantity:', error);
      return 0;
    }
  },

  // Remove single quantity of an item
  async removeOneFromCart(item: Omit<CartItem, 'quantity'>): Promise<void> {
    try {
      const currentCart = await this.getCartItems();
      const existingItemIndex = currentCart.findIndex(
        (cartItem) => 
          cartItem.id === item.id && 
          cartItem.temperature === item.temperature &&
          cartItem.size === item.size
      );

      if (existingItemIndex > -1) {
        if (currentCart[existingItemIndex].quantity > 1) {
          // Decrease quantity by 1
          currentCart[existingItemIndex].quantity -= 1;
        } else {
          // Remove item if quantity would become 0
          currentCart.splice(existingItemIndex, 1);
        }
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(currentCart));
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw error;
    }
  },

  // Remove all quantities of an item
  async removeItemFromCart(item: Omit<CartItem, 'quantity'>): Promise<void> {
    try {
      const currentCart = await this.getCartItems();
      const filteredCart = currentCart.filter(
        (cartItem) => 
          !(cartItem.id === item.id && 
            cartItem.temperature === item.temperature &&
            cartItem.size === item.size)
      );
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(filteredCart));
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw error;
    }
  },

  // Clear entire cart
  async clearCart(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },

  // Get total price of cart
  async getCartTotal(): Promise<number> {
    try {
      const items = await this.getCartItems();
      return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    } catch (error) {
      console.error('Error calculating cart total:', error);
      return 0;
    }
  },

  // Get quantity of specific item
  async getItemQuantity(item: Omit<CartItem, 'quantity'>): Promise<number> {
    try {
      const items = await this.getCartItems();
      const cartItem = items.find(
        (i) => 
          i.id === item.id && 
          i.temperature === item.temperature &&
          i.size === item.size
      );
      return cartItem ? cartItem.quantity : 0;
    } catch (error) {
      console.error('Error getting item quantity:', error);
      return 0;
    }
  }
}; 