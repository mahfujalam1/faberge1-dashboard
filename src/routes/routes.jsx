/* eslint-disable no-unused-vars */
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import DashboardHome from "../page/DashboardHome/DashboardHome";
import ForgetPassword from "../page/Auth/ForgetPassword/ForgetPassword";
import SignIn from "../page/Auth/SignIn/SignIn";
import Otp from "../page/Auth/Otp/Otp";
import NewPassword from "../page/Auth/NewPassword/NewPassword";
import PersonalInformationPage from "../page/PersonalInformation/PersonalInformationPage";
import SettingsPage from "../page/Settings/SettingsPage";
import AboutUsPage from "../page/AboutUs/AboutUsPage";
import EditAboutUs from "../page/EditAboutUs/EditAboutUs";
import PrivacyPolicyPage from "../page/PrivacyPolicy/PrivacyPolicyPage";
import EditPersonalInformationPage from "../page/EditPersonalInformationPage/EditPersonalInformationPage";
import EditPrivacyPolicy from "../page/EditPrivacyPolicy/EditPrivacyPolicy";
import TermsConditions from "../page/TermsConditions/TermsConditions";
import EditTermsConditions from "../page/EditTermsConditions/EditTermsConditions";
import Notification from "../component/Main/Notification/Notification";
import EarningsPage from "../page/EarningsPage/EarningsPage";
import UsersPage from "../page/Users/UsersPage";
import Analytics from "../page/Analytics/Analytics";
import ServicePage from "../page/Service/ServicePage";
import States from "../page/States/States";
import BookingsPage from "../page/Bookings/BookingsPage";
import TransactionsPage from "../page/Transaction/TransactionPage";
import CreateManager from "../page/CreateManager/CreateManager";
import ManagerManagement from "../page/ManagerManagement/ManagerManagement";
import HelpSupport from "../page/Help&Support/HelpSupport";
import LegalitiesPage from "../page/legalities/LegalitiesPage";
import AdminRoutes from "./AdminRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AdminRoutes>
        <MainLayout />
      </AdminRoutes>
    ),
    errorElement: <h1>Error</h1>,
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
      {
        path: "Earnings",
        element: <EarningsPage />,
      },
      {
        path: "profile",
        element: <PersonalInformationPage />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
      {
        path: "services",
        element: <ServicePage />,
      },
      {
        path: "bookings",
        element: <BookingsPage />,
      },
      {
        path: "states",
        element: <States />,
      },
      {
        path: "transaction",
        element: <TransactionsPage />,
      },
      {
        path: "create-manager",
        element: <CreateManager />,
      },
      {
        path: "manager-management",
        element: <ManagerManagement />,
      },
      {
        path: "edit-personal-info",
        element: <EditPersonalInformationPage />,
      },
      {
        path: "/notification",
        element: <Notification />,
      },
      {
        path: "/help",
        element: <HelpSupport />,
      },
      {
        path: "site-content",
        element: <SettingsPage />,
      },
      {
        path: "legalities",
        element: <LegalitiesPage />,
      },
      {
        path: "legalities/privacy-policy",
        element: <PrivacyPolicyPage />,
      },
      {
        path: "/legalities/edit-privacy-policy/:id",
        element: <EditPrivacyPolicy />,
      },
      {
        path: "legalities/terms-conditions",
        element: <TermsConditions />,
      },
      {
        path: "/legalities/edit-terms-conditions/:id",
        element: <EditTermsConditions />,
      },
      {
        path: "site-content/about-us",
        element: <AboutUsPage />,
      },
      {
        path: "/site-content/edit-about-us/11",
        element: <EditAboutUs />,
      },
    ],
  },
  {
    path: "/auth",
    errorElement: <h1>Auth Error</h1>,
    children: [
      {
        index: true,
        element: <SignIn />,
      },
      {
        path: "sign-in",
        element: <SignIn />,
      },
      {
        path: "forgot-password",
        element: <ForgetPassword />,
      },
      {
        path: "otp/:email",
        element: <Otp />,
      },
      {
        path: "new-password/:email",
        element: <NewPassword />,
      },
    ],
  },
]);

export default router;
