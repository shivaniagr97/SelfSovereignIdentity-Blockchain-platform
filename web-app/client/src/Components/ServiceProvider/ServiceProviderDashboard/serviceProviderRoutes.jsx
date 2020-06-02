/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import WorkIcon from '@material-ui/icons/Work';

// core components/views for Admin layout
import DashboardPage from "./DashboardPage.jsx";
import ServiceProviderProfile from "./ServiceProviderProfile.jsx";
import ServiceRequest from "./serviceRequests";
import ProvideService from "./provideService";

const dashboardRoutes = [
    {
        path: "/dashboard",
        name: "Dashboard",
        rtlName: "لوحة القيادة",
        icon: Dashboard,
        component: DashboardPage,
        layout: "/home"
    },
    {
        path: "/serviceProvider",
        name: "ServiceProvider Profile",
        rtlName: "ملف تعريفي للمستخدم",
        icon: Person,
        component: ServiceProviderProfile,
        layout: "/home"
    },
    {
        path: "/serviceRequests",
        name: "Service Requests",
        rtlName: "طباعة",
        icon: LibraryBooks,
        component: ServiceRequest,
        layout: "/home"
    },
    {
        path: "/provideService",
        name: "Provide Service",
        rtlName: "طباعة",
        icon: LibraryBooks,
        component: ProvideService,
        layout: "/home"
    },
    // {
    //     path: "/uploadDocument",
    //     name: "Upload Document",
    //     rtlName: "قائمة الجدول",
    //     icon: ArrowUpward,
    //     component: UploadDocument,
    //     layout: "/home"
    // },
    // {
    //     path: "/viewDocuments",
    //     name: "View Documents",
    //     rtlName: "طباعة",
    //     icon: LibraryBooks,
    //     component: ViewDocuments,
    //     layout: "/home"
    // }
    // {
    //     path: "/icons",
    //     name: "Icons",
    //     rtlName: "الرموز",
    //     icon: BubbleChart,
    //     component: Icons,
    //     layout: "/admin"
    // },
    // {
    //     path: "/maps",
    //     name: "Maps",
    //     rtlName: "خرائط",
    //     icon: LocationOn,
    //     component: Maps,
    //     layout: "/admin"
    // },
    // {
    //     path: "/notifications",
    //     name: "Notifications",
    //     rtlName: "إخطارات",
    //     icon: Notifications,
    //     component: NotificationsPage,
    //     layout: "/admin"
    // },
    // {
    //     path: "/rtl-page",
    //     name: "RTL Support",
    //     rtlName: "پشتیبانی از راست به چپ",
    //     icon: Language,
    //     component: RTLPage,
    //     layout: "/rtl"
    // },
    // {
    //     path: "/upgrade-to-pro",
    //     name: "Upgrade To PRO",
    //     rtlName: "التطور للاحترافية",
    //     icon: Unarchive,
    //     component: UpgradeToPro,
    //     layout: "/admin"
    // }
];

export default dashboardRoutes;
