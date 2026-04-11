'use client'

import { Mail, Heart } from 'lucide-react'

const footerLinks = {
  quickLinks: [
    { label: 'Templates', href: '#templates' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#about' },
  ],
}

export function Footer() {
  const scrollTo = (href: string) => {
    const element = document.querySelector(href)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href="#hero" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-lg">
                🦘
              </div>
              <span className="font-semibold text-foreground">Kangaroo Developers</span>
            </a>
            <p className="text-sm text-muted-foreground max-w-xs">
              Create professional resumes in minutes. Free templates, PDF & Word downloads, no sign-up required.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Contact</h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Kangaroo Developers</p>
              <a 
                href="mailto:su92-bssem-f25-277@superior.edu.pk"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Mail className="h-4 w-4" />
                su92-bssem-f25-277@superior.edu.pk
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} Kangaroo Developers. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-red-500 fill-current" /> by Kangaroo Developers
          </p>
        </div>
      </div>
    </footer>
  )
}
