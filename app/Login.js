import React, { useState } from 'react';
import axios from 'axios';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  Image,KeyboardAvoidingView,Platform,SafeAreaView,
  ActivityIndicator, navigation
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  
  const handleLogin = async () =>{
    if (!identifier || !password){
      alert("Please enter username/email and password");
      return;
    }
    setIsLoading(true);
    try{
      const response = await axios.post('http://172.20.10.3:3000/auth/login',{
        identifier: identifier,
        password: password
      });
      const user = response.data.user;
      if (user){
        alert("Login successful");
        navigation.navigate('Home');
      }
    }catch (error){
      alert("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Login</Text>
          <View style={styles.accountTextContainer}>
            <Text style={styles.accountText}>Don't have an account</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupText}> Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Image 
              source={require('../assets/images/user.png')} 
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Username or Email"
              value={identifier}
              onChangeText={setIdentifier}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Image 
              source={require('../assets/images/key.png')} 
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Or</Text>
            <View style={styles.divider} />
          </View>
          
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Image 
                source={require('../assets/images/google.png')} 
                style={styles.socialIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Image 
                source={require('../assets/images/Facebook-Logo.png')} 
                style={styles.socialIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Image 
                source={require('../assets/images/Twitter-Logo.png')} 
                style={styles.socialIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Image 
                source={require('../assets/images/apple.png')} 
                style={styles.socialIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 150,
  },
  titleText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  accountTextContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  accountText: {
    color: '#333',
  },
  signupText: {
    color: '#FF8200',
    fontWeight: '600',
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  inputIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: '#333',
  },
  input: {
    flex: 1,
    height: 50,
  },
  loginButton: {
    backgroundColor: '#FF8200',
    borderRadius: 5,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    paddingHorizontal: 15,
    color: '#333',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    width: 30,
    height: 30,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
});

export default LoginScreen;