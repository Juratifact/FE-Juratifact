import HomePage from "@/features/landing/pages/HomePage";
import { UserLayout } from "@/shared/layouts/UserLayout";
import { createBrowserRouter } from "react-router-dom";


export const router = createBrowserRouter([
    {
        element: <UserLayout/>,
        children: [
            {index: true, element: <HomePage/>}
        ]
    }
])