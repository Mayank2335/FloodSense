import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Profile = () => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header alertCount={2} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
        </Button>

        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 mobile-menu-gradient rounded-full flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">
                                {user.username?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <CardTitle className="text-2xl">{user.username}</CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium mb-2">Account Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">User ID</p>
                                <p className="font-mono text-sm">{user.userId || user._id}</p>
                            </div>
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">Member Since</p>
                                <p className="font-medium">Jan 2024</p>
                            </div>
                        </div>
                    </div>

                     <div>
                        <h3 className="text-lg font-medium mb-2">Preferences</h3>
                        <div className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Email Notifications</p>
                                    <p className="text-sm text-muted-foreground">Receive flood alerts via email</p>
                                </div>
                                <Button variant="outline" size="sm">Enabled</Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
