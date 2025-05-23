import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const DonationPage = () => {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const predefinedAmounts = [101, 501, 1001, 5001];

  const handleAmountSelection = (value) => {
    setSelectedAmount(value);
    setAmount(value.toString());
  };

  const handleCustomAmount = (value) => {
    setSelectedAmount(null);
    setAmount(value);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleDonation = async () => {
    if (!amount || !name || !email || !phone) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    try{
      const response = await axios.post('http://172.20.10.3:3000/donation/donations', {
        amount: Number(amount),
        name,
        email,
        phone,
      });
      
    if (response.status === 200 || response.status === 201) {
      Alert.alert(
        'Thank You!',
        `Thank you for your generous donation of ₹${amount}. May God bless you!`,
        [
          {
            text: 'OK',
            onPress: () => {
              router.push({
                pathname: '/donation-success',
                params: { amount }
              });
            },
          },
        ]
      );  
    } else {
      Alert.alert('Error', 'Failed to process your donation. Please try again.');
    }
    }catch(error){
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred while processing your donation. Please try again.');
      return;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold black">Make a Donation</Text>
        </View>

        {/* Temple Image */}
        <View className="items-center mb-6">
          {/* <Image
            source={require('../../assets/images/templeDonatoin.png')}
            className="w-full h-40 rounded-lg"
            resizeMode="cover"
          /> */}
                    <View
                    className="w-full h-32 rounded-lg"
                    style={{ backgroundColor: '#FF5733' }} 
                  />
        </View>

        {/* Donation Purpose */}
        <View className="mb-6 p-4 bg-amber-50 rounded-lg">
          <Text className="text-lg font-semibold text-amber-800 mb-2">
            Your donation will help us:
          </Text>
          <View className="flex-row items-center mb-2">
            <Ionicons name="checkmark-circle" size={20} color="#d97706" />
            <Text className="ml-2 text-gray-700">Maintain temple premises</Text>
          </View>
          <View className="flex-row items-center mb-2">
            <Ionicons name="checkmark-circle" size={20} color="#d97706" />
            <Text className="ml-2 text-gray-700">Conduct religious ceremonies</Text>
          </View>
          <View className="flex-row items-center mb-2">
            <Ionicons name="checkmark-circle" size={20} color="#d97706" />
            <Text className="ml-2 text-gray-700">Support community service activities</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="checkmark-circle" size={20} color="#d97706" />
            <Text className="ml-2 text-gray-700">Feed the poor and needy</Text>
          </View>
        </View>

        {/* Predefined Amounts */}
        <Text className="text-lg font-semibold mb-2 text-gray-700">Select Amount (₹)</Text>
        <View className="flex-row flex-wrap justify-between mb-4">
          {predefinedAmounts.map((value) => (
            <TouchableOpacity
              key={value}
              onPress={() => handleAmountSelection(value)}
              className={`w-24 h-12 rounded-lg m-1 items-center justify-center ${
                selectedAmount === value ? 'bg-amber-500' : 'bg-gray-200'
              }`}
            >
              <Text
                className={`text-base ${
                  selectedAmount === value ? 'text-white font-bold' : 'text-gray-700'
                }`}
              >
                ₹{value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Amount */}
        <View className="mb-4">
          <Text className="text-base font-medium mb-1 text-gray-700">
            Custom Amount (₹) <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 text-gray-700"
            keyboardType="numeric"
            placeholder="Enter amount"
            value={amount}
            onChangeText={handleCustomAmount}
          />
        </View>

        {/* Donor Information */}
        <View className="mb-4">
          <Text className="text-lg font-semibold mb-2 text-gray-700">Donor Information</Text>
          
          <Text className="text-base font-medium mb-1 text-gray-700">
            Full Name <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-3 text-gray-700"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
          />
          
          <Text className="text-base font-medium mb-1 text-gray-700">
            Email <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-3 text-gray-700"
            placeholder="Enter your email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          
          <Text className="text-base font-medium mb-1 text-gray-700">
            Phone Number <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-3 text-gray-700"
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          
          <Text className="text-base font-medium mb-1 text-gray-700">Address</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-3 text-gray-700"
            placeholder="Enter your address (optional)"
            multiline
            numberOfLines={3}
            value={address}
            onChangeText={setAddress}
          />
        </View>

        {/* Payment Method */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2 text-gray-700">Payment Method</Text>
          <View className="flex-row flex-wrap">
            <TouchableOpacity 
              onPress={() => handlePaymentMethodChange('card')}
              className={`flex-row items-center mr-4 p-3 rounded-lg ${
                paymentMethod === 'card' ? 'bg-amber-100 border border-amber-500' : 'bg-gray-100'
              }`}
            >
              <Ionicons name="card-outline" size={24} color={paymentMethod === 'card' ? '#d97706' : '#666'} />
              <Text className={`ml-2 ${paymentMethod === 'card' ? 'text-amber-800 font-medium' : 'text-gray-700'}`}>Credit/Debit Card</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => handlePaymentMethodChange('upi')}
              className={`flex-row items-center mr-4 p-3 rounded-lg ${
                paymentMethod === 'upi' ? 'bg-amber-100 border border-amber-500' : 'bg-gray-100'
              }`}
            >
              <Ionicons name="phone-portrait-outline" size={24} color={paymentMethod === 'upi' ? '#d97706' : '#666'} />
              <Text className={`ml-2 ${paymentMethod === 'upi' ? 'text-amber-800 font-medium' : 'text-gray-700'}`}>UPI</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => handlePaymentMethodChange('netbanking')}
              className={`flex-row items-center p-3 mt-2 rounded-lg ${
                paymentMethod === 'netbanking' ? 'bg-amber-100 border border-amber-500' : 'bg-gray-100'
              }`}
            >
              <Ionicons name="globe-outline" size={24} color={paymentMethod === 'netbanking' ? '#d97706' : '#666'} />
              <Text className={`ml-2 ${paymentMethod === 'netbanking' ? 'text-amber-800 font-medium' : 'text-gray-700'}`}>Net Banking</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Donation Button */}
        <TouchableOpacity
          onPress={handleDonation}
          className="bg-amber-600 py-4 rounded-lg mb-6"
        >
          <Text className="text-white text-center font-bold text-lg">
            Donate ₹{amount || '0'}
          </Text>
        </TouchableOpacity>

        {/* Info Text */}
        <View className="mb-6">
          <Text className="text-sm text-gray-500 text-center italic">
            All donations are eligible for tax exemption under Section 80G
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DonationPage;