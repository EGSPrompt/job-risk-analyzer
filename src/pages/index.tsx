import React, { useState, useRef } from 'react';
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
} from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Link from 'next/link';
import { useRouter } from 'next/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Very High';

interface RiskAnalysis {
  riskTier: RiskLevel;
  summaryOfFindings: string;
  whatTheDataSays: string[];
  keyPotentialDisruptors: string[];
  signalsOfDisruption: string[];
  evolvingRolesAndSkills: string[];
}

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  maxWidth: 600,
  margin: '0 auto',
  marginTop: theme.spacing(2),
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

const StyledWEM = styled(Typography)(({ theme }) => ({
  fontSize: '3.5rem',
  fontWeight: 700,
  textAlign: 'center',
  background: 'linear-gradient(135deg, #40E0D0 0%, #4285f4 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  textShadow: '0 0 20px rgba(64, 224, 208, 0.1)',
  marginBottom: theme.spacing(2),
}));

const HeroSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(8),
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

const theme = createTheme({
  typography: {
    fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
});

const PremiumButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #40E0D0 0%, #4285f4 100%)',
  color: 'white',
  padding: '12px 24px',
  borderRadius: theme.spacing(2),
  textTransform: 'none',
  fontSize: '1.1rem',
  fontWeight: 500,
  boxShadow: '0 4px 20px rgba(64, 224, 208, 0.3)',
  '&:hover': {
    background: 'linear-gradient(135deg, #4285f4 0%, #40E0D0 100%)',
    transform: 'translateY(-2px)',
  },
}));

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
  const router = useRouter();
  const resultCardRef = useRef<HTMLDivElement>(null);

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
        throw new Error('Failed to analyze risk');
      }

      const data = await response.json();
      console.log('API Response:', data); // Temporary log to verify structure
      setResult(data);
    } catch (error) {
      console.error('Error analyzing risk:', error);
      setError('Failed to analyze risk. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!resultCardRef.current || !result) return;

    try {
      // Initialize PDF with A4 format
      const pdf = new jsPDF({
        format: 'a4',
        unit: 'mm',
        orientation: 'portrait'
      });

      // Get page dimensions in mm
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // Helper function to add text with word wrap
      const addWrappedText = (text: string, y: number, maxWidth: number = pageWidth - (margin * 2)) => {
        const lines = pdf.splitTextToSize(text, maxWidth);
        pdf.text(lines, margin, y);
        return y + (lines.length * 7); // Return new Y position after text
      };

      // Helper function to check and add new page if needed
      const checkAndAddPage = (requiredSpace: number) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
      };

      // Add title
      pdf.setFontSize(24);
      pdf.setTextColor(66, 133, 244); // #4285f4
      pdf.text('Job Risk Analysis Report', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Add date
      pdf.setFontSize(12);
      pdf.setTextColor(26, 26, 26); // #1a1a1a
      const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      pdf.text(`Generated on ${date}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Add input parameters
      checkAndAddPage(40);
      pdf.setFontSize(14);
      pdf.setTextColor(26, 26, 26);
      pdf.text('Analysis Parameters:', margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(12);
      const params = [
        `Job Title: ${formData.jobTitle}`,
        `Age Range: ${formData.ageRange}`,
        `Industry: ${formData.industry}`,
        `Organization Size: ${formData.companySize}`,
        `Region: ${formData.region}`
      ];
      params.forEach(param => {
        pdf.text(param, margin, yPosition);
        yPosition += 7;
      });
      yPosition += 10;

      // Add Risk Level
      checkAndAddPage(20);
      pdf.setFontSize(18);
      pdf.setTextColor(
        result.riskTier === 'Low' ? 64 : 
        result.riskTier === 'Moderate' ? 66 :
        result.riskTier === 'High' ? 244 : 211,
        result.riskTier === 'Low' ? 224 :
        result.riskTier === 'Moderate' ? 133 :
        result.riskTier === 'High' ? 67 : 47,
        result.riskTier === 'Low' ? 208 :
        result.riskTier === 'Moderate' ? 244 :
        result.riskTier === 'High' ? 54 : 47
      );
      pdf.text(`${result.riskTier} Risk`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Add Summary of Findings
      checkAndAddPage(40);
      pdf.setFontSize(16);
      pdf.setTextColor(26, 26, 26);
      pdf.text('Summary of Findings', margin, yPosition);
      yPosition += 8;
      pdf.setFontSize(12);
      yPosition = addWrappedText(result.summaryOfFindings, yPosition) + 10;

      // Add What the Data Says
      checkAndAddPage(40);
      pdf.setFontSize(16);
      pdf.text('What the Data Says', margin, yPosition);
      yPosition += 8;
      pdf.setFontSize(12);
      result.whatTheDataSays.forEach(point => {
        checkAndAddPage(15);
        pdf.text('•', margin, yPosition);
        yPosition = addWrappedText(point, yPosition, pageWidth - (margin * 2 + 8)) + 5;
      });
      yPosition += 5;

      // Add Key Potential Disruptors
      checkAndAddPage(40);
      pdf.setFontSize(16);
      pdf.text('Key Potential Disruptors', margin, yPosition);
      yPosition += 8;
      pdf.setFontSize(12);
      result.keyPotentialDisruptors.forEach(point => {
        checkAndAddPage(15);
        pdf.text('•', margin, yPosition);
        yPosition = addWrappedText(point, yPosition, pageWidth - (margin * 2 + 8)) + 5;
      });
      yPosition += 5;

      // Add Signals of Disruption
      checkAndAddPage(40);
      pdf.setFontSize(16);
      pdf.text('Signals of Disruption', margin, yPosition);
      yPosition += 8;
      pdf.setFontSize(12);
      result.signalsOfDisruption.forEach(point => {
        checkAndAddPage(15);
        pdf.text('•', margin, yPosition);
        yPosition = addWrappedText(point, yPosition, pageWidth - (margin * 2 + 8)) + 5;
      });
      yPosition += 5;

      // Add Evolving Roles & Skills
      checkAndAddPage(40);
      pdf.setFontSize(16);
      pdf.text('Evolving Roles & Skills', margin, yPosition);
      yPosition += 8;
      pdf.setFontSize(12);
      result.evolvingRolesAndSkills.forEach(point => {
        checkAndAddPage(15);
        pdf.text('•', margin, yPosition);
        yPosition = addWrappedText(point, yPosition, pageWidth - (margin * 2 + 8)) + 5;
      });

      // Add footer on last page
      pdf.setFontSize(10);
      pdf.setTextColor(128, 128, 128);
      pdf.text(
        'This report was generated using AI-powered analysis of current job market trends and industry data.',
        pageWidth / 2,
        pageHeight - margin,
        { align: 'center' }
      );

      // Save the PDF
      const fileName = `job-risk-analysis-${formData.jobTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
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
              <ResultCard ref={resultCardRef} id="risk-assessment-result">
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
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

                {/* Summary of Findings */}
                <Box sx={{ mb: 4 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#1a1a1a',
                      fontWeight: 600,
                      mb: 2 
                    }}
                  >
                    Summary of Findings
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: '#1a1a1a',
                      lineHeight: 1.6,
                    }}
                  >
                    {result.summaryOfFindings}
                  </Typography>
                </Box>

                {/* What the Data Says */}
                <Box sx={{ mb: 4 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#1a1a1a',
                      fontWeight: 600,
                      mb: 2 
                    }}
                  >
                    What the Data Says
                  </Typography>
                  <Box component="ul" sx={{ 
                    pl: 2,
                    m: 0,
                    '& > li': {
                      mb: 1,
                      '&:last-child': {
                        mb: 0
                      }
                    }
                  }}>
                    {result.whatTheDataSays.map((point, index) => (
                      <li key={index}>
                        <Typography sx={{ color: '#1a1a1a' }}>
                          {point}
                        </Typography>
                      </li>
                    ))}
                  </Box>
                </Box>

                {/* Key Potential Disruptors */}
                <Box sx={{ mb: 4 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#1a1a1a',
                      fontWeight: 600,
                      mb: 2 
                    }}
                  >
                    Key Potential Disruptors
                  </Typography>
                  <Box component="ul" sx={{ 
                    pl: 2,
                    m: 0,
                    '& > li': {
                      mb: 1,
                      '&:last-child': {
                        mb: 0
                      }
                    }
                  }}>
                    {result.keyPotentialDisruptors.map((disruptor, index) => (
                      <li key={index}>
                        <Typography sx={{ color: '#1a1a1a' }}>
                          {disruptor}
                        </Typography>
                      </li>
                    ))}
                  </Box>
                </Box>

                {/* Signals of Disruption */}
                <Box sx={{ mb: 4 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#1a1a1a',
                      fontWeight: 600,
                      mb: 2 
                    }}
                  >
                    Signals of Disruption
                  </Typography>
                  <Box component="ul" sx={{ 
                    pl: 2,
                    m: 0,
                    '& > li': {
                      mb: 1,
                      '&:last-child': {
                        mb: 0
                      }
                    }
                  }}>
                    {result.signalsOfDisruption.map((signal, index) => (
                      <li key={index}>
                        <Typography sx={{ color: '#1a1a1a' }}>
                          {signal}
                        </Typography>
                      </li>
                    ))}
                  </Box>
                </Box>

                {/* Evolving Roles & Skills */}
                <Box sx={{ mb: 4 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#1a1a1a',
                      fontWeight: 600,
                      mb: 2 
                    }}
                  >
                    Evolving Roles & Skills
                  </Typography>
                  <Box component="ul" sx={{ 
                    pl: 2,
                    m: 0,
                    '& > li': {
                      mb: 1,
                      '&:last-child': {
                        mb: 0
                      }
                    }
                  }}>
                    {result.evolvingRolesAndSkills.map((role, index) => (
                      <li key={index}>
                        <Typography sx={{ color: '#1a1a1a' }}>
                          {role}
                        </Typography>
                      </li>
                    ))}
                  </Box>
                </Box>

                {/* Download Button */}
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={generatePDF}
                    sx={{
                      mt: 2,
                      backgroundColor: '#4285f4',
                      '&:hover': {
                        backgroundColor: '#2b76f5',
                      },
                    }}
                  >
                    Download Your Results
                  </Button>
                </Box>
              </ResultCard>
            )}
          </FormContainer>
        </Container>
      </Box>
    </ThemeProvider>
  );
} 