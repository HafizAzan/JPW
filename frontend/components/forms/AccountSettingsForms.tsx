"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Cpu, LockKeyhole, Mail, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { OtpForm } from "@/components/forms/OtpForm";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import { aiService } from "@/services/ai.service";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { ApiError } from "@/lib/api";
import { titleCase } from "@/lib/format";
import type { OtpChallenge } from "@/types";

export function AccountSettingsForms() {
  const router = useRouter();
  const { user, setUser, logout } = useAuth();
  const { push } = useToast();

  const [email, setEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailChallenge, setEmailChallenge] = useState<OtpChallenge | null>(null);

  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNext] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordChallenge, setPasswordChallenge] = useState<OtpChallenge | null>(null);

  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteChallenge, setDeleteChallenge] = useState<OtpChallenge | null>(null);

  const [ollamaUrl, setOllamaUrl] = useState(user?.ollamaBaseUrl || "http://127.0.0.1:11434");
  const [ollamaModel, setOllamaModel] = useState(user?.ollamaModel || "");
  const [aiSaving, setAiSaving] = useState(false);
  const [aiTesting, setAiTesting] = useState(false);

  useEffect(() => {
    if (!user) return;
    setOllamaUrl(user.ollamaBaseUrl || "http://127.0.0.1:11434");
    setOllamaModel(user.ollamaModel || "");
  }, [user?._id, user?.ollamaBaseUrl, user?.ollamaModel]);

  return (
    <div className="grid gap-4 lg:gap-6">
      <Card className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center">
        <Avatar name={user?.name} src={user?.avatar?.url} size="lg" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-2xl tracking-tight">{user?.name}</h2>
            <Badge tone="copper">{titleCase(user?.role)}</Badge>
            <StatusBadge value={user?.status} />
          </div>
          <p className="mt-1 truncate text-sm text-muted-foreground">{user?.email}</p>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Email, password, and account deletion all need a verification code before they take effect.
          </p>
        </div>
      </Card>

      <div className="grid items-stretch gap-4 md:grid-cols-2 lg:gap-6">
        <Card className="flex h-full flex-col">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
              <Mail size={18} />
            </span>
            <div>
              <h2 className="font-display text-2xl leading-tight">Change email</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                We’ll send a code to the new address. Your login email updates only after you verify it.
              </p>
            </div>
          </div>
          {emailChallenge ? (
            <div className="mt-6">
              <OtpForm
                email={emailChallenge.email}
                purpose="change-email"
                initialOtp={emailChallenge.otp}
                onCancel={() => setEmailChallenge(null)}
                onVerified={({ user: next }) => {
                  if (next) setUser(next);
                  setEmail("");
                  setEmailPassword("");
                  setEmailChallenge(null);
                  push("Email updated");
                }}
              />
            </div>
          ) : (
            <form
              className="mt-6 flex flex-1 flex-col gap-4"
              onSubmit={async (e) => {
                e.preventDefault();
                setEmailLoading(true);
                try {
                  const res = await authService.changeEmail({ email, currentPassword: emailPassword });
                  setEmailChallenge(res.data);
                  push("Check your new email for a verification code");
                } catch (error) {
                  push(error instanceof ApiError ? error.message : "Could not update email", "danger");
                } finally {
                  setEmailLoading(false);
                }
              }}
            >
              <div className="grid gap-4">
                <Input
                  label="New email"
                  type="email"
                  placeholder={user?.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <PasswordInput
                  label="Current password"
                  value={emailPassword}
                  onChange={(e) => setEmailPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mt-auto pt-2">
                <Button className="w-full sm:w-auto" loading={emailLoading}>
                  Send code
                </Button>
              </div>
            </form>
          )}
        </Card>

        <Card className="flex h-full flex-col">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-secondary/15 text-secondary">
              <LockKeyhole size={18} />
            </span>
            <div>
              <h2 className="font-display text-2xl leading-tight">Change password</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Use at least 8 characters. We’ll send a code to your current email before the password changes.
              </p>
            </div>
          </div>
          {passwordChallenge ? (
            <div className="mt-6">
              <OtpForm
                email={passwordChallenge.email}
                purpose="change-password"
                initialOtp={passwordChallenge.otp}
                onCancel={() => setPasswordChallenge(null)}
                onVerified={() => {
                  setCurrent("");
                  setNext("");
                  setPasswordChallenge(null);
                  push("Password updated");
                }}
              />
            </div>
          ) : (
            <form
              className="mt-6 flex flex-1 flex-col gap-4"
              onSubmit={async (e) => {
                e.preventDefault();
                setPasswordLoading(true);
                try {
                  const res = await authService.changePassword({ currentPassword, newPassword });
                  setPasswordChallenge(res.data);
                  push("Check your email for a verification code");
                } catch (error) {
                  push(error instanceof ApiError ? error.message : "Could not update password", "danger");
                } finally {
                  setPasswordLoading(false);
                }
              }}
            >
              <div className="grid gap-4">
                <PasswordInput
                  label="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrent(e.target.value)}
                  required
                />
                <PasswordInput
                  label="New password"
                  hint="At least 8 characters."
                  value={newPassword}
                  onChange={(e) => setNext(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              <div className="mt-auto pt-2">
                <Button className="w-full sm:w-auto" loading={passwordLoading}>
                  Send code
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>

      <Card>
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
            <Cpu size={18} />
          </span>
          <div>
            <h2 className="font-display text-2xl leading-tight">Local Ollama</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Save your machine’s Ollama URL and model. The live site talks to it from your browser, so localhost works on your computer.
            </p>
          </div>
        </div>
        <form
          className="mt-6 grid max-w-xl gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setAiSaving(true);
            try {
              const res = await userService.updateAiSettings({
                ollamaBaseUrl: ollamaUrl.trim(),
                ollamaModel: ollamaModel.trim(),
              });
              setUser(res.data);
              setOllamaUrl(res.data.ollamaBaseUrl || "");
              setOllamaModel(res.data.ollamaModel || "");
              push(res.data.ollamaBaseUrl ? "Ollama settings saved" : "Local Ollama disconnected");
            } catch (error) {
              push(error instanceof ApiError ? error.message : "Could not save AI settings", "danger");
            } finally {
              setAiSaving(false);
            }
          }}
        >
          <Input
            label="Ollama URL"
            placeholder="http://127.0.0.1:11434"
            value={ollamaUrl}
            onChange={(e) => setOllamaUrl(e.target.value)}
            hint="Use 127.0.0.1 instead of localhost on Windows. Ollama must be running (`ollama serve`)."
          />
          <Input
            label="Model"
            placeholder="qwen3:4b"
            value={ollamaModel}
            onChange={(e) => setOllamaModel(e.target.value)}
            hint="Must already be pulled in Ollama, e.g. qwen3:4b or llama3.2"
          />
          <div className="flex flex-wrap gap-2">
            <Button type="submit" loading={aiSaving}>
              Save
            </Button>
            <Button
              type="button"
              variant="outline"
              loading={aiTesting}
              onClick={async () => {
                setAiTesting(true);
                try {
                  const url = ollamaUrl.trim() || "http://127.0.0.1:11434";
                  const res = await aiService.probeOllama(url);
                  const models = res.data.models ?? [];
                  const found =
                    ollamaModel &&
                    models.some((name) => name === ollamaModel || name.startsWith(`${ollamaModel}:`));
                  if (ollamaModel && models.length && !found) {
                    push(`Connected, but “${ollamaModel}” is not pulled. Available: ${models.slice(0, 6).join(", ")}`, "danger");
                  } else {
                    push(models.length ? `Connected. Models: ${models.slice(0, 6).join(", ")}` : "Connected to Ollama");
                  }
                } catch (error) {
                  push(
                    error instanceof ApiError
                      ? error.message
                      : "Ollama is not running at this URL. Start it with `ollama serve`, then test again.",
                    "danger"
                  );
                } finally {
                  setAiTesting(false);
                }
              }}
            >
              Test connection
            </Button>
          </div>
        </form>
      </Card>

      <Card className="border-danger/25">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-danger/10 text-danger">
            <Trash2 size={18} />
          </span>
          <div>
            <h2 className="font-display text-2xl leading-tight">Delete account</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              This removes your profile, applications, saved jobs, and any companies or jobs you own. It cannot be undone.
            </p>
          </div>
        </div>
        {deleteChallenge ? (
          <div className="mt-6 max-w-md">
            <OtpForm
              email={deleteChallenge.email}
              purpose="delete-account"
              initialOtp={deleteChallenge.otp}
              submitLabel="Delete account"
              variant="danger"
              onCancel={() => setDeleteChallenge(null)}
              onVerified={async ({ deleted }) => {
                if (!deleted) return;
                try {
                  await logout();
                } catch {
                  setUser(null);
                }
                push("Your account has been deleted");
                router.push("/");
              }}
            />
          </div>
        ) : (
          <form
            className="mt-6 grid max-w-md gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setDeleteLoading(true);
              try {
                const res = await authService.requestDeleteAccount({ currentPassword: deletePassword });
                setDeleteChallenge(res.data);
                push("Check your email for a verification code");
              } catch (error) {
                push(error instanceof ApiError ? error.message : "Could not start account deletion", "danger");
              } finally {
                setDeleteLoading(false);
              }
            }}
          >
            <PasswordInput
              label="Current password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              required
            />
            <Button variant="danger" className="w-full sm:w-auto" loading={deleteLoading}>
              Send delete code
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
