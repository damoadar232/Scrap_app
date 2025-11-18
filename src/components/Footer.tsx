import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* About Us Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <Logo size={32} className="text-green-500" />
              <h3 className="text-white">Scrap Square</h3>
            </div>
            <p className="text-sm leading-relaxed">
              Scrap Square is your trusted partner in sustainable waste management. 
              We provide convenient doorstep pickup services for all types of recyclable materials, 
              helping create a cleaner, greener future.
            </p>
            <p className="text-sm text-green-400">
              Making recycling easy, one pickup at a time.
            </p>
          </div>

          {/* Contact Info Section */}
          <div className="space-y-3">
            <h3 className="text-white mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-white">Head Office</p>
                  <p className="text-gray-400">
                    123 Green Street, Eco Park<br />
                    Bangalore, Karnataka 560001<br />
                    India
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-green-500 flex-shrink-0" />
                <div className="text-sm">
                  <a href="tel:+911234567890" className="hover:text-green-400 transition-colors">
                    +91 123 456 7890
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-green-500 flex-shrink-0" />
                <div className="text-sm">
                  <a href="mailto:support@scrapsquare.com" className="hover:text-green-400 transition-colors">
                    support@scrapsquare.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Service Hours & Social Links */}
          <div className="space-y-3">
            <h3 className="text-white mb-4">Service Hours</h3>
            <div className="text-sm space-y-2 mb-4">
              <p className="text-gray-400">Monday - Saturday</p>
              <p className="text-white">8:00 AM - 8:00 PM</p>
              <p className="text-gray-400">Sunday</p>
              <p className="text-white">9:00 AM - 5:00 PM</p>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-white">Follow Us</h4>
              <div className="flex gap-3">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-2 rounded-full hover:bg-green-600 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-2 rounded-full hover:bg-green-600 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-2 rounded-full hover:bg-green-600 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-2 rounded-full hover:bg-green-600 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Service Areas */}
        <div className="border-t border-gray-800 pt-6 mb-6">
          <h4 className="text-white mb-3">Service Areas</h4>
          <p className="text-sm text-gray-400">
            Currently serving: Bangalore, Hyderabad, Chennai, Mumbai, Delhi NCR, Pune, Kolkata
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Scrap Square. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm">
            <a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a>
            <span className="text-gray-600">|</span>
            <a href="#" className="hover:text-green-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
