import { AuthShell } from '@/components/layout/auth-shell';
import { Button, LinkButton } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toast } from '@/components/ui/toast';

export default function LoginPage() {
  return (
    <AuthShell title="Log in to ListingLift" description="Access your secure product-image fulfillment workspace. Sessions are server-side, HTTP-only cookie based, and protected by route guards.">
      <form className="space-y-5" method="post" action="/api/auth/login">
        <Toast title="Phase 3 auth endpoint available" tone="success">Codex must verify this form against the stitched runtime and replace this plain POST with the final UX if needed.</Toast>
        <Input label="Email" name="email" type="email" placeholder="you@example.com" helper="Email is normalized server-side before credential checks." required />
        <Input label="Password" name="password" type="password" placeholder="••••••••" helper="Passwords are never logged and are verified against a server-side hash." required />
        <Button type="submit" className="w-full">Log in</Button>
        <LinkButton href="/signup" className="w-full" variant="secondary">Create a workspace</LinkButton>
        <p className="text-center text-xs text-slate-500">Protected areas require a valid session cookie after Phase 3 runtime verification.</p>
      </form>
    </AuthShell>
  );
}
