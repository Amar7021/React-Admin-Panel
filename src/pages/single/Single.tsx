import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Chart from "@/components/chart/Chart";
import List from "@/components/table/Table";
import { dbService, User, Product } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Globe, Edit2, Package, DollarSign, Boxes } from "lucide-react";
import { cn } from "@/lib/utils";

const Single = () => {
  const { userId, productId } = useParams();

  const [userRecord, setUserRecord] = useState<User | null>(null);
  const [productRecord, setProductRecord] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub: (() => void) | undefined;

    setLoading(true);

    if (userId) {
      unsub = dbService.listenUsers((users) => {
        const found = users.find((u) => u.id === userId);

        setUserRecord(found || null);
        setProductRecord(null);
        setLoading(false);
      });
    } else if (productId) {
      unsub = dbService.listenProducts((products) => {
        const found = products.find((p) => p.id === productId);

        setProductRecord(found || null);
        setUserRecord(null);
        setLoading(false);
      });
    }

    return () => {
      unsub?.();
    };
  }, [userId, productId]);

  return (
    <main className="flex-1 p-6 space-y-6 overflow-y-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="flex-1 min-w-[320px] relative overflow-hidden">
          <CardHeader className="flex flex-row justify-between items-center pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Information
            </CardTitle>

            {/* <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-xs font-semibold cursor-pointer"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Edit
            </Button> */}
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
              <>
                {/* USER VIEW */}
                {userRecord && (
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <img
                      src={userRecord.img || "/assets/no-img.jpg"}
                      alt={userRecord.displayName}
                      className="h-24 w-24 rounded-full object-cover border border-border shadow-xs"
                    />

                    <div className="flex-1 space-y-4 text-center sm:text-left">
                      <div>
                        <h2 className="text-xl font-bold text-foreground">
                          {userRecord.displayName}
                        </h2>
                        <p className="text-xs text-muted-foreground">
                          @{userRecord.username}
                        </p>
                      </div>

                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center justify-center sm:justify-start gap-2.5">
                          <Mail className="h-4 w-4 shrink-0" />
                          <span>{userRecord.email}</span>
                        </div>

                        {userRecord.phone && (
                          <div className="flex items-center justify-center sm:justify-start gap-2.5">
                            <Phone className="h-4 w-4 shrink-0" />
                            <span>{userRecord.phone}</span>
                          </div>
                        )}

                        {userRecord.address && (
                          <div className="flex items-center justify-center sm:justify-start gap-2.5">
                            <MapPin className="h-4 w-4 shrink-0" />
                            <span>{userRecord.address}</span>
                          </div>
                        )}

                        {userRecord.country && (
                          <div className="flex items-center justify-center sm:justify-start gap-2.5">
                            <Globe className="h-4 w-4 shrink-0" />
                            <span>{userRecord.country}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
                            {
                              "bg-green-500/10 text-green-600":
                                userRecord.status === "active",
                              "bg-amber-500/10 text-amber-600":
                                userRecord.status === "pending",
                              "bg-red-500/10 text-red-600":
                                userRecord.status === "passive",
                            }
                          )}
                        >
                          {userRecord.status}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* PRODUCT VIEW */}
                {productRecord && (
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <img
                      src={productRecord.img || "/assets/no-img.jpg"}
                      alt={productRecord.title}
                      className="h-24 w-24 rounded-xl object-cover border border-border shadow-xs"
                    />

                    <div className="flex-1 space-y-4 text-center sm:text-left">
                      <div>
                        <h2 className="text-xl font-bold text-foreground">
                          {productRecord.title}
                        </h2>

                        <p className="text-sm text-muted-foreground mt-1">
                          {productRecord.description}
                        </p>
                      </div>

                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center justify-center sm:justify-start gap-2.5">
                          <Package className="h-4 w-4 shrink-0" />
                          <span>{productRecord.category}</span>
                        </div>

                        <div className="flex items-center justify-center sm:justify-start gap-2.5">
                          <DollarSign className="h-4 w-4 shrink-0" />
                          <span>${productRecord.price}</span>
                        </div>

                        <div className="flex items-center justify-center sm:justify-start gap-2.5">
                          <Boxes className="h-4 w-4 shrink-0" />
                          <span>{productRecord.stock} in stock</span>
                        </div>
                      </div>

                      <div>
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
                            productRecord.stock > 10
                              ? "bg-green-500/10 text-green-600"
                              : productRecord.stock > 0
                                ? "bg-amber-500/10 text-amber-600"
                                : "bg-red-500/10 text-red-600"
                          )}
                        >
                          {productRecord.stock > 10
                            ? "In Stock"
                            : productRecord.stock > 0
                              ? "Low Stock"
                              : "Out of Stock"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {!userRecord && !productRecord && (
                  <div className="text-center py-8 text-muted-foreground">
                    Record not found.
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Chart
          aspect={3 / 1}
          title={
            userRecord
              ? "User Spending (Last 6 Months)"
              : "Product Performance (Last 6 Months)"
          }
        />
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-bold text-foreground">
          Latest Transactions
        </h2>
        <List />
      </div>
    </main>
  );
};

export default Single;