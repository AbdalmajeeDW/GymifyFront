import { FaHome, FaChartBar, FaCog, FaSignOutAlt } from "react-icons/fa";

import { BsFillClipboardFill } from "react-icons/bs";
import { HiShoppingCart } from "react-icons/hi2";
import { GiTeacher } from "react-icons/gi";
import { FaUserFriends } from "react-icons/fa";
import { ReactNode } from "react";
export interface NavLink {
  id: number;
  name: string;
  url: string;

  icon?: ReactNode;
  title?: string;
  description?: string;
  subLinks?: NavLink[];

  protected?: boolean;
}
export const links: NavLink[] = [
  {
    id: 1,
    name: "Home",
    icon: <FaHome size={20} />,
    url: "/",
    title: "Dashboard",
    description: "Welcome to the dashboard",
  },
  {
    id: 2,
    name: "Players",
    icon: <FaUserFriends size={20} />,
    url: "/playersManagement",
    title: "Players Management",
    description: "Manage all gym players",
    subLinks: [
      {
        id: 21,
        name: "Add Player",
        url: "/playersManagement/addPlayer",
        title: "Add New Player",
        description: "Fill in the details to create a new player",
      },
      {
        id: 22,
        name: "View Card Details",
        url: "/viewCardDetails",
        title: "View Card Details",
        description: "Fill in the details to create a new player",
      },
    ],
  },
  {
    id: 3,
    name: "Trainers",
    icon: <GiTeacher size={20} />,
    url: "/trainersManagement",
    title: "Trainers Management",
    description: "Manage all gym trainers",
    subLinks: [
      {
        id: 21,
        name: "Add Trainer",
        url: "/trainersManagement/addTrainer",
        title: "Add New Trainer",
        description: "Fill in the details to create a new Trainer",
      },
    ],
  },
  {
    id: 4,
    name: "Subscriptions",
    icon: <FaChartBar size={20} />,
    url: "/subscriptionsManagement",
    title: "Subscriptions Management",
    description: "Overview of subscriptions and plans",
  },
  {
    id: 5,
    name: "Products",
    icon: <HiShoppingCart size={20} />,
    url: "/productsManagement",
    title: "Products Management",
    description: "Manage gym products and inventory",
    subLinks: [
      {
        id: 51,
        name: "Add Product",
        url: "/productsManagement/addProduct",
        title: "Add New Product",
        description: "Fill in the details to create a new Trainer",
      },
    ],
  },
  {
    id: 6,
    name: "Programs",
    icon: <BsFillClipboardFill size={20} />,
    url: "/sportsPrograms",
    title: "Sports Programs",
    description: "Create and manage sports programs",
  },
  {
    id: 7,
    name: "Settings",
    icon: <FaCog size={20} />,
    url: "/settings",
    title: "Settings",
    description: "Adjust your application preferences",
  },
  { id: 8, name: "Logout", icon: <FaSignOutAlt size={20} />, url: "/login" },
];
