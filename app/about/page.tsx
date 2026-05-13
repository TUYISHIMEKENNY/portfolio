"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Heart,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AboutPage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center" data-aos="fade-up">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            About Me
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Get to know me and my journey
          </p>
        </div>

        {/* Bio Section */}
        <section className="mb-20 grid gap-12 md:grid-cols-2 md:gap-16">
          <div
            className="flex items-center justify-center"
            data-aos="fade-right"
          >
            <div className="relative h-[400px] w-[350px] overflow-hidden rounded-2xl">
              <Image
                src="/ngoma-about-img.png"
                alt="ngoma Portrait"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div
            className="flex flex-col justify-center space-y-6"
            data-aos="fade-left"
          >
            <div className="space-y-2">
              <Badge className="px-3 py-1 text-[12px]" variant="secondary">
                Full-Stack Web & Mobile App Developer
              </Badge>
              <h2 className="text-3xl font-bold">TUYISHIME KENNY ARAFAT</h2>
              <p className="text-muted-foreground">
                I'm a passionate full-stack and mobile developer with over 5
                years of experience creating applications that don’t just work —
                they make a difference. Also known as <strong>iNkodeInc</strong>,
                I am <strong>Chief Technology Officer iNkodeInc</strong>
                to deliver digital solutions that combine solid engineering with
                real business value.
              </p>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>
                My development journey started out of curiosity while studying
                computer science — I still remember launching my very first
                static website and realizing I could create something from
                scratch that lived on the internet for the world to see. That
                spark quickly turned into a career path.
              </p>
              <p>
                Over the years, I’ve built expertise in{" "}
                <strong>web applications</strong>,
                <strong> mobile apps (React Native)</strong>, and{" "}
                <strong>backend systems </strong>
                using both <strong>Node.js</strong> and{" "}
                <strong>Python (FastAPI)</strong>. Beyond coding, I also
                mastered{" "}
                <strong>
                  VPS & shared hosting, CI/CD pipelines, and deployment
                  automation
                </strong>
                , ensuring that projects I deliver are production-ready and
                scalable from day one.
              </p>
              <p>
                To keep sharpening my skills, I completed several certifications
                through
                <strong> Alison</strong>, covering everything from advanced
                software engineering concepts to DevOps practices. This helped
                me bridge the gap between theory and real-world problem solving.
              </p>
              <p>
                Today, I help businesses, startups, and individuals transform
                their ideas into digital products that users love. And when I’m
                not building tech, I recharge by hiking, exploring different
                cultures, or reading about future technologies that inspire my
                next big idea.
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-4 sm:flex-row">
              <Link href="/contact">
                <Button size="lg" className="gap-1">
                  Contact Me <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                <Download className="mr-2 h-4 w-4" /> Download Resume
              </Button>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="mb-20">
          <div className="mb-10 text-center" data-aos="fade-up">
            <h2 className="text-3xl font-bold">My Journey</h2>
            <p className="mt-2 text-muted-foreground">
              From learning to leading
            </p>
          </div>

          <div className="space-y-8">
            {/* Current Work */}
            <div
              className="relative pl-8 before:absolute before:left-0 before:top-0 before:h-full before:w-[2px] before:bg-muted md:pl-12"
              data-aos="fade-up"
            >
              <div className="absolute left-[-8px] top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary md:left-[-10px]">
                <Briefcase className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Badge variant="outline" className="mb-2">
                    2026 - Present
                  </Badge>
                  <h3 className="text-xl font-bold">
                    CTO (Chief Technology Officer) in iNkodeInc
                  </h3>
                  <p className="text-muted-foreground">Kigali, Rwanda</p>
                  <p>
                    Building and launching full-stack web platforms, mobile
                    applications, and backend APIs for startups and businesses
                    across industries. Responsibilities include system design,
                    DevOps (VPS hosting, CI/CD), and client consulting to ensure
                    every project is built for growth.
                  </p>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline" className="mb-2">
                    2026 - 2023
                  </Badge>
                  <h3 className="text-xl font-bold">
                    Freelance Full-Stack Developer
                  </h3>
                  <p className="text-muted-foreground">Remote</p>
                  <p>
                    Delivered custom websites and mobile applications to small
                    businesses, NGOs, and personal brands. Projects ranged from
                    booking systems and e-commerce platforms to portfolio
                    websites — each optimized for performance and user
                    experience.
                  </p>
                </div>
              </div>
            </div>

            {/* Education */}
            <div
              className="relative pl-8 before:absolute before:left-0 before:top-0 before:h-full before:w-[2px] before:bg-muted md:pl-12"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="absolute left-[-8px] top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary md:left-[-10px]">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Badge variant="outline" className="mb-2">
                    2023 - 2022
                  </Badge>
                  <h3 className="text-xl font-bold">
                    Software Development Certifications
                  </h3>
                  <p className="text-muted-foreground">TechRise ,Natcom</p>
                  <p>
                    Completed certifications in Web Development, Mobile App
                    Development, Python Programming, and DevOps. Focused on
                    applying modern practices like Agile, CI/CD, and scalable
                    architectures in real-world projects.
                  </p>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline" className="mb-2">
                    2023 - 2022
                  </Badge>
                  <h3 className="text-xl font-bold">Software development</h3>
                  <p className="text-muted-foreground">
                    KIGALI LEADING TSS
                  </p>
                  <p>
                    Specialized in software  and web technologies.
                    Thesis focused on building scalable, high-performance web
                    architectures.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hobbies & Interests */}
        <section className="mb-20">
          <div className="mb-10 text-center" data-aos="fade-up">
            <h2 className="text-3xl font-bold">Hobbies & Interests</h2>
            <p className="mt-2 text-muted-foreground">
              What I enjoy outside of coding
            </p>
          </div>

          <div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {[
              {
                title: "Photography",
                description: "Capturing moments and landscapes",
              },
              {
                title: "Hiking",
                description: "Exploring nature trails and mountains",
              },
              {
                title: "Reading",
                description: "Science fiction and technology books",
              },
              {
                title: "Cooking",
                description: "Experimenting with international cuisines",
              },
              {
                title: "Chess",
                description: "Strategic thinking and competitions",
              },
              {
                title: "Travel",
                description: "Experiencing different cultures",
              },
            ].map((hobby, index) => (
              <Card key={index}>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <Heart className="mb-4 h-8 w-8 text-primary" />
                  <h3 className="text-xl font-bold">{hobby.title}</h3>
                  <p className="text-muted-foreground">{hobby.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="rounded-2xl bg-muted p-8 text-center md:p-12"
          data-aos="fade-up"
        >
          <div className="mx-auto max-w-2xl space-y-4">
            <h2 className="text-3xl font-bold">
              Let’s Build Something That Works
            </h2>
            <p className="text-muted-foreground">
              Whether you need a high-performing website, a mobile app, or a
              full-stack platform with reliable hosting and automation — I bring
              both the technical expertise and real-world experience to make it
              happen.
            </p>
            <p className="text-muted-foreground">
              Let’s talk about your project and how we can turn your ideas into
              a solution that delivers results for your business.
            </p>
            <Link href="/contact">
              <Button size="lg" className="mt-2">
                Start Your Project <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
