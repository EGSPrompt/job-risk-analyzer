import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
  Grid,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../styles/theme';
import { styled } from '@mui/material/styles';

// Styled components
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

interface UserData {
  jobTitle: string;
  ageRange: string;
  industry: string;
  companySize: string;
  region: string;
  riskScore: number;
  riskTier: string;
  summary: string;
}

interface PathwayInsight {
  analysis: string;
  keyFactors: string;
  nextSteps: string;
  reflection: string;
}

interface ExplorationInsight {
  content: string;
}

interface InvestmentInsights {
  skillsNeeded: string;
  reskillingOptions: string;
  adjacentRoles: string;
}

const PremiumInsights = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Move all state hooks to the top level
  const [selectedSection, setSelectedSection] = useState('');
  const [activeExplore, setActiveExplore] = useState<string | null>(null);
  const [exploreLoading, setExploreLoading] = useState(false);
  const [exploreInsight, setExploreInsight] = useState<string | null>(null);

  const [activeInvest, setActiveInvest] = useState('Skills Needed');
  const [investLoading, setInvestLoading] = useState(false);
  const [investInsight, setInvestInsight] = useState<string | null>(null);

  const [pathwayInsight, setPathwayInsight] = useState<PathwayInsight | null>(null);
  const [pathwayLoading, setPathwayLoading] = useState(false);
  const [businessInput, setBusinessInput] = useState('');
  const [careerInput, setCareerInput] = useState('');
  const [showBusinessInput, setShowBusinessInput] = useState(false);
  const [showCareerInput, setShowCareerInput] = useState(false);

  const fetchPathwayInsight = async (pathwayType: 'business' | 'career', input: string, userData: UserData): Promise<PathwayInsight> => {
    try {
      const response = await fetch('/api/pathway-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pathwayType,
          input,
          jobTitle: userData.jobTitle,
          industry: userData.industry,
          ageRange: userData.ageRange,
          region: userData.region,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pathway insights');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching pathway insight:', error);
      throw error;
    }
  };

  const handlePathwaySubmit = async (type: 'business' | 'career') => {
    if (!userData) return;
    setPathwayLoading(true);
    try {
      const input = type === 'business' ? businessInput : careerInput;
      const insight = await fetchPathwayInsight(type, input, userData);
      setPathwayInsight(insight);
    } catch (error) {
      console.error('Error fetching pathway insight:', error);
    } finally {
      setPathwayLoading(false);
    }
  };

  const fetchExplorationInsight = async (category: string) => {
    if (!userData) return;
    setExploreLoading(true);
    try {
      const response = await fetch('/api/explore-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          jobTitle: userData.jobTitle,
          industry: userData.industry,
          riskScore: userData.riskScore,
          riskTier: userData.riskTier,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch exploration insight');
      }

      const data = await response.json();
      setExploreInsight(data.content);
    } catch (error) {
      console.error('Error fetching exploration insight:', error);
      setExploreInsight('Failed to load insight. Please try again.');
    } finally {
      setExploreLoading(false);
    }
  };

  const handleExploreClick = (category: string) => {
    setActiveExplore(category);
    fetchExplorationInsight(category);
  };

  const fetchInvestmentInsight = async (category: string) => {
    if (!userData) return;
    setInvestLoading(true);
    try {
      const response = await fetch('/api/invest-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          jobTitle: userData.jobTitle,
          industry: userData.industry,
          riskScore: userData.riskScore,
          riskTier: userData.riskTier,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch investment insight');
      }

      const data = await response.json();
      setInvestInsight(data.content);
    } catch (error) {
      console.error('Error fetching investment insight:', error);
      setInvestInsight('Failed to load insight. Please try again.');
    } finally {
      setInvestLoading(false);
    }
  };

  const handleInvestClick = (category: string) => {
    setActiveInvest(category);
    fetchInvestmentInsight(category);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {selectedSection === 'explore' && (
          <Box>
            <CategoryTitle>Explore Your Score</CategoryTitle>
            
            <ButtonGroup 
              variant="outlined" 
              sx={{ 
                width: '100%', 
                mb: 4,
                '& .MuiButton-root': {
                  flex: 1,
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&.active': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  }
                }
              }}
            >
              {['Industry & Market Trends', 'Technology Disruptors', 'Key Role Considerations'].map((category) => (
                <Button
                  key={category}
                  onClick={() => handleExploreClick(category)}
                  className={activeExplore === category ? 'active' : ''}
                >
                  {category}
                </Button>
              ))}
            </ButtonGroup>

            {exploreLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : exploreInsight && (
              <Fade in>
                <Paper sx={{ 
                  p: 4, 
                  borderRadius: 3,
                  background: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#1a1a1a',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                }}>
                  <Typography sx={{ whiteSpace: 'pre-line' }}>
                    {exploreInsight}
                  </Typography>
                </Paper>
              </Fade>
            )}
          </Box>
        )}

        {selectedSection === 'invest' && (
          <Box>
            <CategoryTitle>Invest in Yourself</CategoryTitle>
            
            <ButtonGroup 
              variant="outlined" 
              sx={{ 
                width: '100%', 
                mb: 4,
                '& .MuiButton-root': {
                  flex: 1,
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&.active': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  }
                }
              }}
            >
              {['Skills Needed', 'Reskilling Options', 'Adjacent Roles'].map((category) => (
                <Button
                  key={category}
                  onClick={() => handleInvestClick(category)}
                  className={activeInvest === category ? 'active' : ''}
                >
                  {category}
                </Button>
              ))}
            </ButtonGroup>

            {investLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : investInsight && (
              <Fade in>
                <Paper sx={{ 
                  p: 4, 
                  borderRadius: 3,
                  background: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#1a1a1a',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                }}>
                  <Typography sx={{ whiteSpace: 'pre-line' }}>
                    {investInsight}
                  </Typography>
                </Paper>
              </Fade>
            )}
          </Box>
        )}

        {selectedSection === 'pathways' && (
          <Box>
            <CategoryTitle>Other Pathways</CategoryTitle>
            
            <ButtonGroup 
              variant="outlined" 
              sx={{ 
                width: '100%', 
                mb: 4,
                '& .MuiButton-root': {
                  flex: 1,
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }
              }}
            >
              <Button
                onClick={() => {
                  setShowBusinessInput(true);
                  setShowCareerInput(false);
                }}
                sx={{
                  backgroundColor: showBusinessInput ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                }}
              >
                Start Your Own Business
              </Button>
              <Button
                onClick={() => {
                  setShowBusinessInput(false);
                  setShowCareerInput(true);
                }}
                sx={{
                  backgroundColor: showCareerInput ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                }}
              >
                Switch Careers
              </Button>
            </ButtonGroup>

            {showBusinessInput && (
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  placeholder="Describe your business idea..."
                  value={businessInput}
                  onChange={(e) => setBusinessInput(e.target.value)}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.7)',
                      },
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={() => handlePathwaySubmit('business')}
                  disabled={!businessInput.trim()}
                  sx={{
                    backgroundColor: '#4285f4',
                    '&:hover': {
                      backgroundColor: '#2b76f5',
                    },
                  }}
                >
                  Analyze Business Idea
                </Button>
              </Box>
            )}

            {showCareerInput && (
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  placeholder="What field or career would you like to transition into?"
                  value={careerInput}
                  onChange={(e) => setCareerInput(e.target.value)}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.7)',
                      },
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={() => handlePathwaySubmit('career')}
                  disabled={!careerInput.trim()}
                  sx={{
                    backgroundColor: '#4285f4',
                    '&:hover': {
                      backgroundColor: '#2b76f5',
                    },
                  }}
                >
                  Analyze Career Switch
                </Button>
              </Box>
            )}

            {pathwayLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            )}
            
            {pathwayInsight && (
              <Fade in>
                <Paper sx={{ 
                  p: 4, 
                  mt: 3, 
                  borderRadius: 3,
                  background: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#1a1a1a',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box>
                      <Typography variant="h6" sx={{ 
                        color: '#4285f4',
                        mb: 1,
                        fontWeight: 600 
                      }}>
                        Analysis
                      </Typography>
                      <Typography sx={{ whiteSpace: 'pre-line' }}>
                        {pathwayInsight.analysis}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="h6" sx={{ 
                        color: '#4285f4',
                        mb: 1,
                        fontWeight: 600 
                      }}>
                        Key Factors to Consider
                      </Typography>
                      <Typography sx={{ whiteSpace: 'pre-line' }}>
                        {pathwayInsight.keyFactors}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="h6" sx={{ 
                        color: '#4285f4',
                        mb: 1,
                        fontWeight: 600 
                      }}>
                        Next Steps
                      </Typography>
                      <Typography sx={{ whiteSpace: 'pre-line' }}>
                        {pathwayInsight.nextSteps}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="h6" sx={{ 
                        color: '#4285f4',
                        mb: 1,
                        fontWeight: 600 
                      }}>
                        {showBusinessInput ? 'Strategic Questions to Consider' : 'Transition Plan'}
                      </Typography>
                      <Typography sx={{ whiteSpace: 'pre-line' }}>
                        {pathwayInsight.reflection}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Fade>
            )}
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default PremiumInsights; 