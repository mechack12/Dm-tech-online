import { Card, Button } from '../components/UI';
import { Mail, Phone, MessageSquare, MapPin, Globe, Github } from 'lucide-react';
import { motion } from 'motion/react';

export function SupportScreen() {
  const contactInfo = [
    { icon: Mail, label: 'Email Support', value: 'dushimemechack1@gmil.com', link: 'mailto:dushimemechack1@gmil.com' },
    { icon: Phone, label: 'Phone Support', value: '+250784510083', link: 'tel:+250784510083' },
    { icon: Globe, label: 'Website', value: 'dmtechltd.com', link: '#' },
    { icon: MapPin, label: 'Headquarters', value: 'Kigali, Rwanda', link: '#' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-8 py-20">
      <div className="text-center mb-20">
        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-bold font-display tracking-tight mb-6"
        >
            Support Center
        </motion.h1>
        <p className="text-gray-500 text-xl max-w-2xl mx-auto">
            We're here to help you with anything you need. Get in touch with our team for technical assistance, order status, or business inquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        {contactInfo.map((item, i) => (
            <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
            >
                <Card className="p-8 text-center group" hover>
                    <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-primary group-hover:text-bg-dark transition-all">
                        <item.icon className="w-8 h-8 text-brand-primary transition-colors group-hover:text-inherit" />
                    </div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{item.label}</h3>
                    <a href={item.link} className="text-lg font-bold font-display text-white hover:text-brand-primary transition-colors">
                        {item.value}
                    </a>
                </Card>
            </motion.div>
        ))}
      </div>

      <Card className="p-12 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
                <h2 className="text-4xl font-bold font-display mb-6">Send us a Message</h2>
                <p className="text-gray-400 mb-8 max-w-md">
                    Our team typically responds within 2 hours during business hours. Don't hesitate to reach out!
                </p>
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Live Chat Available (Mon-Fri)
                    </div>
                </div>
            </div>
            <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">First Name</label>
                        <input className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-brand-primary/50" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Last Name</label>
                        <input className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-brand-primary/50" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Subject</label>
                    <input className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-brand-primary/50" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Message</label>
                    <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-brand-primary/50 resize-none" />
                </div>
                <Button className="w-full py-4 text-sm font-bold uppercase tracking-widest">Send Inquiry</Button>
            </form>
        </div>
      </Card>
    </div>
  );
}
