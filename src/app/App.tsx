import { RouterProvider } from "./providers/RouterProvider";
import { QueryProvider } from "./providers/QueryProvider";
import { Toaster } from "@/shared/components/ui/sonner";
import Theme from "@/shared/components/common/Theme";

function App() {
  return (
    <QueryProvider>
      <Theme/>
      <RouterProvider />
      <Toaster position="top-right" richColors closeButton />
    </QueryProvider>
  );
}

export default App;
