import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "@/components/sidebar/Sidebar";
import Navbar from "@/components/navbar/Navbar";
import Chart from "@/components/chart/Chart";
import List from "@/components/table/Table";
import { dbService, User } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Globe, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";

const Single = () => {
  const { userId, productId } = useParams();
  const id = userId || productId || "";
  const type = userId ? "users" : "products";

  const [userRecord, setUserRecord] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadRecord = () => {
      setLoading(true);
      // Retrieve item
      const unsub = dbService.listenUsers((users) => {
        const found = users.find(u => u.id === id);
        if (active) {
          if (found) {
            setUserRecord(found);
          } else {
            // Fallback default user if not found in db
            setUserRecord({
              id: "fallback",
              username: "janedoe",
              displayName: "Jane Doe (Default)",
              email: "janedoe@gmail.com",
              phone: "+1 2345 67 89",
              address: "Elton St. 234 Garden Yd. NewYork",
              country: "USA",
              status: "active",
              img: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
            });
          }
          setLoading(false);
        }
      });
      return unsub;
    };

    const unsub = loadRecord();
    return () => {
      active = false;
      unsub();
    };
  }, [id]);

  return (
    <div className="flex bg-background min-h-screen w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Top Panel: Card Profile & Charts */}
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Left: Detail Profile Info Card */}
            <Card className="flex-1 min-w-[320px] relative overflow-hidden">
              <CardHeader className="flex flex-row justify-between items-center pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Information
                </CardTitle>
                <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs font-semibold cursor-pointer">
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {loading ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-24 w-24 rounded-full bg-muted mx-auto" />
                    <div className="h-4 bg-muted rounded-sm w-3/4 mx-auto" />
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded-sm w-5/6" />
                      <div className="h-3 bg-muted rounded-sm w-4/6" />
                    </div>
                  </div>
                ) : (
                  userRecord && (
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                      <img
                        src={userRecord.img || "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"}
                        alt={userRecord.displayName}
                        className="h-24 w-24 rounded-full object-cover border border-border shadow-xs"
                      />
                      <div className="flex-1 space-y-4 text-center sm:text-left">
                        <div>
                          <h2 className="text-xl font-bold text-foreground leading-snug">
                            {userRecord.displayName}
                          </h2>
                          <p className="text-xs text-muted-foreground">@{userRecord.username}</p>
                        </div>

                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center justify-center sm:justify-start gap-2.5">
                            <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span>{userRecord.email}</span>
                          </div>
                          {userRecord.phone && (
                            <div className="flex items-center justify-center sm:justify-start gap-2.5">
                              <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                              <span>{userRecord.phone}</span>
                            </div>
                          )}
                          {userRecord.address && (
                            <div className="flex items-center justify-center sm:justify-start gap-2.5">
                              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                              <span>{userRecord.address}</span>
                            </div>
                          )}
                          {userRecord.country && (
                            <div className="flex items-center justify-center sm:justify-start gap-2.5">
                              <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
                              <span>{userRecord.country}</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <span className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold select-none",
                            {
                              "bg-green-500/10 text-green-600": userRecord.status === "active",
                              "bg-amber-500/10 text-amber-600": userRecord.status === "pending",
                              "bg-red-500/10 text-red-600": userRecord.status === "passive",
                            }
                          )}>
                            {userRecord.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </CardContent>
            </Card>

            {/* Right: User Spending Chart */}
            <Chart aspect={3 / 1} title="User Spending (Last 6 Months)" />
          </div>

          {/* Bottom Panel: Transactions Log */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">Latest Transactions</h2>
            <List />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Single;
