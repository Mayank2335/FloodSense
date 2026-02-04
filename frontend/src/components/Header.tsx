import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplets, Bell, Menu, X, Phone, User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  alertCount: number;
}

export function Header({ alertCount }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = localStorage.getItem('user');
  let userData = null;
  try {
    userData = user ? JSON.parse(user) : null;
  } catch (e) {
    console.error("Failed to parse user data", e);
    localStorage.removeItem('user');
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navLinks = [
    { href: '#dashboard', label: 'Dashboard', active: true },
    { href: '#districts', label: 'Districts', active: false },
    { href: '#alerts', label: 'Alerts', active: false },
    { href: '#resources', label: 'Resources', active: false },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-lg supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="gradient-ocean rounded-xl p-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Droplets className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">FloodSense</h1>
              <p className="text-xs text-muted-foreground">Early Warning System</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                  link.active 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden lg:flex flex-col items-end mr-2">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Helpline</span>
              <a href="tel:112" className="text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1">
                <Phone className="h-3 w-3" />
                112 / 911
              </a>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative group">
                  <Bell className="h-5 w-5 transition-transform group-hover:rotate-12" />
                  {alertCount > 0 && (
                    <Badge 
                      variant="danger" 
                      className="absolute -top-1 -right-1 h-5 min-w-5 p-0 flex items-center justify-center text-[10px] animate-pulse"
                    >
                      {alertCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      You have {alertCount} unread alerts.
                    </p>
                  </div>
                  {alertCount > 0 ? (
                    <div className="grid gap-2">
                      <div className="rounded-md bg-red-50 p-3 text-sm text-red-900 border border-red-100">
                        <p className="font-semibold">⚠️ Flash Flood Warning</p>
                        <p className="text-xs mt-1">Severe flooding reported in District A. Evacuate immediately.</p>
                      </div>
                      <div className="rounded-md bg-orange-50 p-3 text-sm text-orange-900 border border-orange-100">
                         <p className="font-semibold">🌊 Water Level Rising</p>
                         <p className="text-xs mt-1">River Yamuna water level crossed danger mark.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
                      No new notifications
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            {userData ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                       <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`} alt={userData.username} />
                      <AvatarFallback>{userData.username?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userData.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">{userData.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Login
              </Button>
            )}

            <Button variant="hero" size="sm" className="hidden sm:flex shadow-lg hover:shadow-xl transition-shadow">
              Report Flood
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-down">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                    link.active 
                      ? 'text-primary bg-primary/10' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
              <Button variant="ghost" className="justify-start gap-2">
                <Phone className="h-4 w-4" />
                Emergency: 1-800-FLOOD
              </Button>
              <Button variant="hero" className="w-full">
                Report Flood
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
