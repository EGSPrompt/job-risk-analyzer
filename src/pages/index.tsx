import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
  Paper,
  CircularProgress,
  FormHelperText,
  useTheme,
} from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';

type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

interface RiskAnalysis {
  riskScore: number;
  riskTier: 'Low' | 'Moderate' | 'High' | 'Critical';
  summary: string;
}

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.95) 100%)',
  color: 'white',
  padding: theme.spacing(12, 0),
  marginBottom: theme.spacing(8),
  position: 'relative',
  animation: 'fadeIn 1s ease-out',
  borderRadius: theme.spacing(2),
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, rgba(64, 224, 208, 0.1), rgba(66, 133, 244, 0.1))',
    borderRadius: theme.spacing(2),
    zIndex: 1,
  },
  '& > *': {
    position: 'relative',
    zIndex: 2,
  },
}));

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  maxWidth: 600,
  margin: '0 auto',
  borderRadius: theme.spacing(3),
  background: 'rgba(255, 255, 255, 0.02)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: 'white',
}));

const ResultCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  borderRadius: theme.spacing(3),
  background: '#ffffff',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: '#1a1a1a',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const RiskScore = styled(Box)(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  background: 'linear-gradient(135deg, #4285f4 0%, #34a853 100%)',
  color: 'white',
  fontSize: '2.5rem',
  fontWeight: 'bold',
  boxShadow: '0 4px 20px rgba(66, 133, 244, 0.3)',
}));

const PremiumSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  borderRadius: theme.spacing(3),
  background: 'linear-gradient(135deg, rgba(102, 51, 238, 0.25) 0%, rgba(66, 133, 244, 0.25) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(102, 51, 238, 0.25)',
  boxShadow: '0 4px 24px rgba(102, 51, 238, 0.15)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(2),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
      transition: 'all 0.3s ease',
    },
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 20px rgba(64, 224, 208, 0.15)',
      '& fieldset': {
        borderColor: 'rgba(64, 224, 208, 0.5)',
      },
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      '& fieldset': {
        borderColor: '#40E0D0',
      },
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    transition: 'all 0.3s ease',
    '&.Mui-focused': {
      color: '#40E0D0',
    },
    '&.Mui-required .MuiInputLabel-asterisk': {
      display: 'none',
    },
  },
  '& .MuiInputBase-input': {
    color: 'white',
  },
  '& .MuiMenuItem-root': {
    color: 'black',
  },
}));

const industries = [
  { label: "Financial Services", value: "Finance and Insurance" },
  { label: "Tech & Digital Services", value: "Information" },
  { label: "Professional Services", value: "Professional, Scientific, and Technical Services" },
  { label: "Healthcare", value: "Health Care and Social Assistance" },
  { label: "Education", value: "Educational Services" },
  { label: "Manufacturing", value: "Manufacturing" },
  { label: "Energy & Utilities", value: "Utilities" },
  { label: "Transportation & Logistics", value: "Transportation and Warehousing" },
  { label: "Retail & Consumer Goods", value: "Retail Trade" },
  { label: "Government & Public Sector", value: "Public Administration" },
  { label: "Real Estate & Construction", value: "Construction" },
  { label: "Hospitality & Food Services", value: "Accommodation and Food Services" },
  { label: "Other", value: "Other" }
];

const companySizes = [
  { label: "Small (1–1,000 employees)", value: "Small" },
  { label: "Medium (1,001–10,000 employees)", value: "Medium" },
  { label: "Large (10,000+ employees)", value: "Large" }
];

const regions = [
  'United States'
];

const StyledWEM = styled('div')(({ theme }) => ({
  fontSize: '6.5rem',
  '@media (max-width: 600px)': {
    fontSize: '4rem',
  },
  fontWeight: 900,
  fontFamily: theme.typography.h1.fontFamily,
  background: 'linear-gradient(135deg, #40E0D0 0%, #4285f4 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  position: 'relative',
  display: 'inline-block',
  letterSpacing: '0.02em',
  filter: 'drop-shadow(0 0 20px rgba(64, 224, 208, 0.25))',
  marginBottom: '0',
  lineHeight: 1,
  '&::before': {
    content: '"WEM"',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(45deg, rgba(64, 224, 208, 0.3) 0%, rgba(66, 133, 244, 0.3) 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    filter: 'blur(15px)',
    zIndex: -1,
  },
  '&::after': {
    content: '"WEM"',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(-45deg, #40E0D0 0%, transparent 70%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    filter: 'blur(8px)',
    zIndex: -1,
  },
}));

const theme = createTheme({
  typography: {
    fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h1: {
      fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontWeight: 900,
    },
    h3: {
      fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontWeight: 700,
    },
    h5: {
      fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontWeight: 500,
    },
  },
});

export default function Home() {
  const [formData, setFormData] = useState({
    jobTitle: '',
    ageRange: '',
    industry: '',
    companySize: '',
    region: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RiskAnalysis | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/analyze-risk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze risk');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error analyzing risk:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while analyzing risk');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        minHeight: '100vh',
        background: '#000',
        color: 'white',
        pt: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url(images/digital-arrows-background.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.8,
          filter: 'brightness(1.2) contrast(1.1)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0,0,20,0.65) 0%, rgba(0,10,60,0.75) 100%)',
        },
        '& > *': {
          position: 'relative',
          zIndex: 2,
        },
      }}>
        <Container maxWidth="lg">
          <HeroSection>
            <Container>
              <Box 
                sx={{ 
                  textAlign: 'center',
                  position: 'relative',
                  mb: 4,
                  animation: 'fadeInUp 1s ease-out 0.2s both',
                  '@keyframes fadeInUp': {
                    from: {
                      opacity: 0,
                      transform: 'translateY(20px)',
                    },
                    to: {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '150%',
                    height: '150%',
                    background: 'radial-gradient(circle, rgba(64, 224, 208, 0.1) 0%, rgba(66, 133, 244, 0.05) 50%, transparent 70%)',
                    filter: 'blur(40px)',
                    zIndex: -1,
                  },
                }}
              >
                <StyledWEM role="heading" aria-level={1}>
                  WEM
                </StyledWEM>
                <Typography 
                  variant="h3" 
                  align="center" 
                  sx={{ 
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    letterSpacing: '0.02em',
                    mt: -1.5,
                    mb: 4,
                    textShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
                    animation: 'fadeInUp 1s ease-out 0.4s both',
                    '@keyframes fadeInUp': {
                      from: {
                        opacity: 0,
                        transform: 'translateY(20px)',
                      },
                      to: {
                        opacity: 1,
                        transform: 'translateY(0)',
                      },
                    },
                  }}
                >
                  Workforce Evolution Model
                </Typography>
              </Box>

              <Box
                sx={{
                  textAlign: 'center',
                  animation: 'fadeInUp 1s ease-out 0.6s both',
                  '@keyframes fadeInUp': {
                    from: {
                      opacity: 0,
                      transform: 'translateY(20px)',
                    },
                    to: {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  },
                }}
              >
                <Typography 
                  variant="h5" 
                  align="center" 
                  sx={{ 
                    opacity: 0.9,
                    maxWidth: '800px',
                    margin: '0 auto',
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: 1.6,
                    mb: 1,
                    fontSize: { 
                      xs: '1.25rem',
                      sm: '1.4rem',
                      md: '1.5rem' 
                    },
                  }}
                >
                  You can&apos;t stop the pace of change. But you can be ready for it.
                </Typography>
                <Typography 
                  variant="h5" 
                  align="center" 
                  sx={{ 
                    opacity: 0.9,
                    maxWidth: '700px',
                    margin: '0 auto',
                    fontWeight: 400,
                    fontStyle: 'italic',
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: 1.3,
                    mb: 4,
                    fontSize: { 
                      xs: '1.1rem',
                      sm: '1.25rem',
                      md: '1.35rem' 
                    },
                  }}
                >
                  Understand how automation, AI, and global trends could impact your role - and the steps to stay ahead.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => {
                      const formElement = document.querySelector('#risk-assessment-form');
                      formElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    sx={{ 
                      mt: 4,
                      py: 1.5,
                      px: 4,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 500,
                      background: 'linear-gradient(135deg, #40E0D0 0%, #4285f4 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #4285f4 0%, #40E0D0 100%)',
                      },
                      boxShadow: '0 4px 20px rgba(64, 224, 208, 0.3)',
                    }}
                  >
                    Start My Assessment
                  </Button>
                </Box>
              </Box>
            </Container>
          </HeroSection>

          <FormContainer id="risk-assessment-form">
            <form onSubmit={handleSubmit}>
              <StyledTextField
                fullWidth
                label="Job Title"
                variant="outlined"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                margin="normal"
              />
              <StyledTextField
                select
                fullWidth
                label="Age Range"
                variant="outlined"
                value={formData.ageRange}
                onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
                margin="normal"
                required
              >
                <MenuItem value="18-22">18-22</MenuItem>
                <MenuItem value="23-29">23-29</MenuItem>
                <MenuItem value="30-39">30-39</MenuItem>
                <MenuItem value="40+">40+</MenuItem>
              </StyledTextField>
              <StyledTextField
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
                  <MenuItem 
                    key={option.value} 
                    value={option.value}
                    sx={{ 
                      color: 'black',
                      '&:hover': {
                        backgroundColor: 'rgba(64, 224, 208, 0.1)',
                      },
                    }}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </StyledTextField>

              <StyledTextField
                fullWidth
                select
                label="Organization Size"
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
                margin="normal"
                required
              >
                {companySizes.map((option) => (
                  <MenuItem 
                    key={option.value} 
                    value={option.value}
                    sx={{ 
                      color: 'black',
                      '&:hover': {
                        backgroundColor: 'rgba(64, 224, 208, 0.1)',
                      },
                    }}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </StyledTextField>

              <StyledTextField
                fullWidth
                select
                label="Country"
                name="region"
                value={formData.region}
                onChange={handleChange}
                margin="normal"
                required
              >
                {regions.map((option) => (
                  <MenuItem 
                    key={option} 
                    value={option}
                    sx={{ 
                      color: 'black',
                      '&:hover': {
                        backgroundColor: 'rgba(64, 224, 208, 0.1)',
                      },
                    }}
                  >
                    {option}
                  </MenuItem>
                ))}
              </StyledTextField>
              <FormHelperText 
                sx={{ 
                  fontStyle: 'italic', 
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.7)',
                  mt: 1,
                }}
              >
                Disruption scoring is based on U.S. job and labor market data - Global scoring is in development
              </FormHelperText>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{ 
                  mt: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  background: 'linear-gradient(135deg, #40E0D0 0%, #4285f4 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4285f4 0%, #40E0D0 100%)',
                  },
                  boxShadow: '0 4px 20px rgba(64, 224, 208, 0.3)',
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Analyze Risk'}
              </Button>

              {error && (
                <Typography 
                  color="error" 
                  sx={{ 
                    mt: 2, 
                    textAlign: 'center',
                    bgcolor: 'rgba(255, 0, 0, 0.1)',
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  {error}
                </Typography>
              )}
            </form>

            {result && (
              <ResultCard>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <RiskScore>
                    {result.riskScore}
                  </RiskScore>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      mt: 2,
                      color: result.riskTier === 'Low' ? '#40E0D0' : 
                             result.riskTier === 'Moderate' ? '#4285f4' :
                             result.riskTier === 'High' ? '#f44336' : '#d32f2f',
                      fontWeight: 600,
                      textShadow: 'none',
                    }}
                  >
                    {result.riskTier} Risk
                  </Typography>
                </Box>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    textAlign: 'center',
                    color: '#1a1a1a',
                    lineHeight: 1.6,
                  }}
                >
                  {result.summary}
                </Typography>
                
                <PremiumSection>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#6633ee' }}>
                    Unlock Full Insights
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3, color: 'rgba(0, 0, 0, 0.87)' }}>
                    Get detailed analysis, trends, and personalized recommendations to future-proof your career.
                  </Typography>
                  <Button 
                    variant="contained" 
                    fullWidth
                    onClick={() => window.location.href = '/premium-insights'}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 500,
                      background: 'linear-gradient(135deg, #6633ee 0%, #4285f4 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #4285f4 0%, #6633ee 100%)',
                      },
                      boxShadow: '0 4px 20px rgba(102, 51, 238, 0.2)',
                    }}
                  >
                    Upgrade to Premium
                  </Button>
                </PremiumSection>
              </ResultCard>
            )}
          </FormContainer>
        </Container>
      </Box>
    </ThemeProvider>
  );
} 