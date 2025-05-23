import axios from 'axios';
import React, { use, useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, Image,KeyboardAvoidingView,
  Platform,SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SignupScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();
  const handleSignup = async () =>{
    if (!username || !email || !password || !confirmPassword){
      alert("please fill all fields");
      return;
    }
    if (password !== confirmPassword){
      alert("passwords do not match");
      return;
    }
    try{
      const response =  await axios.post('http://172.20.10.3:3000/auth/signup',{
      username: username,
      email: email,
      password: password,
      confirmPassword: confirmPassword
    });
    const user =  response.data.user;
    if (user){
      alert("Signup successful");
      navigation.navigate('Login');
    }
    else{
      alert("Signup failed. Please try again.")
    }
    }catch (error){
      alert("An error occurres. Please try again.")
    }

  }
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Create an Account</Text>
          <View style={styles.accountTextContainer}>
            <Text style={styles.accountText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.loginText}> Login</Text>
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
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Image 
              source={require('../assets/images/email.png')} 
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
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
          
          <View style={styles.inputContainer}>
            <Image 
              source={require('../assets/images/key.png')} 
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
          
          <TouchableOpacity style={styles.registerButton} onPress={handleSignup}>
            <Text style={styles.registerButtonText}>REGISTER NOW</Text>
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
    marginTop: 60,
  },
  titleText: {
    fontSize: 24,
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
  loginText: {
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
  registerButton: {
    backgroundColor: '#FF8200',
    borderRadius: 5,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
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
});

export default SignupScreen;