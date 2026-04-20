// import { Footer } from "./Footer";
// import Header from "./Header";
import { Outlet } from "react-router-dom";
export function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ====== Header - Tuong nha (co dinh) ===== */}
      {/* <Header /> */}

      {/* MAIN CONTAIN - Outlet (thay doi theo url) */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-6">
        <Outlet />
      </main>

      {/* FOOTER - nen nha (co dinh) */}

      {/* <Footer /> */}
    </div>
  );
}
