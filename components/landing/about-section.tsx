'use client'

import { Mail, Users, MapPin, Code, Heart, FileText, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              About & Contact
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Kangaroo Developers was created to help job seekers create professional resumes 
              quickly and easily, without the hassle of sign-ups or complicated tools.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* About Content */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Our Mission
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We believe everyone deserves access to professional resume tools. 
                  Our platform provides high-quality, ATS-friendly templates that help 
                  you stand out in your job search. No hidden fees, no complicated 
                  sign-up processes - just beautiful resumes, ready to download in PDF or Word format.
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  Built With Care
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Kangaroo Developers is built using modern web technologies to ensure 
                  a fast, responsive, and seamless experience across all devices. 
                  Our templates are designed by professionals and optimized for 
                  applicant tracking systems (ATS).
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Features
                </h3>
                <ul className="text-muted-foreground leading-relaxed space-y-2">
                  <li className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-primary" />
                    Download in PDF & Word formats
                  </li>
                  <li className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-primary" />
                    Save and edit your resumes anytime
                  </li>
                  <li className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-primary" />
                    No sign-up or account required
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-card border border-border rounded-xl p-8">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Get In Touch
              </h3>

              <div className="space-y-6">
                {/* Company Info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xl">
                    🦘
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Company</p>
                    <p className="font-semibold text-foreground text-lg">Kangaroo Developers</p>
                  </div>
                </div>

                {/* Team */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Team</p>
                    <p className="font-medium text-foreground">Development Team</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <a 
                      href="mailto:su92-bssem-f25-277@superior.edu.pk"
                      className="font-medium text-primary hover:underline break-all"
                    >
                      su92-bssem-f25-277@superior.edu.pk
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Location</p>
                    <p className="font-medium text-foreground">Pakistan</p>
                  </div>
                </div>

                {/* Contact Button */}
                <div className="pt-4">
                  <Button 
                    asChild
                    className="w-full gap-2"
                  >
                    <a href="mailto:su92-bssem-f25-277@superior.edu.pk">
                      <Mail className="h-4 w-4" />
                      Send Email
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Features Summary */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Templates', value: '6+' },
              { label: 'Formats', value: 'PDF & Word' },
              { label: 'Cost', value: 'Free' },
              { label: 'Sign-up', value: 'Not Required' },
            ].map((stat) => (
              <div 
                key={stat.label}
                className="text-center p-4 bg-card border border-border rounded-xl"
              >
                <p className="text-2xl font-bold text-primary mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
