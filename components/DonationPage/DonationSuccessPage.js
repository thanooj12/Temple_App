import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const DonationSuccessPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // In a real app, you might pass these parameters from the donation page
  const amount = params.amount || '1001';
  const date = new Date().toLocaleDateString();
  const referenceId = `TDN${Math.floor(Math.random() * 1000000)}`;

  const handleGoHome = () => {
    // This approach navigates back to the initial home screen
    // by going back to the first screen in the stack
    router.navigate('/');
  };

  const handleDonateAgain = () => {
    // Go back to the donation page
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        {/* Success Animation/Image */}
        <View className="items-center justify-center my-8">
          <View className="w-24 h-24 rounded-full bg-green-100 items-center justify-center mb-4">
            <Ionicons name="checkmark-circle" size={64} color="#22c55e" />
          </View>
        </View>

        {/* Success Message */}
        <View className="items-center mb-8">
          <Text className="text-2xl font-bold text-amber-800 mb-2">Thank You!</Text>
          <Text className="text-lg text-gray-700 text-center">
            Your donation of ₹{amount} has been received.
          </Text>
          <Text className="text-base text-gray-600 text-center mt-2">
            May God bless you for your generosity.
          </Text>
        </View>

        {/* Transaction Details */}
        <View className="bg-amber-50 rounded-lg p-4 mb-6">
          <Text className="text-lg font-semibold text-amber-800 mb-4">Transaction Details</Text>
          
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-600">Amount</Text>
            <Text className="font-medium text-gray-800">₹{amount}</Text>
          </View>
          
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-600">Date</Text>
            <Text className="font-medium text-gray-800">{date}</Text>
          </View>
          
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-600">Reference ID</Text>
            <Text className="font-medium text-gray-800">{referenceId}</Text>
          </View>
          
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Status</Text>
            <Text className="font-medium text-green-600">Successful</Text>
          </View>
        </View>

        {/* Receipt Information */}
        <View className="mb-8">
          <Text className="text-base text-gray-700 text-center">
            A receipt has been sent to your email address.
          </Text>
          <Text className="text-base text-gray-700 text-center mt-1">
            You can use it for tax exemption under Section 80G.
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-between mb-6">
          <TouchableOpacity
            onPress={handleGoHome}
            className="bg-gray-200 py-3 px-6 rounded-lg flex-1 mr-2"
          >
            <Text className="text-gray-800 text-center font-medium">Go Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleDonateAgain}
            className="bg-amber-600 py-3 px-6 rounded-lg flex-1 ml-2"
          >
            <Text className="text-white text-center font-medium">Donate Again</Text>
          </TouchableOpacity>
        </View>

        {/* Temple Image */}
        <View className="items-center mb-6">
          {/* <Image
            source={require('../../assets/images/te')}
            className="w-full h-32 rounded-lg"
            resizeMode="cover"
          /> */}
          <View
          className="w-full h-32 rounded-lg"
          style={{ backgroundColor: '#FF5733' }} 
        />
        </View>

        {/* Share Button */}
        <TouchableOpacity className="flex-row items-center justify-center mb-6 p-3 border border-amber-300 rounded-lg">
          <Ionicons name="share-social-outline" size={20} color="#d97706" />
          <Text className="ml-2 text-amber-700">Share this donation with friends</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DonationSuccessPage;