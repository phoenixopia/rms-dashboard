"use client";
import React, { useState, useEffect, useRef } from "react";

import Image from "next/image";
import logos from "../../../public/logos.png";
import HatSvg from "./HatSvg";
import { useAuth } from "@/lib/auth";
import { Link, useRouter } from "@/i18n/navigation";
import { List } from "lucide-react";
const sections = [
  "home",
  "services",
  "partner",
  "pricing",
  "contact-us",
] as const;
type Section = (typeof sections)[number];

const sectionLabels: Record<Section, string> = {
  home: "HOME",
  services: "SERVICES",
  partner: "PARTNER",
  pricing: "PRICING",
  "contact-us": "Contact Us",
};
const Header = () => {
  const [top, setTop] = useState(true);
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [carX, setCarX] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLUListElement>(null);
  const { user } = useAuth();

  const router = useRouter();
  const updateCarPosition = (section: Section | null) => {
    if (!navRef.current || !section) return;

    requestAnimationFrame(() => {
      const buttons = Array.from(
        navRef.current!.querySelectorAll<HTMLButtonElement>(
          "button[data-section]",
        ),
      );
      const targetButton = buttons.find(
        (btn) => btn.dataset.section === section,
      );

      if (targetButton && navRef.current) {
        const buttonRect = targetButton.getBoundingClientRect();
        const navRect = navRef.current.getBoundingClientRect();
        const centerX = buttonRect.left - navRect.left + buttonRect.width / 2;
        setCarX(centerX);
      }
    });
  };

  const handleLoginClick = () => {
    router.push("/login");
  };
  const handleScroll = () => {
    const scrollY = window.scrollY;
    setTop(scrollY <= 10);

    if (scrollY <= 10) {
      setActiveSection("home");
      updateCarPosition("home");
      return;
    }

    let current: Section = "home";
    for (const section of sections) {
      const el = document.getElementById(section);
      if (el) {
        const offsetTop = el.offsetTop - 100;
        if (scrollY >= offsetTop) {
          current = section;
        }
      }
    }

    if (current !== activeSection) {
      setActiveSection(current);
      updateCarPosition(current);
    }
  };

  useEffect(() => {
    updateCarPosition("home");
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    updateCarPosition(activeSection);
  }, [activeSection]);

  const scrollToSection = (section: Section, e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById(section);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      setActiveSection(section);
      setTimeout(() => updateCarPosition(section), 600);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed z-30 w-full transition duration-300 ease-in-out ${
        top ? "bg-white" : "bg-white shadow-lg backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center" aria-label="Cruip">
            <Image src={logos} alt="logo" className="h-10 w-10" />
          </Link>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="text-gray-700 hover:text-[#00ACA4] focus:outline-none"
            >
              {mobileMenuOpen ? "X" : <List className="h-4 w-4" />}
            </button>
          </div>

          <nav className="hidden flex-grow items-center justify-end md:flex">
            <ul ref={navRef} className="relative flex items-center space-x-16">
              {sections.map((section) => (
                <li key={section}>
                  <button
                    data-section={section}
                    onClick={(e) => scrollToSection(section, e)}
                    className={`relative text-[0.9rem] font-semibold whitespace-nowrap transition-colors ${
                      activeSection === section
                        ? "text-[#FF7632]"
                        : "text-[#3B3A3A] hover:text-[#ed996f]"
                    }`}
                  >
                    {sectionLabels[section]}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  className="ml-4 cursor-pointer rounded-lg bg-[#FF7632] px-5 py-2.5 text-sm text-white"
                >
                  <Link href="/login">Get Started</Link>
                </button>
              </li>

              <div
                className="absolute bottom-[-5px] left-[-5px] transition-all duration-500 ease-in-out"
                style={{ transform: `translateX(${carX}px)` }}
              >
                <HatSvg />
              </div>
            </ul>
          </nav>
        </div>

        {mobileMenuOpen && (
          <div className="mt-2 md:hidden">
            <ul className="flex flex-col gap-3 rounded-lg bg-white px-4 py-4 shadow-md">
              {sections.map((section) => (
                <li key={section}>
                  <button
                    onClick={(e) => scrollToSection(section, e)}
                    className={`block w-full text-left text-sm font-medium ${
                      activeSection === section
                        ? "text-[#00ACA4]"
                        : "text-[#555] hover:text-[#00ACA4]"
                    }`}
                  >
                    {sectionLabels[section]}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  className="w-full rounded-lg bg-[#FF7632] px-5 py-2.5 text-sm text-white"
                >
                  <Link href="/login">Get Started</Link>
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
