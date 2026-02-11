import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Bell, FileText, CheckCircle, AlertTriangle, ShieldAlert, Trash2 } from "lucide-react";

interface Report {
  _id: string;
  reporterName: string;
  location: string;
  description: string;
  status: 'pending' | 'verified' | 'resolved';
  createdAt: string;
}

interface Alert {
  _id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  location: string;
}

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [reports, setReports] = useState<Report[]>([]);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    
    // New Alert Form State
    const [newAlert, setNewAlert] = useState({
        title: '',
        description: '',
        severity: 'medium',
        location: ''
    });

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            navigate("/admin/login");
            return;
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
             // Fetch Reports
             const apiUrl = import.meta.env.VITE_API_URL;
             const resReports = await fetch(`${apiUrl}/api/reports`);
             if (resReports.ok) setReports(await resReports.json());

             // Fetch Alerts
             const resAlerts = await fetch(`${apiUrl}/api/alerts`);
             if (resAlerts.ok) setAlerts(await resAlerts.json());

        } catch (error) {
            console.error("Failed to fetch admin data", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
    };

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        const apiUrl = import.meta.env.VITE_API_URL;
        await fetch(`${apiUrl}/api/reports/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        toast({ title: "Updated", description: "Report status updated." });
        fetchData();
    };

    const handleCreateAlert = async (e: React.FormEvent) => {
        e.preventDefault();
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${apiUrl}/api/alerts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newAlert)
        });
        
        if (res.ok) {
            toast({ title: "Alert Broadcasted", description: "Public warning sent successfully." });
            setNewAlert({ title: '', description: '', severity: 'medium', location: '' });
            fetchData();
        }
    };

    const handleDeleteAlert = async (id: string) => {
        const apiUrl = import.meta.env.VITE_API_URL;
        await fetch(`${apiUrl}/api/alerts/${id}`, { method: 'DELETE' });
        toast({ title: "Alert Removed", description: "This alert is no longer active." });
        fetchData();
    };


    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
            <header className="max-w-7xl mx-auto flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2 text-red-500">
                        <ShieldAlert className="h-8 w-8" />
                        FloodSense Command Center
                    </h1>
                    <p className="text-slate-400 text-sm">Admin Operation Dashboard</p>
                </div>
                <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
            </header>

            <main className="max-w-7xl mx-auto">
                <Tabs defaultValue="reports" className="space-y-6">
                    <TabsList className="bg-slate-900 border-slate-800 text-slate-400">
                        <TabsTrigger value="reports" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">
                            <FileText className="mr-2 h-4 w-4" /> Incoming Reports
                        </TabsTrigger>
                        <TabsTrigger value="alerts" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">
                            <AlertTriangle className="mr-2 h-4 w-4" /> Active Alerts System
                        </TabsTrigger>
                    </TabsList>

                    {/* REPORTS TAB */}
                    <TabsContent value="reports">
                        <div className="grid grid-cols-1 gap-4">
                            {reports.length === 0 && (
                                <div className="p-12 text-center text-slate-500 bg-slate-900 rounded-lg border border-slate-800 border-dashed">
                                    No incoming reports at this time.
                                </div>
                            )}
                            {reports.map((report) => (
                                <Card key={report._id} className="bg-slate-900 border-slate-800 text-slate-200">
                                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                                        <div>
                                            <CardTitle className="text-lg font-semibold">{report.location}</CardTitle>
                                            <div className="text-sm text-slate-400 mt-1">Reported by: {report.reporterName}</div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                            ${report.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                                              report.status === 'verified' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 
                                              'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                                            {report.status}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="mb-4 text-slate-300">{report.description}</p>
                                        <div className="flex gap-2">
                                            {report.status !== 'verified' && report.status !== 'resolved' && (
                                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => handleUpdateStatus(report._id, 'verified')}>
                                                    Verify Report
                                                </Button>
                                            )}
                                            {report.status !== 'resolved' && (
                                                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleUpdateStatus(report._id, 'resolved')}>
                                                    Mark Resolved
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* ALERTS TAB */}
                    <TabsContent value="alerts">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                            {/* Create Alert Form */}
                            <div className="md:col-span-1">
                                <Card className="bg-slate-900 border-slate-800 sticky top-6">
                                    <CardHeader>
                                        <CardTitle className="text-white">Broadcast New Alert</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleCreateAlert} className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm text-slate-400">Headline</label>
                                                <Input 
                                                    className="bg-slate-950 border-slate-700 text-white" 
                                                    placeholder="Flash Flood Warning..."
                                                    value={newAlert.title}
                                                    onChange={e => setNewAlert({...newAlert, title: e.target.value})}
                                                    required 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm text-slate-400">Affected Location</label>
                                                <Input 
                                                    className="bg-slate-950 border-slate-700 text-white" 
                                                    placeholder="District A, North Zone..." 
                                                    value={newAlert.location}
                                                    onChange={e => setNewAlert({...newAlert, location: e.target.value})}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm text-slate-400">Severity Level</label>
                                                <Select 
                                                    value={newAlert.severity} 
                                                    onValueChange={(val: any) => setNewAlert({...newAlert, severity: val})}
                                                >
                                                    <SelectTrigger className="bg-slate-950 border-slate-700 text-white">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                                        <SelectItem value="low">Low - Advisory</SelectItem>
                                                        <SelectItem value="medium">Medium - Watch</SelectItem>
                                                        <SelectItem value="high">High - Critical Warning</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm text-slate-400">Detailed Message</label>
                                                <Textarea 
                                                    className="bg-slate-950 border-slate-700 text-white min-h-[100px]" 
                                                    placeholder="Describe the threat and necessary actions..." 
                                                    value={newAlert.description}
                                                    onChange={e => setNewAlert({...newAlert, description: e.target.value})}
                                                    required
                                                />
                                            </div>
                                            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
                                                <Bell className="mr-2 h-4 w-4" /> Broadcast Now
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Active Alerts List */}
                            <div className="md:col-span-2 space-y-4">
                                <h3 className="text-lg font-semibold text-slate-300 mb-4">Active Public Alerts</h3>
                                {alerts.length === 0 && (
                                    <div className="text-slate-500 italic">No active alerts currently broadcasted.</div>
                                )}
                                {alerts.map(alert => (
                                    <Card key={alert._id} className="bg-slate-900 border-slate-800">
                                        <CardContent className="p-4 flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                        alert.severity === 'high' ? 'bg-red-900/50 text-red-400 border border-red-900' :
                                                        alert.severity === 'medium' ? 'bg-orange-900/50 text-orange-400 border border-orange-900' :
                                                        'bg-blue-900/50 text-blue-400 border border-blue-900'
                                                    }`}>
                                                        {alert.severity}
                                                    </span>
                                                    <span className="text-xs text-slate-500 ml-2">{new Date().toLocaleDateString()}</span>
                                                </div>
                                                <h4 className="font-bold text-white text-lg">{alert.title}</h4>
                                                <p className="text-sm text-slate-400 mb-1 font-mono">📍 {alert.location}</p>
                                                <p className="text-sm text-slate-300 mt-2">{alert.description}</p>
                                            </div>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="text-slate-500 hover:text-red-500 hover:bg-red-950/30"
                                                onClick={() => handleDeleteAlert(alert._id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
};

export default AdminDashboard;
