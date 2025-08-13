import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Stepper,
  Step,
  StepLabel,
  StepIcon,
  Container,
  Paper,
  InputAdornment,
  Grid,
  Chip,
} from "@mui/material";
import {
  Info,
  LocationOn,
  Image,
  AttachMoney,
  CalendarToday,
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface TaskForm {
  title: string;
  urgent: boolean;
  date: Date | null;
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
  { key: "location", label: "Location", icon: LocationOn },
  { key: "more", label: "More Details", icon: Image },
  { key: "budget", label: "Budget", icon: AttachMoney },
];

const CustomStepIcon = ({ active, completed, icon }: any) => {
  const IconComponent = steps[icon - 1]?.icon || Info;
  
  return (
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: active ? 'primary.main' : completed ? 'warning.main' : 'grey.300',
        color: active || completed ? 'white' : 'grey.600',
        transition: 'all 200ms ease',
      }}
    >
      <IconComponent sx={{ fontSize: 18 }} />
    </Box>
  );
};

const PostTask = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState<TaskForm>({
    title: "",
    urgent: false,
    date: null,
    remote: false,
    locationText: "",
    coords: null,
    details: "",
    images: [],
    budgetType: "open",
    amount: undefined,
  });

  const isValid = useMemo(() => {
    if (activeStep === 0) return form.title.trim().length > 3 && (!!form.date || form.urgent);
    if (activeStep === 1) return form.remote || !!form.locationText || !!form.coords;
    if (activeStep === 2) return form.details.trim().length > 5 || form.images.length > 0;
    if (activeStep === 3) return form.budgetType === "open" || (!!form.amount && form.amount > 0);
    return false;
  }, [activeStep, form]);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    alert("Task submitted! We'll notify nearby Taskers. You can negotiate the final price.");
    navigate("/");
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setForm({ ...form, images: files });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Helmet>
          <title>Post a Task | Get offers from local Taskers</title>
          <meta name="description" content="Post a task: describe the job, pick location, add details and set your budget to get offers from skilled Taskers nearby." />
          <link rel="canonical" href={typeof window !== "undefined" ? window.location.href : "/post-task"} />
        </Helmet>

        <Container maxWidth="md">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h1" component="h1" gutterBottom>
              Post a task
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Tell us what you need done and get offers from skilled Taskers in your area.
            </Typography>
          </Box>

          <Card sx={{ p: 3 }}>
            <CardContent>
              <Typography variant="h2" component="h2" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                {(() => {
                  const IconComponent = steps[activeStep].icon;
                  return <IconComponent color="action" />;
                })()}
                {steps[activeStep].label}
              </Typography>

              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((step, index) => (
                  <Step key={step.key}>
                    <StepLabel StepIconComponent={CustomStepIcon}>
                      {step.label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Step Content */}
              <Box sx={{ mb: 4 }}>
                {activeStep === 0 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                      fullWidth
                      label="Task title"
                      placeholder="What do you need done?"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      variant="outlined"
                    />

                    <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                      <Box sx={{ flex: 1 }}>
                        <DatePicker
                          label="When do you need this done?"
                          value={form.date}
                          onChange={(date) => setForm({ ...form, date })}
                          slots={{
                            textField: TextField,
                          }}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              InputProps: {
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <CalendarToday />
                                  </InputAdornment>
                                ),
                              },
                            },
                          }}
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Paper sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={form.urgent}
                                onChange={(e) => setForm({ ...form, urgent: e.target.checked })}
                                color="warning"
                              />
                            }
                            label={
                              <Box>
                                <Typography variant="body2" fontWeight={500}>
                                  This is urgent
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Prioritize faster responses
                                </Typography>
                              </Box>
                            }
                          />
                        </Paper>
                      </Box>
                    </Box>
                  </Box>
                )}

                {activeStep === 1 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Paper sx={{ p: 2 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={form.remote}
                            onChange={(e) => setForm({ ...form, remote: e.target.checked })}
                            color="primary"
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              This can be done remotely
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Taskers can help you online
                            </Typography>
                          </Box>
                        }
                      />
                    </Paper>

                    {!form.remote && (
                      <TextField
                        fullWidth
                        label="Where do you need this done?"
                        placeholder="Enter an address or area"
                        value={form.locationText}
                        onChange={(e) => setForm({ ...form, locationText: e.target.value })}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOn />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  </Box>
                )}

                {activeStep === 2 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Provide more details"
                      placeholder="What are the details?"
                      value={form.details}
                      onChange={(e) => setForm({ ...form, details: e.target.value })}
                    />

                    <Box>
                      <Typography variant="body2" fontWeight={500} gutterBottom>
                        Add images (optional)
                      </Typography>
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<Image />}
                        sx={{ mb: 2 }}
                      >
                        Upload Images
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          hidden
                          onChange={handleImageUpload}
                        />
                      </Button>
                      
                      {form.images.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {form.images.map((file, idx) => (
                            <Chip
                              key={idx}
                              label={file.name}
                              variant="outlined"
                              onDelete={() => {
                                const newImages = form.images.filter((_, i) => i !== idx);
                                setForm({ ...form, images: newImages });
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}

                {activeStep === 3 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Budget Type</FormLabel>
                      <RadioGroup
                        value={form.budgetType}
                        onChange={(e) => setForm({ ...form, budgetType: e.target.value as "fixed" | "open" })}
                      >
                        <Paper sx={{ p: 2, mb: 1 }}>
                          <FormControlLabel
                            value="open"
                            control={<Radio />}
                            label="Open for offers"
                          />
                        </Paper>
                        <Paper sx={{ p: 2 }}>
                          <FormControlLabel
                            value="fixed"
                            control={<Radio />}
                            label="Fixed price"
                          />
                        </Paper>
                      </RadioGroup>
                    </FormControl>

                    {form.budgetType === "fixed" && (
                      <TextField
                        label="What is your budget?"
                        type="number"
                        placeholder="Enter amount"
                        value={form.amount || ""}
                        onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AttachMoney />
                            </InputAdornment>
                          ),
                        }}
                        helperText="You can always negotiate the final price."
                      />
                    )}
                  </Box>
                )}
              </Box>

              {/* Navigation */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  startIcon={<ArrowBack />}
                  variant="outlined"
                >
                  Back
                </Button>

                {activeStep < steps.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    disabled={!isValid}
                    endIcon={<ArrowForward />}
                    variant="contained"
                    size="large"
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!isValid}
                    variant="contained"
                    size="large"
                    color="warning"
                  >
                    Submit task
                  </Button>
                )}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => navigate("/")}
                  color="inherit"
                >
                  Cancel
                </Button>
                <Typography variant="caption" color="text.secondary">
                  Step {activeStep + 1} of {steps.length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </LocalizationProvider>
  );
};

export default PostTask;