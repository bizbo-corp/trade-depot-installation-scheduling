import { Separator } from "@/components/ui/separator"
import { Logotype } from "@/components/site-parts/logotype"

export interface FooterLink {
  name: string
  href: string
}

export interface FooterProps {
  links?: FooterLink[]
  copyright?: string
  privacyPolicyHref?: string
}

export const Footer = ({ 
  links = [
    { name: "Home", href: "/" },
    { name: "Consultancy workshops", href: "/design-thinker-workshops" },
    { name: "UX Design", href: "/ux-design" },
    { name: "Development", href: "/development" },
    { name: "Automation", href: "/automation" },
    { name: "Contact", href: "/contact" },
    // { name: "Colour modes", href: "/color-modes" },
    // { name: "Shopify", href: "#" },
    // { name: "Purpose Framework", href: "/purpose-framework" },
    // { name: "Icon Showcase", href: "/icon-showcase" },
  ],
  copyright = "Copyright © bizbo.co.nz",
  privacyPolicyHref = "#"
}: FooterProps) => {
  return (
    <footer className="bg-background py-12 md:py-24">
      <div className="container mx-auto flex flex-col gap-12 px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12">
            <Logotype />
            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
              {links.map((link) => (
                <a key={link.name} href={link.href} className="hover:text-foreground">
                  {link.name}
                </a>
              ))}
            </nav>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col-reverse items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <p>{copyright}</p>
          <a href={privacyPolicyHref} className="hover:text-foreground">Privacy Policy</a>
        </div>
      </div>
    </footer>
  )
}

