import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowLeft, MessageCircle, Mail, Phone, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ContactSupportProps {
  currentUser: string | null;
  onBack: () => void;
}

export interface SupportMessage {
  id: string;
  userPhone: string;
  userName: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'open' | 'resolved';
}

export function ContactSupport({ currentUser, onBack }: ContactSupportProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Load user profile for name
  const getUserName = (): string => {
    try {
      const profiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
      return profiles[currentUser || '']?.name || 'User';
    } catch {
      return 'User';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const newMessage: SupportMessage = {
      id: Date.now().toString(),
      userPhone: currentUser || '',
      userName: getUserName(),
      subject: subject.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
      status: 'open'
    };

    // Save to localStorage
    try {
      const messages = JSON.parse(localStorage.getItem('supportMessages') || '[]');
      messages.unshift(newMessage);
      localStorage.setItem('supportMessages', JSON.stringify(messages));
      
      // Set flag for admin notification
      localStorage.setItem('hasNewSupportMessage', 'true');
      
      setIsSubmitted(true);
      toast.success('Message sent to admin successfully!');
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubject('');
        setMessage('');
        setIsSubmitted(false);
      }, 3000);
    } catch {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-white">Contact Support</h1>
            <p className="text-green-100 text-sm">We're here to help</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-600 p-3 rounded-full">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-gray-900">Phone Support</h3>
                <p className="text-blue-700">+91 98765 43210</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">Mon-Sat, 9 AM - 6 PM</p>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-600 p-3 rounded-full">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-gray-900">Email Support</h3>
                <p className="text-green-700 text-sm">support@scrapsquare.com</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">24-48 hours response time</p>
          </Card>
        </div>

        {/* Success Message */}
        {isSubmitted && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <span className="font-medium">Message sent successfully!</span> Our admin team will review your message and get back to you soon.
            </AlertDescription>
          </Alert>
        )}

        {/* Support Form */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-600 p-3 rounded-full">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-gray-900">Send a Message</h3>
              <p className="text-gray-600 text-sm">Admin will respond within 24 hours</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Your Phone Number</Label>
              <Input
                id="phone"
                value={currentUser || ''}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                placeholder="e.g., Pickup Delay, Payment Issue, General Query"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                placeholder="Describe your issue or question in detail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                required
                className="resize-none"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-900 text-sm">
                💡 <span className="font-medium">Tip:</span> Please provide as much detail as possible to help us assist you better. Include your request ID if applicable.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-green-600 hover:bg-green-700"
              disabled={isSubmitted}
            >
              <Send className="w-5 h-5 mr-2" />
              Send Message to Admin
            </Button>
          </form>
        </Card>

        {/* FAQ */}
        <Card className="p-6">
          <h3 className="text-gray-900 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-3">
            <div className="border-l-4 border-green-600 pl-3">
              <h4 className="font-medium text-gray-900 mb-1">How long does pickup take?</h4>
              <p className="text-gray-600 text-sm">
                Once approved, our team will pickup within 24-48 hours at your scheduled time.
              </p>
            </div>
            <div className="border-l-4 border-blue-600 pl-3">
              <h4 className="font-medium text-gray-900 mb-1">What if I need to reschedule?</h4>
              <p className="text-gray-600 text-sm">
                Contact support immediately with your request ID, and we'll help you reschedule.
              </p>
            </div>
            <div className="border-l-4 border-purple-600 pl-3">
              <h4 className="font-medium text-gray-900 mb-1">How do I track my request?</h4>
              <p className="text-gray-600 text-sm">
                Check "My Requests" section in your profile to see the current status.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
