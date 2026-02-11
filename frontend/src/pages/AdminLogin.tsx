import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded Admin Credentials for quick setup, moved to backend later or env
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("adminToken", "admin-secret-token");
      toast({ title: "Admin Login Success", description: "Welcome back, Administrator." });
      navigate("/admin/dashboard");
    } else {
      toast({ title: "Access Denied", description: "Invalid admin credentials.", variant: "destructive" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <Card className="w-full max-w-md border-slate-800 bg-slate-950 text-slate-100">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-500/10 rounded-full">
              <Lock className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Admin Access</CardTitle>
          <CardDescription className="text-center text-slate-400">
            Secure Gateway for FloodSense Command Center
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Admin ID</Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-slate-900 border-slate-800 text-white focus:ring-red-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Passcode</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-900 border-slate-800 text-white focus:ring-red-500"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold">
              Verify Credentials
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
             <p className="text-xs text-slate-600">Restricted Area. Unauthorized access is monitored.</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
