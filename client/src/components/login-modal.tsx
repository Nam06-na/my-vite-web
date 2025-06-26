import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useLogin, useSetupAdmin } from "@/hooks/useAuth";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof loginSchema>;

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  mode: "login" | "setup";
}

export default function LoginModal({ open, onClose, mode }: LoginModalProps) {
  const { toast } = useToast();
  const loginMutation = useLogin();
  const setupMutation = useSetupAdmin();
  
  const form = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (mode === "setup") {
        await setupMutation.mutateAsync(data);
        toast({
          title: "Setup Complete",
          description: "Admin account created successfully. You can now log in.",
        });
        form.reset();
        onClose();
      } else {
        await loginMutation.mutateAsync(data);
        toast({
          title: "Login Successful",
          description: "Welcome back to your journal.",
        });
        form.reset();
        onClose();
      }
    } catch (error: any) {
      toast({
        title: mode === "setup" ? "Setup Failed" : "Login Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const isLoading = loginMutation.isPending || setupMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={() => !isLoading && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "setup" ? "Setup Admin Account" : "Login to Your Journal"}
          </DialogTitle>
          <DialogDescription>
            {mode === "setup" 
              ? "Create your admin account to manage your journal entries."
              : "Enter your credentials to access the journal editor."
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              {...form.register("username")}
              placeholder="Enter your username"
              disabled={isLoading}
            />
            {form.formState.errors.username && (
              <p className="text-sm text-red-600">
                {form.formState.errors.username.message}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...form.register("password")}
              placeholder="Enter your password"
              disabled={isLoading}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-600">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Please wait..." : mode === "setup" ? "Create Account" : "Login"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}