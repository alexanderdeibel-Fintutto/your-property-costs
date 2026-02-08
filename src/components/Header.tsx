import { Moon, Sun, LogIn, LogOut, Calculator, FolderOpen, CreditCard, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { createPortalSession } from '@/lib/stripe';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';
import heroGradient from '@/assets/hero-gradient.png';

interface HeaderProps {
  onLoginClick: () => void;
}

export const Header = ({ onLoginClick }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const { subscription, plan } = useSubscription();
  const { toast } = useToast();
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const handleManageSubscription = async () => {
    const result = await createPortalSession(window.location.href);
    if ('error' in result) {
      toast({
        title: 'Fehler',
        description: result.error,
        variant: 'destructive'
      });
      return;
    }
    window.location.href = result.url;
  };

  return (
    <header className="sticky top-0 z-50 w-full overflow-hidden relative">
      <img src={heroGradient} alt="" className="absolute inset-0 w-full h-full object-cover" aria-hidden="true" />
      <div className="container relative z-10 flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white">Fintutto</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-white ${
                  location.pathname === '/' || location.pathname === '/kaufnebenkosten' ? 'text-white' : 'text-white/70'
                }`}
              >
                <Calculator className="h-4 w-4" />
                Rechner
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <Link to="/" className="flex items-center gap-2">
                  📈 Rendite-Rechner
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/kaufnebenkosten" className="flex items-center gap-2">
                  🏠 Kaufnebenkosten-Rechner
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {user && (
            <Link
              to="/berechnungen"
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-white ${
                location.pathname === '/berechnungen' ? 'text-white' : 'text-white/70'
              }`}
            >
              <FolderOpen className="h-4 w-4" />
              Meine Berechnungen
            </Link>
          )}
          <Link
            to="/pricing"
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-white ${
              location.pathname === '/pricing' ? 'text-white' : 'text-white/70'
            }`}
          >
            <CreditCard className="h-4 w-4" />
            Preise
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="text-white hover:bg-white/20 hover:text-white">
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/20 hover:text-white">
                  <Settings className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline max-w-32 truncate">
                    {user.email}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                  Plan: {plan === 'business' ? 'Business' : plan === 'pro' ? 'Pro' : 'Free'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {subscription?.stripe_subscription_id && (
                  <DropdownMenuItem onClick={handleManageSubscription}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Abo verwalten
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link to="/pricing">
                    <CreditCard className="h-4 w-4 mr-2" />
                    {plan === 'free' ? 'Upgrade' : 'Pläne ansehen'}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Abmelden
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={onLoginClick} size="sm" className="bg-white/20 text-white border border-white/30 hover:bg-white/30">
              <LogIn className="h-4 w-4 mr-2" />
              Anmelden
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
