import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const HomePage = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-amber-800 py-4 px-4">
          <Text className="text-2xl font-bold text-white text-center">Temple App</Text>
        </View>

        {/* Temple Image */}
        <View className="w-full h-64">
          <Image
            source={require('../assets/images/templeDonatoin.png')} 
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* Quick Actions */}
        <View className="flex-row justify-around py-4 bg-amber-50">
          <TouchableOpacity 
            onPress={() => router.push('https://newgoloka.com/donate/')}
            className="items-center"
          >
            <View className="w-12 h-12 bg-amber-100 rounded-full items-center justify-center mb-1">
              <Ionicons name="heart-outline" size={24} color="#d97706" />
            </View>
            <Text className="text-amber-800">Donate</Text>
          </TouchableOpacity>

          <TouchableOpacity 
           onPress={() => router.push('/events')}
           className="items-center">
            <View className="w-12 h-12 bg-amber-100 rounded-full items-center justify-center mb-1">
              <Ionicons name="calendar-outline" size={24} color="#d97706" />
            </View>
            <Text className="text-amber-800">Events</Text>
          </TouchableOpacity>

          <TouchableOpacity 
          onPress={() => router.push('/seva')}
          className="items-center">
            <View className="w-12 h-12 bg-amber-100 rounded-full items-center justify-center mb-1">
              <Ionicons name="information-circle-outline" size={24} color="#d97706" />
            </View>
            <Text className="text-amber-800">Seva</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center">
            <View className="w-12 h-12 bg-amber-100 rounded-full items-center justify-center mb-1">
              <Ionicons name="call-outline" size={24} color="#d97706" />
            </View>
            <Text className="text-amber-800">Contact</Text>
          </TouchableOpacity>
        </View>

        {/* Welcome Message */}
        <View className="p-4">
          <Text className="text-xl font-bold text-amber-800 mb-2">Welcome Devotee</Text>
          <Text className="text-gray-700 mb-4">
            We are grateful for your visit to our temple app. Find peace, blessings,
            and connect with our spiritual community.
          </Text>
        </View>

        {/* Donation Banner */}
        <View className="bg-amber-50 p-4 mb-4 rounded-lg border border-amber-200">
          <Text className="text-lg font-semibold text-amber-800 mb-2">Make a Difference</Text>
          <Text className="text-gray-700 mb-3">
            Your generous donations help us maintain the temple and support community services.
          </Text>
          <TouchableOpacity 
            onPress={() => router.push('/donation')}
            className="bg-amber-600 py-2 rounded-lg"
          >
            <Text className="text-white text-center font-medium">Donate Now</Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming Events Section */}
        <View className="p-4 mb-4">
          <Text className="text-xl font-bold text-amber-800 mb-4">Upcoming Events</Text>
          
          {/* Event Card 1 */}
          <View className="bg-gray-50 p-3 rounded-lg mb-3 border border-gray-200">
            <Text className="text-base font-semibold text-amber-800">Annual Temple Festival</Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text className="text-gray-600 ml-1">May 15, 2025</Text>
            </View>
          </View>
          
          {/* Event Card 2 */}
          <View className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <Text className="text-base font-semibold text-amber-800">Weekly Bhajan Session</Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text className="text-gray-600 ml-1">Every Sunday</Text>
            </View>
          </View>
        </View>
        
        {/* Footer */}
        <View className="p-4 bg-amber-800">
          <Text className="text-white text-center mb-2">© 2025 Temple App</Text>
          <Text className="text-amber-200 text-center text-sm">
            Spreading peace and spiritual harmony
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomePage;