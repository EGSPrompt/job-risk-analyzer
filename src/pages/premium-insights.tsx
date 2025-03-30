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
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { theme } from '../styles/theme';
import { styled } from '@mui/material/styles';

type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

// Styled components
const PageContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  background: 'linear-gradient(to bottom, #000000, #1a1a1a)',
}));

const Header = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 'bold',
  marginBottom: theme.spacing(4),
  textAlign: 'center',
  background: 'linear-gradient(45deg, #00e5ff, #2979ff)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
}));

const SectionCard = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    background: 'rgba(255, 255, 255, 0.08)',
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
  background: 'linear-gradient(45deg, #00e5ff, #2979ff)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const SectionDescription = styled(Typography)({
  color: '#ffffff',
  textAlign: 'center',
  marginBottom: '16px',
});

const ContentSection = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.03)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  border: '1px solid rgba(255, 255, 255, 0.05)',
}));

const ContentTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
}));

const ContentText = styled(Typography)({
  color: '#ffffff',
  whiteSpace: 'pre-line',
});

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(3),
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
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
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
}));

interface UserData {
  jobTitle: string;
  ageRange: string;
  industry: string;
  companySize: string;
  region: string;
  riskScore: number;
  riskTier: RiskLevel;
  summary: string;
}

interface PathwayInsight {
  analysis: string;
  keyFactors: string;
  nextSteps: string;
  reflection: string;
}

interface ExplorationInsight {
  title: string;
  sections: {
    title: string;
    content: string;
  }[];
}

interface InvestmentInsight {
  title: string;
  sections: {
    title: string;
    content: string;
  }[];
}

interface InsightResponse {
  sections: {
    title: string;
    content: string;
  }[];
}

const PremiumInsights = () => {
  const router = useRouter();
  const theme = useTheme();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState('explore');
  const [insights, setInsights] = useState<InsightResponse | null>(null);
  const [pathwayType, setPathwayType] = useState<'business' | 'career'>('business');
  const [targetCareer, setTargetCareer] = useState('');

  const { jobTitle, ageRange, industry, companySize, region, riskScore, riskTier, summary, skills } = router.query;

  useEffect(() => {
    if (router.isReady) {
      if (jobTitle && ageRange && industry && companySize && region && riskScore && riskTier && summary) {
        setUserData({
          jobTitle: String(jobTitle),
          ageRange: String(ageRange),
          industry: String(industry),
          companySize: String(companySize),
          region: String(region),
          riskScore: Number(riskScore),
          riskTier: String(riskTier) as RiskLevel,
          summary: String(summary)
        });
      } else {
        // If we don't have all the required data, redirect back to the form
        router.push('/');
      }
      setLoading(false);
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (!jobTitle || !industry || !riskScore || !riskTier) {
      router.push('/');
      return;
    }

    const fetchInsights = async () => {
      setLoading(true);
      try {
        let endpoint = '';
        let payload: any = {
          jobTitle,
          industry,
          riskScore: Number(riskScore),
          riskTier
        };

        switch (selectedSection) {
          case 'explore':
            endpoint = '/api/explore-insights';
            payload.category = 'Industry & Market Trends';
            break;
          case 'invest':
            endpoint = '/api/invest-insights';
            payload.skills = (skills as string || '').split(',').map(s => s.trim());
            break;
          case 'pathways':
            endpoint = '/api/pathways-insights';
            if (pathwayType === 'business') {
              payload.category = 'Start Your Own Business';
            } else {
              payload.category = 'Switch Careers';
              payload.targetCareer = targetCareer;
            }
            break;
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Failed to fetch insights');
        
        const data = await response.json();
        setInsights(data);
      } catch (error) {
        console.error('Error fetching insights:', error);
        setInsights(null);
      } finally {
        setLoading(false);
      }
    };

    if (selectedSection === 'pathways' && pathwayType === 'career' && !targetCareer) {
      setInsights(null);
      setLoading(false);
      return;
    }

    fetchInsights();
  }, [jobTitle, industry, riskScore, riskTier, skills, selectedSection, pathwayType, targetCareer]);

  return (
    <ThemeProvider theme={theme}>
      <PageContainer maxWidth="lg">
        <Header variant="h1">Premium Insights</Header>

        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={3} mb={4}>
          <SectionCard onClick={() => setSelectedSection('explore')}>
            <SectionTitle>Explore Your Score</SectionTitle>
            <SectionDescription>
              Deep dive into industry trends, market dynamics, and risk factors affecting your role
            </SectionDescription>
          </SectionCard>

          <SectionCard onClick={() => setSelectedSection('invest')}>
            <SectionTitle>Invest in Yourself</SectionTitle>
            <SectionDescription>
              Strategic recommendations for skill development and career enhancement
            </SectionDescription>
          </SectionCard>

          <SectionCard onClick={() => setSelectedSection('pathways')}>
            <SectionTitle>Other Pathways</SectionTitle>
            <SectionDescription>
              Explore entrepreneurship, freelancing, and teaching opportunities
            </SectionDescription>
          </SectionCard>
        </Box>

        {selectedSection === 'pathways' && (
          <>
            <StyledButtonGroup>
              <Button
                onClick={() => {
                  setPathwayType('business');
                  setTargetCareer('');
                }}
                className={pathwayType === 'business' ? 'active' : ''}
              >
                Start Your Own Business
              </Button>
              <Button
                onClick={() => setPathwayType('career')}
                className={pathwayType === 'career' ? 'active' : ''}
              >
                Switch Careers
              </Button>
            </StyledButtonGroup>

            {pathwayType === 'career' && (
              <StyledTextField
                fullWidth
                variant="outlined"
                placeholder="What career would you like to transition into?"
                value={targetCareer}
                onChange={(e) => setTargetCareer(e.target.value)}
              />
            )}
          </>
        )}

        {loading ? (
          <Typography color="white" textAlign="center">Loading insights...</Typography>
        ) : insights?.sections ? (
          insights.sections.map((section, index) => (
            <ContentSection key={index}>
              <ContentTitle>{section.title}</ContentTitle>
              <ContentText>{section.content}</ContentText>
            </ContentSection>
          ))
        ) : (
          <Typography color="white" textAlign="center">
            {selectedSection === 'pathways' && pathwayType === 'career' && !targetCareer
              ? "Please enter the career you'd like to transition into"
              : "No insights available"}
          </Typography>
        )}
      </PageContainer>
    </ThemeProvider>
  );
};

export default PremiumInsights; 