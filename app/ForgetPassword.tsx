import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
// Import the OtpInput component
import { OtpInput } from 'react-native-otp-entry'; 
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL;

type Step = 'REQUEST_OTP' | 'RESET_PASSWORD';

const ForgetPassword = () => {
  const [step, setStep] = useState<Step>('REQUEST_OTP');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(''); // Will store the 6-digit OTP
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Request OTP from the backend
  const handleRequestOtp = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email or ID.');
      return;
    }

    setLoading(true);
    try {
      // Clear OTP field when requesting a new one
      setOtp(''); 
      
      const response = await fetch(`${API_URL}/api/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', data.message);
        // Move to the next step after successful OTP request
        setStep('RESET_PASSWORD'); 
      } else {
        Alert.alert('Error', data.message || 'Failed to send OTP.');
      }
    } catch (error) {
      console.error('OTP request error:', error);
      Alert.alert('Network Error', 'Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify OTP and Reset Password
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    // Check if OTP is exactly 6 digits (as defined by the OtpInput config)
    if (otp.length !== 6 || !newPassword) {
      Alert.alert('Error', 'Please enter the 6-digit code and your new password.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Your password has been reset successfully. Please log in.');
        // Navigate user back to login screen (you would replace this with actual navigation)
        // navigation.navigate('index'); 
        console.log("Password Reset Successful. Navigating to Login.");
      } else {
        Alert.alert('Error', data.message || 'Failed to reset password. Check OTP and try again.');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      Alert.alert('Network Error', 'Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const renderRequestOtp = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>Enter your email or ID to receive a verification code.</Text>
      <TextInput
        style={styles.input}
        placeholder="Email or ID"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleRequestOtp} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send Verification Code</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderResetPassword = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>A 6-digit code has been sent to {email}.</Text>

      {/* Replaced standard TextInput with OtpInput */}
      <OtpInput
        numberOfDigits={6}
        focusColor="#007bff"
        onTextChange={(text) => setOtp(text)}
        theme={{
          containerStyle: styles.otpContainer,
          inputsContainerStyle: styles.otpInputsContainer,
          pinCodeContainerStyle: styles.pinCodeContainer,
          pinCodeTextStyle: styles.pinCodeText,
        }}
      />
      
      <TextInput
        style={[styles.input, { marginTop: 20 }]} // Added margin to separate from OTP field
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Reset Password</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.resendButton} onPress={handleRequestOtp} disabled={loading}>
        <Text style={styles.resendText}>Resend Code</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      {step === 'REQUEST_OTP' ? renderRequestOtp() : renderResetPassword()}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#343a40',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f1f3f5',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  resendText: {
    color: '#007bff',
    fontSize: 14,
  },
  // Custom styles for react-native-otp-entry
  otpContainer: {
    marginBottom: 20,
  },
  otpInputsContainer: {
    justifyContent: 'space-around',
    height: 55, // Adjusted height for better visibility
  },
  pinCodeContainer: {
    width: 45,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ced4da',
    backgroundColor: '#f1f3f5',
  },
  pinCodeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#343a40',
  }
});

export default ForgetPassword;