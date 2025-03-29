import React, { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  CircularProgress,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import InfoIcon from '@mui/icons-material/Info';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Manufacturing',
  'Retail',
  'Education',
  'Other',
];

const companySizes = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '501-1000 employees',
  '1000+ employees',
];

const regions = [
  'North America',
  'Europe',
  'Asia Pacific',
  'Latin America',
  'Middle East',
  'Africa',
];

interface RiskScore {
  score: number;
  explanation: string;
}

function App() {
  const [formData, setFormData] = useState({
    jobTitle: '',
    industry: '',
    companySize: '',
    region: '',
  });
  const [loading, setLoading] = useState(false);
  const [riskScore, setRiskScore] = useState<RiskScore | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockScore = Math.floor(Math.random() * 100);
      setRiskScore({
        score: mockScore,
        explanation: `Based on current market trends and industry analysis, this position shows a ${mockScore}% risk of displacement. Factors include automation potential, market demand, and technological advancements in the ${formData.industry} industry.`,
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
            Job Displacement Risk Analyzer
          </Typography>

          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Job Title"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                select
                label="Industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                margin="normal"
                required
              >
                {industries.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                select
                label="Company Size"
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
                margin="normal"
                required
              >
                {companySizes.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                select
                label="Region/Country"
                name="region"
                value={formData.region}
                onChange={handleChange}
                margin="normal"
                required
              >
                {regions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Analyze Risk'}
              </Button>
            </form>
          </Paper>

          {riskScore && (
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                Risk Analysis Results
              </Typography>
              
              <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
                <CircularProgress
                  variant="determinate"
                  value={riskScore.score}
                  size={120}
                  thickness={4}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h4" component="div" color="text.secondary">
                    {riskScore.score}%
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body1" paragraph>
                {riskScore.explanation}
              </Typography>

              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  mt: 3,
                  background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LockIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Unlock Full Insights</Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Get detailed analysis, future projections, and personalized recommendations
                  to mitigate displacement risks.
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<InfoIcon />}
                  sx={{ mt: 2 }}
                >
                  Upgrade to Premium
                </Button>
              </Paper>
            </Paper>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App; 