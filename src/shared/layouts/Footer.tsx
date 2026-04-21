import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t py-32 px-8 bg-background">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-20">
          {/* Brand Section */}
          <div className="md:col-span-6 space-y-8">
            <Link to="/" className="flex items-center group w-fit">
              <div className="flex items-center justify-center size-24 overflow-hidden">
                <img
                  src="/juralogo.png"
                  alt="Logo"
                  className="size-full object-contain dark:invert"
                />
              </div>
              <h2 className="text-6xl font-black italic uppercase tracking-tighter -ml-10">
                Juratifact
              </h2>
            </Link>
            <p className="max-w-sm text-lg text-muted-foreground font-medium">
              The ultimate destination for premium secondhand. Quality over
              quantity, always.
            </p>
          </div>

          {/* Links Section */}
          <div className="md:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-6">
              <p className="text-xs font-black uppercase tracking-widest">
                Connect
              </p>
              <ul className="text-sm font-bold text-muted-foreground space-y-4 uppercase tracking-tighter">
                <li className="hover:text-primary cursor-pointer transition-colors">
                  Instagram
                </li>
                <li className="hover:text-primary cursor-pointer transition-colors">
                  Twitter
                </li>
                <li className="hover:text-primary cursor-pointer transition-colors">
                  Discord
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <p className="text-xs font-black uppercase tracking-widest">
                Support
              </p>
              <ul className="text-sm font-bold text-muted-foreground space-y-4 uppercase tracking-tighter">
                <li className="hover:text-primary cursor-pointer transition-colors">
                  Shipping
                </li>
                <li className="hover:text-primary cursor-pointer transition-colors">
                  Authenticity
                </li>
                <li className="hover:text-primary cursor-pointer transition-colors">
                  Returns
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-32 pt-8 border-t flex flex-col md:flex-row justify-between gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
          <p>© 2026 Juratifact. Built for the modern collector.</p>
          <div className="flex gap-8">
            <span className="hover:text-primary cursor-pointer transition-colors">
              Privacy
            </span>
            <span className="hover:text-primary cursor-pointer transition-colors">
              Terms
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
