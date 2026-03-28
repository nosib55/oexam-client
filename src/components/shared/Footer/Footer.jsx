import Link from 'next/link';
import Logo from '../Logo/Logo';


const Footer = () => {
  return (
    <footer className="bg-[#f8fafc] border-t border-base-150 pt-16 pb-8">
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-10 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & About */}
          <div className="space-y-6">
            <Logo />
            <p className="text-base-content/70 leading-relaxed max-w-xs">
              Empowering learners worldwide with a secure, smart, and efficient
              online examination ecosystem. Join the future of education.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {[
                {
                  src: 'https://i.ibb.co.com/2Y3TZf9V/icons8-facebook-logo-50.png',
                  label: 'Facebook',
                },
                {
                  src: 'https://i.ibb.co.com/ymQnmB7d/icons8-instagram-logo-50.png',
                  label: 'Instagram',
                },
                {
                  src: 'https://i.ibb.co.com/4Z8dRSc4/icons8-x-logo-50.png',
                  label: 'X',
                },
                {
                  src: 'https://i.ibb.co.com/dwxcgxvr/icons8-youtube-50.png',
                  label: 'Youtube',
                },
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center group hover:bg-primary transition-all duration-500 shadow-sm hover:shadow-primary/40 hover:-translate-y-1"
                >
                  <img
                    src={social.src}
                    alt={social.label}
                    className="w-6 h-6 object-contain group-hover:brightness-0 group-hover:invert transition-all duration-500"
                  />
                  <span className="sr-only">{social.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-6 text-primary">
              Explore
            </h4>
            <ul className="space-y-4 font-bold text-base-content/60">
              <li>
                <Link
                  href="/exams"
                  className="hover:text-primary transition-colors"
                >
                  Browse Exams
                </Link>
              </li>
              <li>
                <Link
                  href="/results"
                  className="hover:text-primary transition-colors"
                >
                  Global Results
                </Link>
              </li>
              <li>
                <Link
                  href="/notice"
                  className="hover:text-primary transition-colors"
                >
                  Notice Board
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard"
                  className="hover:text-primary transition-colors"
                >
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Policies */}
          <div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-6 text-primary">
              Support
            </h4>
            <ul className="space-y-4 font-bold text-base-content/60">
              <li>
                <Link
                  href="/faq"
                  className="hover:text-primary transition-colors"
                >
                  Help Center / FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h4 className="font-black uppercase tracking-widest text-sm text-primary">
              Newsletter
            </h4>
            <p className="text-sm font-medium opacity-70">
              Get updates on new exams & features.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Email Address"
                className="input input-primary w-full rounded-2xl bg-base-100/50 focus:border-primary"
              />
              <button className="btn btn-primary btn-sm absolute right-1.5 top-2 rounded-xl px-4">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-base-150 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm font-bold opacity-40">
            ©{new Date().getFullYear()}{' '}
            <span className="text-primary">EXAMINERLY</span>. All rights
            reserved.
          </p>
          <div className="flex gap-6 text-xs font-black uppercase tracking-[0.2em] opacity-40">
            <span className="hover:opacity-100 cursor-pointer">Security</span>
            <span className="hover:opacity-100 cursor-pointer">Status</span>
            <span className="hover:opacity-100 cursor-pointer">Docs</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
