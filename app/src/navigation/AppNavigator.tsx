import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { JournalScreen } from '../screens/JournalScreen';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: 'rgba(255,255,255,0.55)',
          tabBarStyle: {
            backgroundColor: '#0b1226',
            borderTopColor: 'rgba(255,255,255,0.08)',
            height: 68,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          tabBarIcon: ({ color, size }) => {
            const iconName =
              route.name === 'Home' ? 'home-outline' : route.name === 'Journal' ? 'journal-outline' : 'analytics-outline';

            return <Ionicons name={iconName as never} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Timeline' }} />
        <Tab.Screen name="Journal" component={JournalScreen} options={{ title: 'Journal' }} />
        <Tab.Screen name="Analytics" component={AnalyticsScreen} options={{ title: 'Insights' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
