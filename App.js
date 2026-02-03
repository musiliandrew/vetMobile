import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Activity, ShieldCheck, Wifi, RefreshCw } from 'lucide-react-native';
import axios from 'axios';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import SplashScreen from './src/components/SplashScreen';
import LanguageSelection from './src/components/LanguageSelection';
import RoleSelection from './src/components/RoleSelection';
import SignIn from './src/components/SignIn';
import SignUp from './src/components/SignUp';
import OTPVerification from './src/components/OTPVerification';
import Dashboard from './src/components/Dashboard';
import EbookPage from './src/components/EbookPage';
import DrugCenter from './src/components/DrugCenter';
import DrugCoins from './src/components/DrugCoins';
import Subscription from './src/components/Subscription';
import SelectionModal from './src/components/SelectionModal';
import QuestionBank from './src/components/QuestionBank';
import SubTopics from './src/components/SubTopics';
import TopicChapters from './src/components/TopicChapters';
import QuestionList from './src/components/QuestionList';
import QuizPage from './src/components/QuizPage';

import { API_BASE } from './src/api';
import { LanguageProvider, useLanguage } from './src/context/LanguageContext';

const { width } = Dimensions.get('window');
const API_URL = API_BASE;

// Helper to wrap screen with modal
const ScreenWrapper = ({ children, modalVisible, setModalVisible, setCurrentStep }) => (
  <>
    {children}
    <SelectionModal
      visible={modalVisible}
      onClose={() => setModalVisible(false)}
      onSelectCoins={() => {
        setModalVisible(false);
        setCurrentStep('drug_coins');
      }}
      onSelectSubscription={() => {
        setModalVisible(false);
        setCurrentStep('subscription');
      }}
    />
  </>
);

function AppContent() {
  const [currentStep, setCurrentStep] = useState('splash');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [storeModalVisible, setStoreModalVisible] = useState(false);
  const [navParams, setNavParams] = useState({});

  // Use the language context
  const { setLanguage } = useLanguage();

  const navigate = (screen, params = {}) => {
    setNavParams(params);
    setCurrentStep(screen);
  };

  const checkConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL, { timeout: 5000 });
      setData(response.data);
    } catch (err) {
      setError(err.message || 'Failed to connect');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentStep === 'dashboard') {
      checkConnection();
    }
  }, [currentStep]);

  // ALL conditional returns MUST be after all hooks!

  if (currentStep === 'splash') {
    return <SplashScreen onFinish={() => setCurrentStep('language')} />;
  }

  if (currentStep === 'language') {
    return (
      <LanguageSelection
        onContinue={(lang) => {
          setLanguage(lang); // Update global language context
          setCurrentStep('role');
        }}
      />
    );
  }

  if (currentStep === 'role') {
    return (
      <RoleSelection
        onContinue={(selectedRole) => {
          setRole(selectedRole);
          setCurrentStep('signin');
        }}
      />
    );
  }

  if (currentStep === 'signin') {
    return (
      <SignIn
        onSignIn={(userData, token) => {
          setUser(userData);
          setNavParams({ token });
          setCurrentStep('dashboard');
        }}
        onSignUp={() => setCurrentStep('signup')}
        onForgotPassword={() => setCurrentStep('otp')}
      />
    );
  }

  if (currentStep === 'signup') {
    return (
      <SignUp
        onSignUp={(formData) => {
          if (formData.fullName && formData.email && formData.password) {
            Alert.alert('Success', 'Account created successfully!');
            setUser({ email: formData.email, name: formData.fullName });
            setCurrentStep('dashboard');
          } else {
            Alert.alert('Error', 'Please fill in all required fields');
          }
        }}
        onSignIn={() => setCurrentStep('signin')}
      />
    );
  }

  if (currentStep === 'otp') {
    return (
      <OTPVerification
        email={navParams.email || ''}
        onVerify={(verificationData) => {
          if (verificationData.verified) {
            setUser(verificationData.user);
            setNavParams({ token: verificationData.token });
            setCurrentStep('dashboard');
          }
        }}
        onBack={() => setCurrentStep('signin')}
      />
    );
  }

  // Dashboard & Content Screens
  const renderContent = () => {
    switch (currentStep) {
      case 'dashboard':
        return (
          <ScreenWrapper
            modalVisible={storeModalVisible}
            setModalVisible={setStoreModalVisible}
            setCurrentStep={setCurrentStep}
          >
            <Dashboard
              userRole={role}
              userName={user?.username || "Guest"}
              onNavigate={navigate}
              onOpenStore={() => setStoreModalVisible(true)}
            />
          </ScreenWrapper>
        );
      case 'drug_center':
        return (
          <ScreenWrapper
            modalVisible={storeModalVisible}
            setModalVisible={setStoreModalVisible}
            setCurrentStep={setCurrentStep}
          >
            <DrugCenter
              onNavigate={navigate}
              onOpenStore={() => setStoreModalVisible(true)}
              coinBalance={user?.coin_balance}
              userName={user?.username}
            />
          </ScreenWrapper>
        );
      case 'drug_coins':
        return (
          <DrugCoins
            onBack={() => setCurrentStep('drug_center')}
            onNavigate={navigate}
            coinBalance={user?.coin_balance}
          />
        );
      case 'subscription':
        return (
          <Subscription
            onBack={() => setCurrentStep('dashboard')}
            token={navParams.token}
          />
        );
      case 'question_bank':
        return (
          <QuestionBank
            onBack={() => setCurrentStep('dashboard')}
            onNavigate={navigate}
            token={navParams.token}
            {...navParams}
          />
        );
      case 'sub_topics':
        return (
          <SubTopics
            onBack={() => setCurrentStep('question_bank')}
            onNavigate={navigate}
            token={navParams.token}
            {...navParams}
          />
        );
      case 'topic_chapters':
        return (
          <TopicChapters
            onBack={() => setCurrentStep('sub_topics')}
            onNavigate={navigate}
            token={navParams.token}
            {...navParams}
          />
        );
      case 'question_list':
        return (
          <QuestionList
            onBack={() => setCurrentStep('topic_chapters')}
            onNavigate={navigate}
            token={navParams.token}
            {...navParams}
          />
        );
      case 'quiz_page':
        return (
          <QuizPage
            onBack={() => setCurrentStep('question_list')}
            token={navParams.token}
            {...navParams}
          />
        );
      case 'ebook':
        return (
          <EbookPage
            onNavigate={navigate}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default function App() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
