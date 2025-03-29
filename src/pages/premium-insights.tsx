import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  TextField,
  CircularProgress,
  ButtonGroup,
  Fade,
  styled,
  Grid,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../styles/theme';

// Styled components matching existing design system
const InsightCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(3),
  borderRadius: theme.spacing(3),
  background: '#ffffff',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: '#1a1a1a',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
}));

const GradientButton = styled(Button)(({ theme }) => ({
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
  marginBottom: theme.spacing(2),
  color: 'white',
}));

const CategoryTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.75rem',
  fontWeight: 600,
  marginBottom: theme.spacing(3),
  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  textShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
}));

const InsightOptionCard = styled(Paper)(() => ({
  padding: '32px',
  borderRadius: '24px',
  background: 'linear-gradient(135deg, rgba(103, 58, 183, 0.1), rgba(66, 133, 244, 0.1))',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(103, 58, 183, 0.05), rgba(66, 133, 244, 0.05))',
    borderRadius: 'inherit',
    transition: 'opacity 0.3s ease',
  },
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    background: 'linear-gradient(135deg, rgba(103, 58, 183, 0.15), rgba(66, 133, 244, 0.15))',
    '&::before': {
      opacity: 0.2,
    },
  },
}));

const CardTitle = styled(Typography)(() => ({
  fontSize: '1.75rem',
  fontWeight: 600,
  marginBottom: '16px',
  background: 'linear-gradient(135deg, #40E0D0 0%, #4285f4 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  textShadow: '0 2px 10px rgba(64, 224, 208, 0.3)',
}));

const CardDescription = styled(Typography)(() => ({
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '1.1rem',
  lineHeight: 1.7,
  position: 'relative',
  zIndex: 1,
}));

const PremiumHeaderContainer = styled(Box)(() => ({
  padding: '40px',
  borderRadius: '24px',
  background: 'linear-gradient(135deg, rgba(103, 58, 183, 0.1), rgba(66, 133, 244, 0.1))',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(103, 58, 183, 0.05) 0%, rgba(66, 133, 244, 0.05) 100%)',
    borderRadius: 'inherit',
  },
}));

const ScoreCircle = styled(Box)(() => ({
  width: '140px',
  height: '140px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #40E0D0 0%, #4285f4 100%)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #40E0D0 0%, #4285f4 100%)',
    zIndex: -1,
    opacity: 0.3,
    filter: 'blur(12px)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 2,
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    zIndex: 1,
  },
}));

const ScoreText = styled(Typography)(() => ({
  fontSize: '3rem',
  fontWeight: 700,
  color: 'white',
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  zIndex: 2,
}));

const ExplanationCard = styled(Paper)(() => ({
  padding: '32px',
  borderRadius: '20px',
  background: '#ffffff',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(10px)',
  height: '100%',
  display: 'flex',
  alignItems: 'flex-start',
  position: 'relative',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const ExplanationText = styled(Typography)(() => ({
  color: '#1a1a1a',
  fontSize: '1.15rem',
  lineHeight: 1.7,
  position: 'relative',
  zIndex: 1,
}));

const MainTitle = styled(Typography)(() => ({
  fontSize: '3.5rem',
  fontWeight: 700,
  textAlign: 'center',
  background: 'linear-gradient(135deg, #40E0D0 0%, #4285f4 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  marginBottom: '1.5rem',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #40E0D0 0%, #4285f4 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    filter: 'blur(8px)',
    opacity: 0.5,
    zIndex: -1,
  },
}));

const RiskLabel = styled(Typography)(() => ({
  fontSize: '2rem',
  fontWeight: 600,
  textAlign: 'center',
  marginTop: '16px',
  background: 'linear-gradient(135deg, #40E0D0 0%, #4285f4 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
}));

// Mock user inputs (in real app, this would come from props or context)
const userInputs = {
  jobTitle: "Software Developer",
  ageRange: "30-39",
  industry: "Technology",
  companySize: "Medium (1,001–10,000 employees)",
  region: "United States"
};

// Mock API calls
const fetchInsight = async (category: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return `Detailed analysis for ${category} based on your role as a ${userInputs.jobTitle} in ${userInputs.industry}...`;
};

const fetchSkillsInsight = async (category: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return `${category} analysis for your profile...`;
};

const fetchPathwayInsight = async (category: string, input: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return `Analysis for ${category}: ${input}`;
};

const PremiumInsights = () => {
  const [selectedSection, setSelectedSection] = useState('');
  const [activeExplore, setActiveExplore] = useState<string | null>(null);
  const [exploreLoading, setExploreLoading] = useState(false);
  const [exploreInsight, setExploreInsight] = useState<string | null>(null);

  const [activeInvest, setActiveInvest] = useState('Skills Needed');
  const [investLoading, setInvestLoading] = useState(false);
  const [investInsight, setInvestInsight] = useState<string | null>(null);

  const [businessInput, setBusinessInput] = useState('');
  const [careerInput, setCareerInput] = useState('');
  const [showBusinessInput, setShowBusinessInput] = useState(false);
  const [showCareerInput, setShowCareerInput] = useState(false);
  const [pathwayLoading, setPathwayLoading] = useState(false);
  const [pathwayInsight, setPathwayInsight] = useState<string | null>(null);

  const handleExploreClick = async (category: string) => {
    setActiveExplore(category);
    setExploreLoading(true);
    const insight = await fetchInsight(category);
    setExploreInsight(insight);
    setExploreLoading(false);
  };

  const handleInvestClick = async (category: string) => {
    setActiveInvest(category);
    setInvestLoading(true);
    const insight = await fetchSkillsInsight(category);
    setInvestInsight(insight);
    setInvestLoading(false);
  };

  const handlePathwaySubmit = async (type: 'business' | 'career') => {
    setPathwayLoading(true);
    const input = type === 'business' ? businessInput : careerInput;
    const insight = await fetchPathwayInsight(type, input);
    setPathwayInsight(insight);
    setPathwayLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          backgroundImage: 'url(/images/digital-arrows-background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.85) 100%)',
            zIndex: 1,
          },
        }}
      >
        <Container 
          maxWidth="lg" 
          sx={{ 
            py: 8,
            position: 'relative',
            zIndex: 2,
          }}
        >
          <MainTitle variant="h1">
            Premium Career Insights
          </MainTitle>

          {/* Premium Header Section */}
          <Box sx={{ mb: 2 }}>
            <Box 
              sx={{ 
                width: '100vw',
                position: 'relative',
                left: '50%',
                right: '50%',
                marginLeft: '-50vw',
                marginRight: '-50vw',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                py: 6,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Container maxWidth="lg">
                <Grid container spacing={4} alignItems="center">
                  <Grid item xs={12} md={4} sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center' 
                  }}>
                    <ScoreCircle>
                      <ScoreText>55</ScoreText>
                    </ScoreCircle>
                    <RiskLabel>
                      Moderate Risk
                    </RiskLabel>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <ExplanationCard>
                      <ExplanationText>
                        The FP&A Manager role in Public Administration shows moderate automation risk. While core financial analysis tasks are increasingly automated, strategic decision-making and stakeholder management remain highly valuable human skills. Your experience in complex financial modeling and cross-functional collaboration positions you well for continued success.
                      </ExplanationText>
                    </ExplanationCard>
                  </Grid>
                </Grid>
              </Container>
            </Box>
          </Box>

          <Box 
            sx={{ 
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              pt: 3,
              pb: 6,
            }}
          >
            <Typography 
              variant="h4"
              sx={{ 
                fontSize: '2rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #40E0D0 0%, #4285f4 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Your next move starts here.
            </Typography>
            <Typography 
              variant="subtitle1"
              sx={{ 
                color: 'rgba(255, 255, 255, 0.75)',
                maxWidth: '600px',
                fontSize: '1.25rem',
              }}
            >
              Choose where to focus for deeper, personalized insight.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <InsightOptionCard onClick={() => setSelectedSection('explore')}>
                <CardTitle>Explore Your Score</CardTitle>
                <CardDescription>
                  Understand your risk assessment in detail and learn what factors influence your score.
                </CardDescription>
              </InsightOptionCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <InsightOptionCard onClick={() => setSelectedSection('invest')}>
                <CardTitle>Invest in Yourself</CardTitle>
                <CardDescription>
                  Discover personalized recommendations for skills and training to enhance your career resilience.
                </CardDescription>
              </InsightOptionCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <InsightOptionCard onClick={() => setSelectedSection('pathways')}>
                <CardTitle>Other Pathways</CardTitle>
                <CardDescription>
                  Explore alternative career paths and opportunities aligned with your skills and interests.
                </CardDescription>
              </InsightOptionCard>
            </Grid>
          </Grid>

          {/* Section content rendering based on selection */}
          <Fade in={selectedSection !== ''}>
            <Box sx={{ mt: 8 }}>
              {selectedSection === 'explore' && (
                <Box>
                  <CategoryTitle>Explore Your Score</CategoryTitle>
                  <ButtonGroup fullWidth sx={{ mb: 3 }}>
                    {['Industry & Market Trends', 'Technology Disruptors', 'Key Role Considerations'].map((category) => (
                      <Button
                        key={category}
                        onClick={() => handleExploreClick(category)}
                        variant={activeExplore === category ? 'contained' : 'outlined'}
                        disabled={exploreLoading}
                        sx={{
                          background: activeExplore === category
                            ? 'linear-gradient(135deg, #40E0D0 0%, #4285f4 100%)'
                            : 'transparent',
                          color: 'white',
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        }}
                      >
                        {category}
                      </Button>
                    ))}
                  </ButtonGroup>
                  {exploreInsight && (
                    <Fade in>
                      <InsightCard>
                        {exploreLoading ? (
                          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress />
                          </Box>
                        ) : (
                          <Typography>{exploreInsight}</Typography>
                        )}
                      </InsightCard>
                    </Fade>
                  )}
                </Box>
              )}

              {selectedSection === 'invest' && (
                <Box>
                  <CategoryTitle>Invest in Yourself</CategoryTitle>
                  <ButtonGroup fullWidth sx={{ mb: 3 }}>
                    {['Skills Needed', 'Reskilling Options', 'Adjacent Roles'].map((category) => (
                      <Button
                        key={category}
                        onClick={() => handleInvestClick(category)}
                        variant={activeInvest === category ? 'contained' : 'outlined'}
                        sx={{
                          background: activeInvest === category
                            ? 'linear-gradient(135deg, #40E0D0 0%, #4285f4 100%)'
                            : 'transparent',
                          color: 'white',
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        }}
                      >
                        {category}
                      </Button>
                    ))}
                  </ButtonGroup>
                  {investInsight && (
                    <Fade in>
                      <InsightCard>
                        {investLoading ? (
                          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress />
                          </Box>
                        ) : (
                          <Typography>{investInsight}</Typography>
                        )}
                      </InsightCard>
                    </Fade>
                  )}
                </Box>
              )}

              {selectedSection === 'pathways' && (
                <Box>
                  <CategoryTitle>Other Pathways</CategoryTitle>
                  <ButtonGroup fullWidth sx={{ mb: 3 }}>
                    {['Start Your Own Business', 'Switch Careers'].map((category) => (
                      <Button
                        key={category}
                        onClick={() => {
                          if (category === 'Start Your Own Business') {
                            setShowBusinessInput(!showBusinessInput);
                            setShowCareerInput(false);
                          } else {
                            setShowCareerInput(!showCareerInput);
                            setShowBusinessInput(false);
                          }
                        }}
                        variant={(category === 'Start Your Own Business' && showBusinessInput) || 
                                (category === 'Switch Careers' && showCareerInput) 
                                  ? 'contained' : 'outlined'}
                        sx={{
                          background: (category === 'Start Your Own Business' && showBusinessInput) || 
                                    (category === 'Switch Careers' && showCareerInput)
                            ? 'linear-gradient(135deg, #40E0D0 0%, #4285f4 100%)'
                            : 'transparent',
                          color: 'white',
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        }}
                      >
                        {category}
                      </Button>
                    ))}
                  </ButtonGroup>

                  {showBusinessInput && (
                    <Fade in>
                      <Box>
                        <TextField
                          fullWidth
                          label="What kind of business are you considering?"
                          value={businessInput}
                          onChange={(e) => setBusinessInput(e.target.value)}
                          sx={{ 
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                              color: 'white',
                              '& fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.2)',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: 'rgba(255, 255, 255, 0.7)',
                            },
                          }}
                        />
                        <Button
                          variant="contained"
                          onClick={() => handlePathwaySubmit('business')}
                          sx={{
                            background: 'linear-gradient(135deg, #40E0D0 0%, #4285f4 100%)',
                            mb: 2,
                          }}
                        >
                          Get Insights
                        </Button>
                      </Box>
                    </Fade>
                  )}

                  {showCareerInput && (
                    <Fade in>
                      <Box>
                        <TextField
                          fullWidth
                          label="What type of career switch are you considering?"
                          value={careerInput}
                          onChange={(e) => setCareerInput(e.target.value)}
                          sx={{ 
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                              color: 'white',
                              '& fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.2)',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: 'rgba(255, 255, 255, 0.7)',
                            },
                          }}
                        />
                        <Button
                          variant="contained"
                          onClick={() => handlePathwaySubmit('career')}
                          sx={{
                            background: 'linear-gradient(135deg, #40E0D0 0%, #4285f4 100%)',
                            mb: 2,
                          }}
                        >
                          Get Insights
                        </Button>
                      </Box>
                    </Fade>
                  )}

                  {pathwayLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  )}
                  {pathwayInsight && (
                    <Fade in>
                      <InsightCard>
                        <Typography>{pathwayInsight}</Typography>
                      </InsightCard>
                    </Fade>
                  )}
                </Box>
              )}
            </Box>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default PremiumInsights; 