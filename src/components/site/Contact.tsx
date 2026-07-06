// src/components/site/Contact.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useI18n } from "@/i18n";

const WEB3FORMS_ACCESS_KEY = "a600c2b9-0c16-4896-840d-3ca41cf49170";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  message: z.string().min(5),
  botcheck: z.string().optional(), // honeypot
});

type FormValues = z.infer<typeof schema>;

export default function Contact() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", message: "", botcheck: "" },
  });

  async function onSubmit(values: FormValues) {
    // Spam protection: if honeypot is filled, silently drop
    if (values.botcheck) return;

    setLoading(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: "New enquiry from AppMaker Egypt website",
          from_name: "AppMaker Egypt Website",
          name: values.name,
          email: values.email,
          phone: values.phone,
          message: values.message,
          botcheck: "",
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(t.contact.sent ?? "Message sent successfully!");
        form.reset();
      } else {
        toast.error(data.message ?? "Failed to send. Please try again.");
      }
    } catch (err) {
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Honeypot — hidden from real users */}
        <input
          type="checkbox"
          name="botcheck"
          tabIndex={-1}
          autoComplete="off"
          style={{ display: "none" }}
          {...form.register("botcheck")}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.contact.name}</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.contact.email}</FormLabel>
              <FormControl><Input type="email" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.contact.phone}</FormLabel>
              <FormControl><Input type="tel" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.contact.message}</FormLabel>
              <FormControl><Textarea rows={5} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (t.contact.sending ?? "Sending...") : (t.contact.send ?? "Send")}
        </Button>
      </form>
    </Form>
  );
}
