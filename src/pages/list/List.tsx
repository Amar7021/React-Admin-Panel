import Sidebar from "@/components/sidebar/Sidebar";
import Navbar from "@/components/navbar/Navbar";
import Datatable from "@/components/datatable/Datatable";
import { useLocation } from "react-router-dom";

const List = () => {
  const location = useLocation();
  const title = location.pathname.startsWith("/products") ? "Product Catalog" : "Users Directory";

  return (
    <div className="flex bg-background min-h-screen w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          </div>
          <Datatable />
        </main>
      </div>
    </div>
  );
};

export default List;
