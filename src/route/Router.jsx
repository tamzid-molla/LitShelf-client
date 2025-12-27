import { createBrowserRouter } from "react-router";
import Root from "../root/Root";
import DashboardLayout from "../root/DashboardLayout";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Bookshelf from "../pages/Bookshelf";
import BookDetails from "../pages/BookDetails";
import MyBooks from "../pages/MyBooks";
import Profile from "../pages/Profile";
import Dashboard from "../pages/Dashboard";
import Subscribe from "../pages/Subscribe";
import PrivateRoute from "../private/PrivateRoute";
import RatingContext from "../context/RatingContext";
import UpdateBook from "../components/myBooks/UpdateBook";
import BooksCategory from "../components/home/BooksCategory";
import ErrorPage from "../components/common/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/register",
        Component: Register,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/bookShelf",
        Component: Bookshelf,
      },
      {
        path: "/books/:id",
        element: (
          <PrivateRoute>
            <RatingContext>
              <BookDetails></BookDetails>
            </RatingContext>
          </PrivateRoute>
        ),
      },
      {
        path: "/myBooks",
        element: (
          <PrivateRoute>
            <MyBooks></MyBooks>
          </PrivateRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile></Profile>
          </PrivateRoute>
        ),
      },
      {
        path: "/updateBook/:id",
        Component: UpdateBook,
      },
      {
        path: "/books/categories/:id",
        Component: BooksCategory,
      },
      {
        path: "/subscribe",
        element: (
          <PrivateRoute>
            <Subscribe></Subscribe>
          </PrivateRoute>
        ),
      },
      {
        path: "*",
        Component: ErrorPage,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        Component: Dashboard,
      },
    ],
  },
]);

export default router;
