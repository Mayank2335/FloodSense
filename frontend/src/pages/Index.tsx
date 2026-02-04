import { useNavigate } from 'react-router-dom';
import { HeroBackground } from '@/components/HeroBackground';
import { AlertBanner } from '@/components/AlertBanner';
import { StatCard } from '@/components/StatCard';
import { DistrictCard } from '@/components/DistrictCard';
import { InteractiveMap } from '@/components/InteractiveMap';
import { RiskLegend } from '@/components/RiskLegend';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { mockDistricts, activeAlerts, getSummaryStats, systemLogs } from '@/data/mockData';
import { AlertTriangle, Shield, Users, Gauge, Radio, List } from 'lucide-react';

const Index = () => {
  const stats = getSummaryStats();
  const navigate = useNavigate();
  const user = localStorage.getItem('user');

  return (
    <div className="min-h-screen bg-slate-100/40 relative overflow-hidden font-sans selection:bg-blue-500/20">
      <HeroBackground />
      
      <Header alertCount={activeAlerts.length} />

      <AlertBanner alerts={activeAlerts} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Alerts"
            value={stats.activeAlerts}
            subtitle="Immediate Action Required"
            icon={AlertTriangle}
            variant="danger"
            trend="up"
            trendValue="+2"
          />
          <StatCard
            title="Monitored Districts"
            value={stats.total}
            subtitle="Full Network Coverage"
            icon={Gauge}
            variant="default"
          />
          <StatCard
            title="Population at Risk"
            value={stats.totalPopulationAtRisk.toLocaleString()}
            subtitle="Estimated Impact"
            icon={Users}
            variant="warning"
            trend="up"
          />
          <StatCard
            title="System Status"
            value="OPTIMAL"
            subtitle="All Sensors Online"
            icon={Shield}
            variant="success"
          />
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 min-h-[600px]">
          
          <div className="xl:col-span-3 flex flex-col gap-4">
             <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                   <Radio className="h-4 w-4 text-blue-500" />
                   Live Geospatial Monitor
                </h3>
                <div className="flex gap-2">
                   <span className="px-2 py-1 bg-white border rounded text-[10px] uppercase font-bold text-slate-500">Sat-View</span>
                   <span className="px-2 py-1 bg-blue-600 text-white rounded text-[10px] uppercase font-bold shadow-sm">Topography</span>
                </div>
             </div>
             <div className="relative flex-1 bg-white/40 backdrop-blur-sm border border-slate-200/60 rounded-xl shadow-sm overflow-hidden p-1 min-h-[500px]">
                <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-slate-300 rounded-tl-lg z-10 -translate-x-px -translate-y-px pointer-events-none" />
                <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-slate-300 rounded-tr-lg z-10 translate-x-px -translate-y-px pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-slate-300 rounded-bl-lg z-10 -translate-x-px translate-y-px pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-slate-300 rounded-br-lg z-10 translate-x-px translate-y-px pointer-events-none" />
                
                <InteractiveMap />
                
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur border shadow-lg rounded-lg p-3 z-10 max-w-xs">
                   <RiskLegend />
                </div>
             </div>
          </div>

          <div className="flex flex-col gap-4 h-full">
             <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                   <List className="h-4 w-4 text-blue-500" />
                   Intelligence Feed
                </h3>
             </div>
             
             <div className="bg-white/60 backdrop-blur-md border border-slate-200/60 rounded-xl shadow-sm flex-1 overflow-hidden flex flex-col max-h-[500px]">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                   <span className="text-xs font-bold text-slate-500 uppercase">Incoming Reports</span>
                   <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                </div>
                <div className="overflow-y-auto flex-1 p-2 space-y-2">
                   {systemLogs.map((log) => (
                     <div key={log.id} className="p-3 bg-white border border-slate-100 rounded-lg hover:border-slate-300 transition-colors shadow-sm group">
                       <div className="flex justify-between items-start mb-1">
                         <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                           log.type === 'danger' ? 'bg-red-100 text-red-700' : 
                           log.type === 'warning' ? 'bg-amber-100 text-amber-700' : 
                           'bg-blue-100 text-blue-700'
                         }`}>
                           {log.type}
                         </span>
                         <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                       </div>
                       <p className="text-xs text-slate-700 font-medium leading-relaxed group-hover:text-black">
                         {log.message}
                       </p>
                     </div>
                   ))}
                </div>
             </div>
          </div>

        </div>

        <section id="districts" className="space-y-4 pt-4 border-t border-slate-200/50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               <Shield className="h-5 w-5 text-blue-500" />
               District Status Detail
            </h3>
            <button className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded font-medium transition-colors">Export Daily Report</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {mockDistricts
              .sort((a, b) => {
                const order = { danger: 0, warning: 1, watch: 2, safe: 3 };
                return order[a.riskLevel] - order[b.riskLevel];
              })
              .map((district) => (
                <DistrictCard district={district} key={district.id} />
              ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 bg-white/40 backdrop-blur py-6 mt-12">
        <div className="container mx-auto px-4 flex justify-between items-center text-xs text-slate-400">
           <p>© 2026 FloodSense Network. Restricted Access.</p>
           <div className="flex gap-4">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Status</span>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
