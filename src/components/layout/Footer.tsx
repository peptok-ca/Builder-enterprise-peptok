import { Link } from "react-router-dom";
import Logo from "@/components/ui/logo";

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/">
              <Logo size="md" />
            </Link>
            <p className="text-sm text-muted-foreground">
              Connecting enterprises with retired experts for meaningful
              mentorship and growth.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/coaches" className="hover:text-primary">
                  Coach Directory
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-primary">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/metrics" className="hover:text-primary">
                  Analytics
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-primary">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/about" className="hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-primary">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-primary">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/help" className="hover:text-primary">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/security" className="hover:text-primary">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Peptok. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
