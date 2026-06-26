import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Mail, User, MapPin, Send } from 'lucide-react';
import '../styles/Contact.css';

const contactSchema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Invalid email'),
  company: z.string().optional(),
  message: z.string().min(10, 'Message must be 10+ characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setLoading(true);
    // Simulate submission
    await new Promise((r) => setTimeout(r, 1200));
    console.log('Contact form:', data);
    toast.success("Message sent! We'll get back to you soon.");
    reset();
    setLoading(false);
  };

  return (
    <div className="contact-page">
      <div className="container contact-container">
        <div className="contact-header">
          <h1>Get in Touch</h1>
          <p>Have a question or want to learn more? We'd love to hear from you.</p>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <div className="contact-info-card">
              <Mail size={20} />
              <h3>Email Us</h3>
              <p>support@luminary-ai.com</p>
            </div>
            <div className="contact-info-card">
              <MapPin size={20} />
              <h3>Location</h3>
              <p>India,Jharkhand </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                <User size={14} /> Name
              </label>
              <input
                {...register('name')}
                id="name"
                type="text"
                placeholder="Your Name"
                className={`form-input${errors.name ? ' error' : ''}`}
              />
              {errors.name && <span className="form-error">{errors.name.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <Mail size={14} /> Email
              </label>
              <input
                {...register('email')}
                id="email"
                type="email"
                placeholder="you@example.com"
                className={`form-input${errors.email ? ' error' : ''}`}
              />
              {errors.email && <span className="form-error">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="company" className="form-label">Company (optional)</label>
              <input
                {...register('company')}
                id="company"
                type="text"
                placeholder="Your Company"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message" className="form-label">Message</label>
              <textarea
                {...register('message')}
                id="message"
                placeholder="Tell us how we can help..."
                className={`form-input${errors.message ? ' error' : ''}`}
                rows={5}
              />
              {errors.message && <span className="form-error">{errors.message.message}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Send Message'}
              {!loading && <Send size={18} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
