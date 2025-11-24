import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthProvider'; 
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const { login, loading: authLoading } = useAuth(); 
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      // console.log(email)
      await login(email, password);
      // After successful login, user is set and app can redirect
      // (Your layout or tabs should handle navigation based on role)
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  // const handleRegister = () => {
  //   router.push('/RoleSelection');
  // };

  const handleForgetPassword = () => {
    router.push('/ForgetPassword');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/Selection.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Welcome to AttendCIC</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            placeholderTextColor="#999"
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholderTextColor="#999"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>Collaborate, Innovate, Conquer!</Text>
          <Text style={styles.subtitle}>Ready to start your exciting journey?</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            disabled={loading || authLoading}
          >
            <Text style={styles.buttonText}>
              {loading || authLoading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.forgetPassword}
            onPress={handleForgetPassword}
          > 
            <Text style={styles.forgetPasswordText}>Forget Password ?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoImage: {
    width: 250,
    height: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    width: '100%',
  },
  subtitleContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 5,
  },
  buttonContainer: {
    width: "100%",
    gap: 15,
  },
  loginButton: {
    backgroundColor: "#1976D2",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  forgetPassword: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#1976D2",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  forgetPasswordText: {
    color: "#1976D2",
    fontSize: 18,
    fontWeight: "600",
  },
});