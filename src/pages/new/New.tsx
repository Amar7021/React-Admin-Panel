import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { dbService } from "@/lib/db";
import { AlertCircle, Sparkles } from "lucide-react";
import { serializeFireBaseErrors } from "@/utils";

const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(10, "Phone number must be at most 10 digits").refine((val) => /^\d+$/.test(val), {
    message: "Phone number must be at least 10 digits and contain only numbers"
  }),
  address: z.string().optional().or(z.literal("")),
  country: z.string().optional().or(z.literal("")),
  status: z.enum(["active", "pending", "passive"]).default("active")
});

const productSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional().or(z.literal("")),
  category: z.string().min(2, "Category is required"),
  price: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number"
  }),
  stock: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Stock must be 0 or more"
  })
});

interface NewProps {
  inputs?: any[];
  title: string;
}

const New = ({ title }: NewProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const type = location.pathname.includes("/products") ? "products" : "users";

  const [file, setFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<any>({
    resolver: zodResolver(type === "users" ? userSchema : productSchema),
    defaultValues: type === "users"
      ? { username: "", displayName: "", email: "", password: "", phone: "", address: "", country: "", status: "active" }
      : { title: "", description: "", category: "", price: "", stock: "" },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onSubmit = async (values: any) => {
    try {
      setErrorMsg(null);
      if (type === "users") {
        await dbService.addUser(values, file || undefined);
      } else {
        await dbService.addProduct({
          title: values.title,
          description: values.description || "",
          category: values.category,
          price: Number(values.price),
          stock: Number(values.stock),
        }, file || undefined);
      }
      navigate(-1);
    } catch (err: any) {
      console.error("Creation failed", err);
      setErrorMsg(err.message || "Failed to create record. Please try again.");
    }
  };

  return (
    <main className="flex-1 p-6 space-y-6 overflow-y-auto">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="flex-1 lg:max-w-xs flex flex-col items-center justify-center p-6 text-center border-dashed">
          <CardContent className="space-y-4 pt-6 flex items-center flex-col">
            <div className="relative group">
              <img
                src={
                  file
                    ? URL.createObjectURL(file)
                    : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                }
                // alt="preview"
                className="h-32 w-32 rounded-full object-cover border border-border bg-muted ring-4 ring-muted/50"
              />
              <label
                htmlFor="fileInput"
                className="h-32 w-32 absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold cursor-pointer transition-opacity"
              >
                Change Image
              </label>
            </div>
            <div>
              <h3 className="font-semibold text-sm">Image Attachment</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Accepts PNG, JPG, or WEBP up to 2MB
              </p>
            </div>
            <Input
              type="file"
              id="fileInput"
              onChange={(e) => {
                const files = e.target.files;
                if (files && files[0]) setFile(files[0]);
              }}
              accept=".jpg, .jpeg, .png, .webp"
              className="hidden"
            />
            {/* <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("fileInput")?.click()}
                  className="w-full gap-1.5 cursor-pointer"
                >
                  <Upload className="h-4 w-4" />
                  Upload
                </Button> */}
          </CardContent>
        </Card>

        <Card className="flex-2">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {errorMsg && (
                <div className="flex items-center gap-2 p-3 text-xs bg-destructive/10 text-destructive border border-destructive/20 rounded-lg select-none">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p className="font-semibold">{serializeFireBaseErrors(errorMsg)}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {type === "users" ? (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Username</label>
                      <Input placeholder="john_doe" {...register("username")} />
                      {errors.username && <span className="text-xs text-destructive font-semibold">{errors.username.message}</span>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Full Name</label>
                      <Input placeholder="John Doe" {...register("displayName")} />
                      {errors.displayName && <span className="text-xs text-destructive font-semibold">{errors.displayName.message}</span>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Email Address</label>
                      <Input placeholder="john@example.com" {...register("email")} />
                      {errors.email && <span className="text-xs text-destructive font-semibold">{errors.email.message}</span>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Password</label>
                      <Input type="password" placeholder="••••••••" {...register("password")} />
                      {errors.password && <span className="text-xs text-destructive font-semibold">{errors.password.message}</span>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Phone Number</label>
                      <Input placeholder="+1 234 567 89" {...register("phone")} type="tel" minLength={10} maxLength={10} />
                      {errors.phone && <span className="text-xs text-destructive font-semibold">{errors.phone.message}</span>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Street Address</label>
                      <Input placeholder="123 Main St" {...register("address")} />
                      {errors.address && <span className="text-xs text-destructive font-semibold">{errors.address.message}</span>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Country</label>
                      <Input placeholder="USA" {...register("country")} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Status</label>
                      <select
                        className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring text-foreground"
                        {...register("status")}
                      >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="passive">Passive</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Product Title</label>
                      <Input placeholder="Apple MacBook Pro" {...register("title")} />
                      {errors.title && <span className="text-xs text-destructive font-semibold">{errors.title.message}</span>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Category</label>
                      <Input placeholder="Computers" {...register("category")} />
                      {errors.category && <span className="text-xs text-destructive font-semibold">{errors.category.message}</span>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Description</label>
                      <Input placeholder="Short product details..." {...register("description")} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Unit Price ($)</label>
                      <Input placeholder="999" {...register("price")} />
                      {errors.price && <span className="text-xs text-destructive font-semibold">{errors.price.message}</span>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Stock Level</label>
                      <Input placeholder="10" {...register("stock")} />
                      {errors.stock && <span className="text-xs text-destructive font-semibold">{errors.stock.message}</span>}
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="font-bold cursor-pointer"
                >
                  {isSubmitting ? "Saving..." : "Save Record"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default New;
