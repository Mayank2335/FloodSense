import { Droplets, Github, Twitter, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="gradient-ocean rounded-xl p-2">
                <Droplets className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">FloodSense Dal</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm mb-4">
              Protecting communities through real-time flood monitoring and early warning systems. 
              Built for resilience, designed for everyone.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Dashboard</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">District Map</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Alert History</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Report Flood</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Safety Guidelines</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Emergency Contacts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">API Documentation</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>              <li><a href="/admin/login" className="text-muted-foreground hover:text-primary transition-colors">Admin Access</a></li>            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
             <p className="text-sm text-foreground font-medium">
              © 2026 FloodSense Dal Initiative.
             </p>
             <p className="text-xs text-muted-foreground">
               Version 2.0.1-stable • Node: Asia-South1 • <span className="text-green-600 font-mono">System Normal</span>
             </p>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Govt Data Portal</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
