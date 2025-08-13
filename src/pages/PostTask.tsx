import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar as CalendarIcon, MapPin, FileImage, DollarSign, Info } from "lucide-react";
import { format } from "date-fns";
import MapboxSelector from "@/components/map/MapboxSelector";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface TaskForm {
  title: string;
  urgent: boolean;
  date: Date | undefined;
  remote: boolean;
  locationText: string;
  coords: { lng: number; lat: number } | null;
  details: string;
  images: File[];
  budgetType: "fixed" | "open";
  amount?: number;
}

const steps = [
  { key: "details", label: "Task Details", icon: Info },
  { key: "location", label: "Location", icon: MapPin },
  { key: "more", label: "More Details", icon: FileImage },
  { key: "budget", label: "Budget", icon: DollarSign },
] as const;

const Stepper = ({ current }: { current: number }) => {
  return (
    <div aria-label="Progress" className="mb-6 flex items-center">
      {steps.map((s, i) => {
        const Icon = s.icon;
        const active = i === current;
        const completed = i < current;
        return (
          <div key={s.key} className="flex items-center">
            <div
              className={[
                "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                active ? "bg-primary text-primary-foreground" : completed ? "bg-accent text-accent-foreground" : "bg-background text-muted-foreground",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
            </div>
            {i < steps.length - 1 && (
              <div className="mx-2 h-[2px] w-10 md:w-24 bg-border" aria-hidden />
            )}
          </div>
        );
      })}
    </div>
  );
};

const PostTask = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<TaskForm>({
    title: "",
    urgent: false,
    date: undefined,
    remote: false,
    locationText: "",
    coords: null,
    details: "",
    images: [],
    budgetType: "open",
    amount: undefined,
  });

  const isValid = useMemo(() => {
    if (step === 0) return form.title.trim().length > 3 && (!!form.date || form.urgent);
    if (step === 1) return form.remote || !!form.locationText || !!form.coords;
    if (step === 2) return form.details.trim().length > 5 || form.images.length > 0;
    if (step === 3) return form.budgetType === "open" || (!!form.amount && form.amount > 0);
    return false;
  }, [step, form]);

  useEffect(() => {
    document.documentElement.style.setProperty("scroll-behavior", "smooth");
    return () => {
      document.documentElement.style.removeProperty("scroll-behavior");
    };
  }, []);

  function next() {
    if (step < steps.length - 1) setStep((s) => s + 1);
  }
  function prev() {
    if (step > 0) setStep((s) => s - 1);
  }
  function submit() {
    toast({
      title: "Task submitted",
      description: "We’ll notify nearby Taskers. You can negotiate the final price.",
    });
  }

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>Post a Task | Get offers from local Taskers</title>
        <meta name="description" content="Post a task: describe the job, pick location, add details and set your budget to get offers from skilled Taskers nearby." />
        <link rel="canonical" href={typeof window !== "undefined" ? window.location.href : "/post-task"} />
      </Helmet>
      <section className="container mx-auto max-w-3xl px-4 gr-section">
        <header className="mb-6">
          <h1 className="mb-2 text-3xl font-bold tracking-tight">Post a task</h1>
          <p className="text-muted-foreground">Tell us what you need done and get offers from skilled Taskers in your area.</p>
        </header>

        <Card className="soft-card animate-enter">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              {(() => {
                const Icon = steps[step].icon;
                return <Icon className="h-5 w-5 text-muted-foreground" />;
              })()}
              <span>{steps[step].label}</span>
            </CardTitle>
            <Stepper current={step} />
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 0 && (
              <div className="space-y-5 animate-enter">
                <div className="space-y-2">
                  <Label htmlFor="title">Task title</Label>
                  <Input
                    id="title"
                    placeholder="What do you need done?"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date">When do you need this done?</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {form.date ? format(form.date, "PPP") : <span>Select a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={form.date}
                          onSelect={(d) => setForm({ ...form, date: d })}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex items-center justify-between rounded-md border p-4">
                    <div>
                      <Label htmlFor="urgent" className="mb-1 block">This is urgent</Label>
                      <p className="text-sm text-muted-foreground">Prioritize faster responses</p>
                    </div>
                    <Switch id="urgent" checked={form.urgent} onCheckedChange={(v) => setForm({ ...form, urgent: v })} />
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5 animate-enter">
                <div className="flex items-center justify-between rounded-md border p-4">
                  <div>
                    <Label htmlFor="remote" className="mb-1 block">This can be done remotely</Label>
                    <p className="text-sm text-muted-foreground">Taskers can help you online</p>
                  </div>
                  <Switch id="remote" checked={form.remote} onCheckedChange={(v) => setForm({ ...form, remote: v })} />
                </div>

                {!form.remote && (
                  <div className="space-y-2">
                    <Label htmlFor="locationText">Where do you need this done?</Label>
                    <Input
                      id="locationText"
                      placeholder="Enter an address or area"
                      value={form.locationText}
                      onChange={(e) => setForm({ ...form, locationText: e.target.value })}
                    />
                    <div className="mt-2">
                      <MapboxSelector
                        onChange={(coords) => setForm({ ...form, coords })}
                      />
                      <p className="mt-2 text-xs text-muted-foreground">
                        Tip: Enter a Mapbox public token above to enable the map for selection.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5 animate-enter">
                <div className="space-y-2">
                  <Label htmlFor="details">Provide more details</Label>
                  <Textarea
                    id="details"
                    placeholder="What are the details?"
                    value={form.details}
                    onChange={(e) => setForm({ ...form, details: e.target.value })}
                    className="min-h-[8rem]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Add images (optional)</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setForm({ ...form, images: files });
                    }}
                  />
                  {form.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
                      {form.images.map((file, idx) => {
                        const url = URL.createObjectURL(file);
                        return (
                          <div key={idx} className="overflow-hidden rounded-md border">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt={`Task image ${idx + 1}`} className="h-24 w-full object-cover" />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5 animate-enter">
                <RadioGroup
                  value={form.budgetType}
                  onValueChange={(v) => setForm({ ...form, budgetType: v as "fixed" | "open" })}
                >
                  <div className="flex items-center space-x-2 rounded-md border p-4">
                    <RadioGroupItem value="open" id="open" />
                    <Label htmlFor="open">Open for offers</Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-4">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <Label htmlFor="fixed">Fixed price</Label>
                  </div>
                </RadioGroup>

                {form.budgetType === "fixed" && (
                  <div className="space-y-2">
                    <Label htmlFor="amount">What is your budget?</Label>
                    <div className="relative">
                      <Input
                        id="amount"
                        type="number"
                        min={1}
                        placeholder="Enter amount"
                        value={form.amount ?? ""}
                        onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                      />
                      <DollarSign className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">You can always negotiate the final price.</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <Button variant="ghost" onClick={prev} disabled={step === 0}>
                Back
              </Button>
              {step < steps.length - 1 ? (
                <Button variant="hero" className="hover-scale" onClick={next} disabled={!isValid}>
                  Continue
                </Button>
              ) : (
                <Button variant="hero" className="hover-scale" onClick={submit} disabled={!isValid}>
                  Submit task
                </Button>
              )}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <Link to="/">Cancel</Link>
              <span>Step {step + 1} of {steps.length}</span>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default PostTask;
