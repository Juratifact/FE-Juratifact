import { RouterProvider } from "./providers/RouterProvider";
import { QueryProvider } from "./providers/QueryProvider";
import { Toaster } from "@/shared/components/ui/sonner";

function App() {
  return (
    <QueryProvider>
      <RouterProvider />
      <Toaster position="top-right" richColors closeButton />
    </QueryProvider>
  );
}

export default App;
