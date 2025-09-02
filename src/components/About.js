import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Info, 
  Code, 
  Heart, 
  Globe, 
  Users,
  Zap,
  Shield,
  Cpu,
  Cloud,
  Database,
  Github,
  Mail,
  ExternalLink
} from 'lucide-react';

const AboutContainer = styled.div`
  padding: ${props => props.theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
`;

const AboutHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.xxxl};
  font-weight: ${props => props.theme.fontWeights.bold};
  margin: 0 0 ${props => props.theme.spacing.md} 0;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.primaryDark});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.xl};
  margin: 0 0 ${props => props.theme.spacing.lg} 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const Version = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.full};
  font-weight: ${props => props.theme.fontWeights.semibold};
`;

const SectionGrid = styled.div`
  display: grid;
  gap: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Section = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.colors.cardShadow};
  border: 1px solid ${props => props.theme.colors.border};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const SectionIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.color}20;
  color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SectionTitle = styled.h2`
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.bold};
  margin: 0;
`;

const SectionDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.md};
  line-height: 1.6;
  margin: 0 0 ${props => props.theme.spacing.lg} 0;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const FeatureCard = styled(motion.div)`
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.lg};
  border: 1px solid ${props => props.theme.colors.border};
  text-align: center;
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.color}20;
  color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing.md} auto;
`;

const FeatureTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.bold};
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.sm};
  line-height: 1.5;
  margin: 0;
`;

const TechGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${props => props.theme.spacing.md};
`;

const TechItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.text};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const StatCard = styled(motion.div)`
  text-align: center;
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border};
`;

const StatValue = styled.div`
  font-size: ${props => props.theme.fontSizes.xxxl};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.md};
  font-weight: ${props => props.theme.fontWeights.semibold};
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const ContactCard = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${props => props.theme.colors.shadow};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ContactIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.color}20;
  color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContactInfo = styled.div`
  flex: 1;
`;

const ContactTitle = styled.div`
  color: ${props => props.theme.colors.text};
  font-weight: ${props => props.theme.fontWeights.bold};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const ContactDescription = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.sm};
`;

const About = () => {
  const features = [
    {
      icon: Cloud,
      color: '#3B82F6',
      title: 'Real-time Data',
      description: 'Live weather updates from global meteorological sources'
    },
    {
      icon: Globe,
      color: '#10B981',
      title: 'Global Coverage',
      description: 'Weather data for cities and locations worldwide'
    },
    {
      icon: Zap,
      color: '#F59E0B',
      title: 'Fast Performance',
      description: 'Optimized for speed with intelligent caching'
    },
    {
      icon: Shield,
      color: '#EF4444',
      title: 'Reliable & Secure',
      description: 'Enterprise-grade security and 99.9% uptime'
    },
    {
      icon: Users,
      color: '#8B5CF6',
      title: 'User-Friendly',
      description: 'Intuitive interface designed for all users'
    },
    {
      icon: Cpu,
      color: '#06B6D4',
      title: 'AI-Powered',
      description: 'Machine learning for better predictions'
    }
  ];

  const technologies = [
    { name: 'React 18', icon: '⚛️' },
    { name: 'Node.js', icon: '🟢' },
    { name: 'Python Flask', icon: '🐍' },
    { name: 'Chart.js', icon: '📊' },
    { name: 'Styled Components', icon: '💅' },
    { name: 'REST APIs', icon: '🔗' },
    { name: 'WebSocket', icon: '🔌' },
    { name: 'PWA', icon: '📱' }
  ];

  const stats = [
    { value: '1.2M+', label: 'Weather Queries' },
    { value: '500+', label: 'Cities Covered' },
    { value: '99.9%', label: 'Uptime' },
    { value: '50ms', label: 'Avg Response' }
  ];

  const contacts = [
    {
      icon: Github,
      color: '#333',
      title: 'GitHub',
      description: 'View source code and contribute',
      action: () => window.open('https://github.com', '_blank')
    },
    {
      icon: Mail,
      color: '#EA4335',
      title: 'Email Support',
      description: 'Get help with technical issues',
      action: () => window.location.href = 'mailto:support@weather-app.com'
    },
    {
      icon: ExternalLink,
      color: '#1DA1F2',
      title: 'Documentation',
      description: 'API docs and integration guides',
      action: () => window.open('https://docs.weather-app.com', '_blank')
    }
  ];

  return (
    <AboutContainer>
      <AboutHeader>
        <Title>Weather Analytics Pro</Title>
        <Subtitle>
          A comprehensive weather analytics platform providing real-time data, 
          intelligent insights, and professional-grade forecasting tools.
        </Subtitle>
        <Version>
          <Info size={16} />
          Version 2.1.0
        </Version>
      </AboutHeader>

      <SectionGrid>
        {/* Overview Section */}
        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader>
            <SectionIcon color="#3B82F6">
              <Globe size={24} />
            </SectionIcon>
            <SectionTitle>About Our Platform</SectionTitle>
          </SectionHeader>
          <SectionDescription>
            Weather Analytics Pro is a cutting-edge meteorological platform that combines 
            real-time weather data with advanced analytics and AI-powered insights. Our 
            mission is to provide accurate, accessible, and actionable weather information 
            to users worldwide. Whether you're a casual user checking daily forecasts or 
            a professional requiring detailed meteorological analysis, our platform delivers 
            the tools and data you need.
          </SectionDescription>
          <SectionDescription>
            Built with modern web technologies and designed for scalability, our platform 
            serves thousands of users daily while maintaining exceptional performance and 
            reliability. We're committed to continuous improvement and innovation in the 
            field of weather analytics.
          </SectionDescription>
        </Section>

        {/* Features Section */}
        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <SectionHeader>
            <SectionIcon color="#10B981">
              <Zap size={24} />
            </SectionIcon>
            <SectionTitle>Key Features</SectionTitle>
          </SectionHeader>
          <FeatureGrid>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <FeatureCard
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <FeatureIcon color={feature.color}>
                    <Icon size={24} />
                  </FeatureIcon>
                  <FeatureTitle>{feature.title}</FeatureTitle>
                  <FeatureDescription>{feature.description}</FeatureDescription>
                </FeatureCard>
              );
            })}
          </FeatureGrid>
        </Section>

        {/* Technology Stack */}
        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SectionHeader>
            <SectionIcon color="#8B5CF6">
              <Code size={24} />
            </SectionIcon>
            <SectionTitle>Technology Stack</SectionTitle>
          </SectionHeader>
          <SectionDescription>
            Our platform is built using modern, industry-leading technologies to ensure 
            optimal performance, security, and scalability. We leverage the latest frameworks 
            and tools to deliver a superior user experience.
          </SectionDescription>
          <TechGrid>
            {technologies.map((tech, index) => (
              <TechItem
                key={tech.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                <span style={{ fontSize: '1.5rem' }}>{tech.icon}</span>
                {tech.name}
              </TechItem>
            ))}
          </TechGrid>
        </Section>

        {/* Statistics */}
        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <SectionHeader>
            <SectionIcon color="#F59E0B">
              <Database size={24} />
            </SectionIcon>
            <SectionTitle>Platform Statistics</SectionTitle>
          </SectionHeader>
          <SectionDescription>
            Here are some key metrics that showcase the scale and reliability of our platform.
          </SectionDescription>
          <StatsGrid>
            {stats.map((stat, index) => (
              <StatCard
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <StatValue>{stat.value}</StatValue>
                <StatLabel>{stat.label}</StatLabel>
              </StatCard>
            ))}
          </StatsGrid>
        </Section>

        {/* Contact & Support */}
        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <SectionHeader>
            <SectionIcon color="#EF4444">
              <Heart size={24} />
            </SectionIcon>
            <SectionTitle>Connect With Us</SectionTitle>
          </SectionHeader>
          <SectionDescription>
            We'd love to hear from you! Whether you have questions, feedback, or need support, 
            our team is here to help. Reach out through any of the channels below.
          </SectionDescription>
          <ContactGrid>
            {contacts.map((contact, index) => {
              const Icon = contact.icon;
              return (
                <ContactCard
                  key={contact.title}
                  onClick={contact.action}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ContactIcon color={contact.color}>
                    <Icon size={24} />
                  </ContactIcon>
                  <ContactInfo>
                    <ContactTitle>{contact.title}</ContactTitle>
                    <ContactDescription>{contact.description}</ContactDescription>
                  </ContactInfo>
                </ContactCard>
              );
            })}
          </ContactGrid>
        </Section>
      </SectionGrid>
    </AboutContainer>
  );
};

export default About;