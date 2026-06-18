import { AuthShell } from '@/components/layout/auth-shell';
import { Button, LinkButton } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toast } from '@/components/ui/toast';

export default function SignupPage() {
  return (
    <AuthShell title="Create a ListingLift workspace" description="Create the owner account and initial organization used for client intake, upload, review, delivery, and billing workflows.">
      <form className="space-y-5" method="post" action="/api/auth/signup">
        <Toast title="Workspace signup scaffolded" tone="success">Signup creates a user, organization, client-owner membership, and server-side session when verified by Codex in the real repo.</Toast>
        <Input label="Your name" name="name" placeholder="Dom" required />
        <Input label="Work email" name="email" type="email" placeholder="founder@example.com" required />
        <Input label="Business or agency name" name="organizationName" placeholder="ACME Store" required />
        <Input label="Password" name="password" type="password" placeholder="At least 8 characters" helper="Use at least one letter and one number." required />
        <Button type="submit" className="w-full">Create workspace</Button>
        <LinkButton href="/login" className="w-full" variant="secondary">Already have an account?</LinkButton>
      </form>
    </AuthShell>
  );
}
