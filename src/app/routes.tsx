import { createBrowserRouter } from "react-router";
import Root from "./components/Root";
import Home from "./components/pages/Home";
import BookListing from "./components/pages/BookListing";
import ReadingPage from "./components/pages/ReadingPage";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import Classical from "./components/pages/Classical";
import Favorites from "./components/pages/Favorites";
import Admin from "./components/pages/Admin";
import NotFound from "./components/pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "books", Component: BookListing },
      { path: "books/:id", Component: ReadingPage },
      { path: "classical", Component: Classical },
      { path: "favorites", Component: Favorites },
      { path: "login", Component: Login },
      { path: "signup", Component: Signup },
      { path: "admin", Component: Admin },
      { path: "*", Component: NotFound },
    ],
  },
]);
