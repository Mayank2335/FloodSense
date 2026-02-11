import { useState } from 'react';
import { Header } from '@/components/Header';
import { activeAlerts } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Navigation, BookOpen, Shield, Home, Droplets, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Footer } from '@/components/Footer';

const DistrictResources = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    area: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/reports`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                reporterName: formData.name,
                location: formData.area,
                description: `Emergency Request: Resources needed at ${formData.address}. Contact: ${formData.phone}`,
                status: 'pending'
            }),
        });
    
        if (response.ok) {
            toast({
                title: "Request Received",
                description: `Disaster Response Team has been notified for ${formData.area}.`,
            });
            setOpen(false);
            setFormData({ name: '', address: '', phone: '', area: '' });
        } else {
             toast({
                title: "Submission Failed",
                description: "Please try again or contact emergency services directly.",
                variant: 'destructive'
            });
        }
    } catch (error) {
         toast({
            title: "Error",
            description: "Network error. Please try again.",
            variant: 'destructive'
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const resources = [
    {
      category: 'Emergency Contacts',
      icon: Phone,
      items: [
        { name: 'National Disaster Response Force (NDRF)', value: '011-24363260' },
        { name: 'Flood Control Room', value: '1070' },
        { name: 'Police Emergency', value: '100' },
        { name: 'Ambulance', value: '102' },
        { name: 'Fire Service', value: '101' },
      ]
    },
    {
      category: 'Evacuation Guidelines',
      icon: Navigation,
      content: [
        "Pack an emergency kit with 3 days of supplies.",
        "Turn off gas, electricity, and water supplies.",
        "Follow designated evacuation routes only.",
        "Avoid wading through flood waters.",
        "Keep listening to battery-operated radio for updates."
      ]
    },
    {
      category: 'Shelter Locations',
      icon: Home,
      items: [
        { name: 'Community Center', value: 'Sector 4, Main Hall' },
        { name: 'Govt. High School', value: 'District Block B' },
        { name: 'Municipal Stadium', value: 'North Gate Entry' }
      ]
    },
    {
      category: 'Post-Flood Safety',
      icon: Shield,
      content: [
        "Do not return home until authorities say it is safe.",
        "Clean and disinfect everything that got wet.",
        "Throw away food that has come into contact with flood water.",
        "Report downed power lines immediately.",
        "Watch out for animals that may have entered buildings."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header alertCount={activeAlerts.length} />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          District Resources
        </h1>
        <p className="text-muted-foreground mb-8">
          Essential information and emergency resources for flood-prone districts.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((resource, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <resource.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>{resource.category}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {resource.items ? (
                  <ul className="space-y-3 mt-2">
                    {resource.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                        <span className="font-medium text-slate-700">{item.name}</span>
                        <span className="text-primary font-bold">{item.value}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                   <ul className="space-y-2 mt-2 list-disc pl-5">
                    {resource.content?.map((item, idx) => (
                      <li key={idx} className="text-slate-600">{item}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="mt-12">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white border-0">
             <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <Droplets className="h-6 w-6" /> 
                    Need Sandbags or Emergency Kits?
                  </h2>
                  <p className="text-blue-100 max-w-xl">
                    Emergency supplies are available for residents in high-risk zones. 
                    Submit a request to your local municipal corporation for immediate assistance.
                  </p>
                </div>
                
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant="secondary" size="lg" className="whitespace-nowrap">
                      Request Supplies
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Emergency Supply Request</DialogTitle>
                      <DialogDescription>
                        Complete this form to request sandbags, rations, or first-aid kits. 
                        Priority is given to Danger/Warning zones.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="col-span-3"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="phone" className="text-right">
                            Phone
                          </Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="col-span-3"
                            placeholder="+91..."
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="area" className="text-right">
                            Area/City
                          </Label>
                          <Input
                            id="area"
                            value={formData.area}
                            onChange={handleInputChange}
                            className="col-span-3"
                            placeholder="e.g. Model Town"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="address" className="text-right">
                            Address
                          </Label>
                          <Input
                            id="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="col-span-3"
                            placeholder="Street, House No..."
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            "Submit Request"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

             </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DistrictResources;
