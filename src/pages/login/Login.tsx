import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lock, Mail, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { dbService } from "@/lib/db";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { serializeFireBaseErrors } from "@/utils";
import { Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const resetPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [isResetOpen, setIsResetOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setCurrentUser } = useAuthStore();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const emailValue = watch("email");

  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    formState: {
      errors: resetErrors,
      isSubmitting: isResetSubmitting,
    },
    reset,
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setErrorMsg(null);
      const user = await dbService.signIn(values.email, values.password);
      setCurrentUser(user);
      navigate("/");
    } catch (err: any) {
      console.error("Login failed", err);
      setErrorMsg(serializeFireBaseErrors(err.message));
    }
  };

  const onResetPassword = async (
    values: ResetPasswordValues
  ) => {
    try {
      await dbService.resetPassword(values.email);

      toast.success(
        "Password reset email sent. Check your inbox."
      );

      reset();
      setIsResetOpen(false);
    } catch (error: any) {
      console.error("Reset password failed", error);
      toast.error(
        serializeFireBaseErrors(error.message)
      );
    }
  };

  return (
    <>
      <div className="min-h-screen w-full flex items-center justify-center bg-radial from-muted/50 to-background p-4 sm:p-6">
        <Card className="w-full max-w-md border border-border shadow-lg bg-card/65 backdrop-blur-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Enter your credentials to access the Admin Dashboard
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {errorMsg && (
                <div className="flex items-center gap-2 p-3 text-xs bg-destructive/10 text-destructive border border-destructive/20 rounded-lg select-none">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p className="font-semibold">{errorMsg}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Email</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="email"
                    placeholder="admin@admin.com"
                    className={cn(
                      "pl-9",
                      errors.email && "border-destructive focus-visible:ring-destructive"
                    )}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-destructive font-semibold flex items-center gap-1 select-none">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-muted-foreground">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      reset({
                        email: emailValue,
                      });
                      setIsResetOpen(true)
                    }}
                    className="text-xs text-primary hover:underline cursor-pointer"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={cn(
                      "pl-9",
                      errors.password && "border-destructive focus-visible:ring-destructive"
                    )}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-destructive font-semibold flex items-center gap-1 select-none">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      <Dialog
        open={isResetOpen}
        onOpenChange={setIsResetOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Reset Password
            </DialogTitle>

            <DialogDescription>
              Enter your email address and we'll send
              you a password reset link.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleResetSubmit(
              onResetPassword
            )}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Email
              </label>

              <div className="relative flex items-center">
                <Mail className="absolute left-3 h-4 w-4 text-muted-foreground" />

                <Input
                  type="email"
                  placeholder="admin@admin.com"
                  className="pl-9"
                  {...registerReset("email")}
                />
              </div>

              {resetErrors.email && (
                <p className="text-[11px] text-destructive font-semibold">
                  {resetErrors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isResetSubmitting}
            >
              {isResetSubmitting
                ? "Sending..."
                : "Send Reset Link"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Login;
