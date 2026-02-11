import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { AlertCircle, AlertTriangle, Info, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Alert {
    _id: string;
    title: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
    location: string;
    createdAt: string;
    level?: string; /* for safety if needed */
}

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await fetch(`${apiUrl}/api/alerts`);
            if (res.ok) {
                const data = await res.json();
                setAlerts(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    fetchAlerts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header alertCount={alerts.length} />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Bell className="h-8 w-8 text-primary" />
          Active Flood Alerts
        </h1>

        <div className="grid gap-6">
          {alerts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {loading ? "Loading alerts..." : "No active alerts at this time."}
            </div>
          ) : (
            alerts.map((alert) => (
              <Card key={alert._id} className={`border-l-4 ${
                alert.severity === 'high' ? 'border-l-red-500 bg-red-50/50' : 
                alert.severity === 'medium' ? 'border-l-orange-500 bg-orange-50/50' : 
                'border-l-blue-500 bg-blue-50/50'
              }`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      {alert.severity === 'high' ? (
                        <AlertCircle className="text-red-600 h-6 w-6" />
                      ) : alert.severity === 'medium' ? (
                        <AlertTriangle className="text-orange-600 h-6 w-6" />
                      ) : (
                        <Info className="text-blue-600 h-6 w-6" />
                      )}
                      {alert.title}
                      <span className="text-lg font-normal text-muted-foreground ml-1">
                        - {alert.location}
                      </span>
                      <Badge variant={
                        alert.severity === 'high' ? 'destructive' : 
                        alert.severity === 'medium' ? 'secondary' : 'outline'
                      } className={`ml-2 uppercase ${alert.severity === 'medium' ? 'bg-orange-100 text-orange-800' : ''}`}>
                        {alert.severity}
                      </Badge>
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">
                      Issued: {alert.createdAt ? new Date(alert.createdAt).toLocaleString() : 'Just now'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 leading-relaxed">
                    {alert.description}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Alerts;
