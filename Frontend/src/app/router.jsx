import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import LandingPage from "../pages/General/LandingPage.jsx";
import { AppLayout } from "../components/layout";
import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicRoute from "./PublicRoute.jsx";
import Loader from "../components/Common/Loader.jsx";

const SignUp = lazy(() => import("../pages/Auth/SignUp.jsx"));
const SignIn = lazy(() => import("../pages/Auth/SignIn.jsx"));
const VerifyUserPage = lazy(() => import("../pages/Auth/VerifyUserPage.jsx"));
const ForgotPassword = lazy(() => import("../pages/Auth/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("../pages/Auth/ResetPassword.jsx"));
const AuthSuccess = lazy(() => import("../pages/Auth/AuthSuccess.jsx"));
const TermsOfService = lazy(() => import("../pages/Legal/TermsOfService.jsx"));
const PrivacyPolicy = lazy(() => import("../pages/Legal/PrivacyPolicy.jsx"));
const Support = lazy(() => import("../pages/General/Support.jsx"));
const UpgradePlan = lazy(() => import("../pages/Payment/UpgradePlan.jsx"));
const ReviewOrder = lazy(() => import("../pages/Payment/ReviewOrder.jsx"));
const Home = lazy(() => import("../pages/User/Home.jsx"));
const Dashboard = lazy(() => import("../pages/User/Dashboard.jsx"));
const Settings = lazy(() => import("../pages/User/Settings.jsx"));
const History = lazy(() => import("../pages/User/History.jsx"));
const NotFound = lazy(() => import("../components/Common/NotFound.jsx"));

const withSuspense = (node) => (
  <Suspense fallback={<Loader />}>{node}</Suspense>
);

export const router = createBrowserRouter([
  { path: "/", element: <PublicRoute element={<LandingPage />} /> },
  { path: "/signup", element: withSuspense(<PublicRoute element={<SignUp />} />) },
  { path: "/signin", element: withSuspense(<PublicRoute element={<SignIn />} />) },
  { path: "/verify_user", element: withSuspense(<VerifyUserPage />) },
  { path: "/terms-of-service", element: withSuspense(<TermsOfService />) },
  { path: "/privacy-policy", element: withSuspense(<PrivacyPolicy />) },
  { path: "/signIn/forgot-password", element: withSuspense(<ForgotPassword />) },
  { path: "/reset-password", element: withSuspense(<ResetPassword />) },
  { path: "/auth-success", element: withSuspense(<AuthSuccess />) },
  { path: "/support", element: withSuspense(<Support />) },
  {
    path: "/upgrade-plan",
    element: withSuspense(<ProtectedRoute element={<UpgradePlan />} />),
  },
  {
    path: "/review-order",
    element: withSuspense(<ProtectedRoute element={<ReviewOrder />} />),
  },
  {
    element: <AppLayout />,
    children: [
      { path: "/home", element: withSuspense(<ProtectedRoute element={<Home />} />) },
      {
        path: "/dashboard",
        element: withSuspense(<ProtectedRoute element={<Dashboard />} />),
      },
      {
        path: "/settings",
        element: withSuspense(<ProtectedRoute element={<Settings />} />),
      },
      {
        path: "/history",
        element: withSuspense(<ProtectedRoute element={<History />} />),
      },
    ],
  },

  {
    path: "*",
    element: withSuspense(<NotFound />),
  },
]);
