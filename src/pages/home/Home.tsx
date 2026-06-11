import Sidebar from "@/components/sidebar/Sidebar";
import Navbar from "@/components/navbar/Navbar";
import Widget from "@/components/widget/Widget";
import Featured from "@/components/featured/Featured";
import Chart from "@/components/chart/Chart";
import Table from "@/components/table/Table";

const Home = () => {
  return (
    <div className="flex bg-background min-h-screen w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Widgets Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Widget type="user" />
            <Widget type="product" />
            <Widget type="order" />
            <Widget type="earning" />
          </div>

          {/* Charts Row */}
          <div className="flex flex-col lg:flex-row gap-6">
            <Featured />
            <Chart title="Last 6 Months (Revenue)" aspect={2.5 / 1} />
          </div>

          {/* Transactions List */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">Latest Transactions</h2>
            <Table />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
