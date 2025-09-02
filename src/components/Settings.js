import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIconImport, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsContainer = styled.div`
  padding: ${props => props.theme.spacing.lg};
  max-width: 1000px;
  margin: 0 auto;
`;

const SettingsHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.xxl};
  font-weight: ${props => props.theme.fontWeights.bold};
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.lg};
  margin: 0;
`;

const SettingsGrid = styled.div`
  display: grid;
  gap: ${props => props.theme.spacing.lg};
`;

const SettingsCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.colors.cardShadow};
  border: 1px solid ${props => props.theme.colors.border};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const CardIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.color}20;
  color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.bold};
  margin: 0;
`;

const CardDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.sm};
  margin: 0;
`;

const SettingsForm = styled.form`
  display: grid;
  gap: ${props => props.theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: grid;
  gap: ${props => props.theme.spacing.sm};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.md};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  font-size: ${props => props.theme.fontSizes.md};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input`
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.md};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const Select = styled.select`
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.md};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border};
`;

const ToggleSwitch = styled.div`
  width: 50px;
  height: 26px;
  background: ${props => props.checked ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 13px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:before {
    content: '';
    position: absolute;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: white;
    top: 2px;
    left: ${props => props.checked ? '26px' : '2px'};
    transition: all 0.3s ease;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${props => props.theme.spacing.lg};
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background: ${props => props.primary 
    ? `linear-gradient(135deg, ${props.theme.colors.primary}, ${props.theme.colors.primaryDark})`
    : props.theme.colors.surface};
  color: ${props => props.primary ? 'white' : props.theme.colors.text};
  border: 1px solid ${props => props.primary ? 'transparent' : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-weight: ${props => props.theme.fontWeights.semibold};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => props.primary 
      ? props.theme.colors.primary + '40'
      : props.theme.colors.shadow};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ThemeOption = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.selected ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.selected ? props.theme.colors.primary + '10' : 'transparent'};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Settings = () => {
  const [settings, setSettings] = useState({
    // Profile Settings
    name: 'John Doe',
    email: 'john.doe@example.com',
    location: 'New York, NY',
    timezone: 'UTC-5',
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    weatherAlerts: true,
    systemUpdates: false,
    
    // Appearance Settings
    theme: 'system',
    language: 'en',
    units: 'metric',
    dateFormat: 'MM/DD/YYYY',
    
    // Privacy Settings
    dataCollection: true,
    analytics: true,
    publicProfile: false,
    
    // API Settings
    apiKey: '',
    refreshInterval: '5',
    cacheEnabled: true
  });

  const [showApiKey, setShowApiKey] = useState(false);

  const handleInputChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Simulate saving settings
    toast.success('Settings saved successfully!');
  };

  const handleReset = () => {
    // Reset to default settings
    toast.success('Settings reset to defaults');
  };

  return (
    <SettingsContainer>
      <SettingsHeader>
        <Title>Settings</Title>
        <Subtitle>Customize your weather analytics experience</Subtitle>
      </SettingsHeader>

      <SettingsGrid>
        {/* Profile Settings */}
        <SettingsCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardHeader>
            <CardIcon color="#3B82F6">
              <User size={20} />
            </CardIcon>
            <div>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your personal information and preferences</CardDescription>
            </div>
          </CardHeader>
          
          <SettingsForm>
            <FormRow>
              <FormGroup>
                <Label>Full Name</Label>
                <Input
                  type="text"
                  value={settings.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </FormGroup>
            </FormRow>
            
            <FormRow>
              <FormGroup>
                <Label>Location</Label>
                <Input
                  type="text"
                  value={settings.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label>Timezone</Label>
                <Select
                  value={settings.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                >
                  <option value="UTC-8">Pacific Time (UTC-8)</option>
                  <option value="UTC-5">Eastern Time (UTC-5)</option>
                  <option value="UTC+0">Greenwich Mean Time (UTC+0)</option>
                  <option value="UTC+1">Central European Time (UTC+1)</option>
                  <option value="UTC+9">Japan Standard Time (UTC+9)</option>
                </Select>
              </FormGroup>
            </FormRow>
          </SettingsForm>
        </SettingsCard>

        {/* Notification Settings */}
        <SettingsCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <CardHeader>
            <CardIcon color="#10B981">
              <Bell size={20} />
            </CardIcon>
            <div>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you receive updates and alerts</CardDescription>
            </div>
          </CardHeader>
          
          <SettingsForm>
            <ToggleContainer>
              <div>
                <Label>Email Notifications</Label>
                <CardDescription>Receive weather updates via email</CardDescription>
              </div>
              <ToggleSwitch
                checked={settings.emailNotifications}
                onClick={() => handleToggle('emailNotifications')}
              />
            </ToggleContainer>
            
            <ToggleContainer>
              <div>
                <Label>Push Notifications</Label>
                <CardDescription>Browser notifications for important updates</CardDescription>
              </div>
              <ToggleSwitch
                checked={settings.pushNotifications}
                onClick={() => handleToggle('pushNotifications')}
              />
            </ToggleContainer>
            
            <ToggleContainer>
              <div>
                <Label>Weather Alerts</Label>
                <CardDescription>Severe weather warnings and alerts</CardDescription>
              </div>
              <ToggleSwitch
                checked={settings.weatherAlerts}
                onClick={() => handleToggle('weatherAlerts')}
              />
            </ToggleContainer>
            
            <ToggleContainer>
              <div>
                <Label>System Updates</Label>
                <CardDescription>Notifications about new features and maintenance</CardDescription>
              </div>
              <ToggleSwitch
                checked={settings.systemUpdates}
                onClick={() => handleToggle('systemUpdates')}
              />
            </ToggleContainer>
          </SettingsForm>
        </SettingsCard>

        {/* Appearance Settings */}
        <SettingsCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CardHeader>
            <CardIcon color="#8B5CF6">
              <Palette size={20} />
            </CardIcon>
            <div>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel of your dashboard</CardDescription>
            </div>
          </CardHeader>
          
          <SettingsForm>
            <FormGroup>
              <Label>Theme Preference</Label>
              <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.5rem' }}>
                <ThemeOption
                  selected={settings.theme === 'light'}
                  onClick={() => handleInputChange('theme', 'light')}
                >
                  <Sun size={20} />
                  <span>Light Theme</span>
                </ThemeOption>
                <ThemeOption
                  selected={settings.theme === 'dark'}
                  onClick={() => handleInputChange('theme', 'dark')}
                >
                  <Moon size={20} />
                  <span>Dark Theme</span>
                </ThemeOption>
                <ThemeOption
                  selected={settings.theme === 'system'}
                  onClick={() => handleInputChange('theme', 'system')}
                >
                  <Monitor size={20} />
                  <span>System Default</span>
                </ThemeOption>
              </div>
            </FormGroup>
            
            <FormRow>
              <FormGroup>
                <Label>Language</Label>
                <Select
                  value={settings.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="ja">Japanese</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Temperature Units</Label>
                <Select
                  value={settings.units}
                  onChange={(e) => handleInputChange('units', e.target.value)}
                >
                  <option value="metric">Celsius (°C)</option>
                  <option value="imperial">Fahrenheit (°F)</option>
                  <option value="kelvin">Kelvin (K)</option>
                </Select>
              </FormGroup>
            </FormRow>
            
            <FormGroup>
              <Label>Date Format</Label>
              <Select
                value={settings.dateFormat}
                onChange={(e) => handleInputChange('dateFormat', e.target.value)}
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="MMM DD, YYYY">MMM DD, YYYY</option>
              </Select>
            </FormGroup>
          </SettingsForm>
        </SettingsCard>

        {/* Privacy Settings */}
        <SettingsCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <CardHeader>
            <CardIcon color="#EF4444">
              <Shield size={20} />
            </CardIcon>
            <div>
              <CardTitle>Privacy & Data</CardTitle>
              <CardDescription>Control your data and privacy preferences</CardDescription>
            </div>
          </CardHeader>
          
          <SettingsForm>
            <ToggleContainer>
              <div>
                <Label>Data Collection</Label>
                <CardDescription>Allow anonymous usage data collection</CardDescription>
              </div>
              <ToggleSwitch
                checked={settings.dataCollection}
                onClick={() => handleToggle('dataCollection')}
              />
            </ToggleContainer>
            
            <ToggleContainer>
              <div>
                <Label>Analytics</Label>
                <CardDescription>Help improve our service with analytics</CardDescription>
              </div>
              <ToggleSwitch
                checked={settings.analytics}
                onClick={() => handleToggle('analytics')}
              />
            </ToggleContainer>
            
            <ToggleContainer>
              <div>
                <Label>Public Profile</Label>
                <CardDescription>Make your profile visible to other users</CardDescription>
              </div>
              <ToggleSwitch
                checked={settings.publicProfile}
                onClick={() => handleToggle('publicProfile')}
              />
            </ToggleContainer>
          </SettingsForm>
        </SettingsCard>

        {/* API Settings */}
        <SettingsCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <CardHeader>
            <CardIcon color="#F59E0B">
              <Globe size={20} />
            </CardIcon>
            <div>
              <CardTitle>API & Integration</CardTitle>
              <CardDescription>Configure API keys and integration settings</CardDescription>
            </div>
          </CardHeader>
          
          <SettingsForm>
            <FormGroup>
              <Label>API Key (Optional)</Label>
              <div style={{ position: 'relative' }}>
                <Input
                  type={showApiKey ? 'text' : 'password'}
                  value={settings.apiKey}
                  onChange={(e) => handleInputChange('apiKey', e.target.value)}
                  placeholder="Enter your weather API key"
                  style={{ paddingRight: '3rem' }}
                />
                <Button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    padding: '0.5rem',
                    background: 'none',
                    border: 'none',
                    minHeight: 'auto'
                  }}
                >
                  {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </FormGroup>
            
            <FormRow>
              <FormGroup>
                <Label>Data Refresh Interval (minutes)</Label>
                <Select
                  value={settings.refreshInterval}
                  onChange={(e) => handleInputChange('refreshInterval', e.target.value)}
                >
                  <option value="1">1 minute</option>
                  <option value="5">5 minutes</option>
                  <option value="10">10 minutes</option>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Cache Settings</Label>
                <ToggleContainer>
                  <span>Enable data caching</span>
                  <ToggleSwitch
                    checked={settings.cacheEnabled}
                    onClick={() => handleToggle('cacheEnabled')}
                  />
                </ToggleContainer>
              </FormGroup>
            </FormRow>
          </SettingsForm>
        </SettingsCard>
      </SettingsGrid>

      <ButtonGroup>
        <Button onClick={handleReset}>
          <RefreshCw size={18} />
          Reset to Defaults
        </Button>
        <Button primary onClick={handleSave}>
          <Save size={18} />
          Save Settings
        </Button>
      </ButtonGroup>
    </SettingsContainer>
  );
};

export default Settings;