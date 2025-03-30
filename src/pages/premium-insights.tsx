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

interface ExplorationInsights {
  industryTrends: string;
  techDisruptors: string;
  roleConsiderations: string;
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

  return (
    <ThemeProvider theme={theme}>
      {/* ... existing JSX ... */}
      
      {selectedSection === 'pathways' && (
        <Box>
          <CategoryTitle>Other Pathways</CategoryTitle>
          {/* ... existing ButtonGroup and input fields ... */}

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

      {/* ... rest of the existing code ... */}
    </ThemeProvider>
  );
};

export default PremiumInsights; 