import Datatable from "@/components/datatable/Datatable";
import { useLocation } from "react-router-dom";

const List = () => {
  const location = useLocation();
  const title = location.pathname.startsWith("/products") ? "Product Catalog" : "Users Directory";

  return (
    <main className="flex-1 p-6 space-y-6 overflow-y-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
      </div>
      <Datatable />
    </main>
  );
};

export default List;
