export interface ProductVariant {
  id: number;
  title: string;
  subTitle: string;
  price: number;
}

const products = {
  milkshake: {
    id: 1,
    title: "Milkshake",
    slug: "milkshake",
    description: "20 Cups of different flavours",
    mainImage: require("@/assets/images/items/milkshake.png"),
    assets: [
      require("@/assets/images/items/milkshake/1.png"),
      require("@/assets/images/items/milkshake/2.png"),
      require("@/assets/images/items/milkshake/3.png"),
      require("@/assets/images/items/milkshake/4.png"),
      require("@/assets/images/items/milkshake/5.png"),
      require("@/assets/images/items/milkshake/6.png"),
    ],
    variants: [
      {
        id: 1,
        title: "Caramel",
        subTitle: "Machito",
        price: 5.78,
      },
      {
        id: 2,
        title: "Salted Caramel",
        subTitle: "Milkshake",
        price: 12.49,
      },
      {
        id: 3,
        title: "Peanut Butter",
        subTitle: "Milkshake",
        price: 9.49,
      },
      {
        id: 4,
        title: "Strawberry",
        subTitle: "Milkshake",
        price: 7.2,
      },
      {
        id: 5,
        title: "Banana",
        subTitle: "Milkshake",
        price: 5.78,
      },
      {
        id: 6,
        title: "Chocolate",
        subTitle: "Milkshake",
        price: 11.49,
      },
    ],
  },
  "chicken-burger": {
    id: 2,
    title: "Chicken Burger",
    slug: "chicken-burger",
    description: "20 sets of different flavours",
    mainImage: require("@/assets/images/items/burger.png"),
    assets: [
      require("@/assets/images/items/chicken-burger/1.png"),
      require("@/assets/images/items/chicken-burger/2.png"),
      require("@/assets/images/items/chicken-burger/3.png"),
      require("@/assets/images/items/chicken-burger/4.png"),
      require("@/assets/images/items/chicken-burger/5.png"),
      require("@/assets/images/items/chicken-burger/6.png"),
    ],
    variants: [
      {
        id: 7,
        title: "Chicken",
        subTitle: "Classic",
        price: 9.99,
      },
      {
        id: 8,
        title: "Veggies",
        subTitle: "Special",
        price: 13.99,
      },
      {
        id: 9,
        title: "Meaty",
        subTitle: "Classic",
        price: 8.99,
      },
      {
        id: 10,
        title: "Cheese",
        subTitle: "Deluxe",
        price: 13.99,
      },
      {
        id: 11,
        title: "Mixed Veggies",
        subTitle: "Supreme",
        price: 11.99,
      },
      {
        id: 12,
        title: "Plumpy",
        subTitle: "Special",
        price: 9.99,
      },
    ],
  },
};

export const icons = {
  add: require("@/assets/icons/add.png"),
  cup: require("@/assets/icons/cup.svg"),
  burger: require("@/assets/icons/burger.svg"),
  arrowLeft: require("@/assets/icons/arrow-left.png"),
  cart: require("@/assets/icons/cart.png"),
};

export const menuItems = Object.values(products).map(
  ({ id, mainImage, title, slug, description }) => ({
    id,
    image: mainImage,
    title,
    slug,
    description,
  })
);

export default products;