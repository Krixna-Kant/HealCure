// import { GEMINI_API_KEY } from '@env';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Platform, ActivityIndicator } from 'react-native';
import { GiftedChat, Bubble, InputToolbar, IMessage } from 'react-native-gifted-chat';
import * as Speech from 'expo-speech';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useTranslation } from '../../utils/language';
import { GEMINI_API_KEY, ENV_LOADED } from '@env';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export default function Home() {
    const { t, toggleLanguage, currentLanguage } = useTranslation();
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const speechStatusRef = useRef<'playing' | 'stopped'>('stopped');

    // System message for Gemini AI
    const SYSTEM_PROMPT = currentLanguage === 'en' 
        ? "You are HealCure, a friendly medical assistant for rural India. Provide concise, actionable health advice in simple English. For serious symptoms, always recommend seeing a doctor. Current date: " + new Date().toLocaleDateString()
        : "आप हीलक्योर हैं, ग्रामीण भारत के लिए एक मित्रवत चिकित्सा सहायक। सरल हिंदी में संक्षिप्त, व्यावहारिक स्वास्थ्य सलाह दें। गंभीर लक्षणों के लिए हमेशा डॉक्टर से मिलने की सलाह दें। आज की तारीख: " + new Date().toLocaleDateString();

    // Initialize with welcome message
    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: t('chat_welcome'),
                createdAt: new Date(),
                user: { _id: 2, name: 'HealCure Bot', avatar: require('../../assets/images/bot-avatar.png') },
            },
        ]);
    }, [currentLanguage]);

    // Handle speech toggle with cleanup
    const toggleSpeech = useCallback(() => {
        if (speechStatusRef.current === 'playing') {
            Speech.stop();
            speechStatusRef.current = 'stopped';
            setIsSpeaking(false);
        } else if (messages.length > 1) {
            const lastBotMessage = messages.find(m => m.user._id === 2);
            if (lastBotMessage) {
                Speech.speak(lastBotMessage.text, {
                    language: currentLanguage === 'en' ? 'en-IN' : 'hi-IN',
                    onDone: () => {
                        speechStatusRef.current = 'stopped';
                        setIsSpeaking(false);
                    }
                });
                speechStatusRef.current = 'playing';
                setIsSpeaking(true);
            }
        }
    }, [messages, currentLanguage]);

    // Get response from Gemini AI
    const getAIResponse = async (userMessage: string) => {
        try {
            setIsTyping(true);
            const fullPrompt = `${SYSTEM_PROMPT}\n\nUser: ${userMessage}\n\nAssistant:`;
            const result = await model.generateContent(fullPrompt);
            return result.response.text();
        } catch (error) {
            console.error('AI Error:', error);
            return currentLanguage === 'en' 
                ? "Sorry, I'm having trouble responding. Please try again later." 
                : "क्षमा करें, मुझे जवाब देने में समस्या हो रही है। कृपया बाद में पुनः प्रयास करें।";
        } finally {
            setIsTyping(false);
        }
    };

    // Handle sending messages
    const onSend = useCallback(async (newMessages: IMessage[] = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
        
        try {
            const userMessage = newMessages[0].text;
            const aiText = await getAIResponse(userMessage);
            
            const botResponse = {
                _id: Math.round(Math.random() * 1000000),
                text: aiText,
                createdAt: new Date(),
                user: { _id: 2, name: 'HealCure Bot', avatar: require('../../assets/images/bot-avatar.png') },
            };
            
            setMessages(previousMessages => GiftedChat.append(previousMessages, [botResponse]));
        } catch (error) {
            console.error('Send Error:', error);
        }
    }, []);

    // Custom chat bubble styling
    const renderBubble = (props: any) => (
        <Bubble
            {...props}
            wrapperStyle={{
                right: { backgroundColor: '#1E88E5' },
                left: { backgroundColor: '#f0f0f0' },
            }}
            textStyle={{
                right: { color: '#fff' },
                left: { color: '#333' },
            }}
        />
    );

    // Custom input toolbar with typing indicator
    const renderInputToolbar = (props: any) => (
        <View>
            {isTyping && (
                <View style={styles.typingIndicator}>
                    <ActivityIndicator size="small" color="#1E88E5" />
                    <Text style={styles.typingText}>
                        {currentLanguage === 'en' ? 'HealCure is typing...' : 'हीलक्योर टाइप कर रहा है...'}
                    </Text>
                </View>
            )}
            <InputToolbar
                {...props}
                containerStyle={styles.inputToolbar}
                placeholderTextColor="#888"
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {Platform.OS === 'android' && <StatusBar backgroundColor="#fff" barStyle="dark-content" />}
            <View style={styles.header}>
                <Text style={styles.title}>{t('home_title')}</Text>
                <View style={styles.headerControls}>
                    <TouchableOpacity onPress={toggleLanguage} style={styles.languageButton}>
                        <Text style={styles.languageText}>
                            {currentLanguage === 'en' ? 'हिंदी' : 'English'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleSpeech} style={styles.speechButton}>
                        <Text style={styles.speechText}>
                            {isSpeaking ? '🔇' : '🔊'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{ _id: 1 }}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
                placeholder={t('chat_placeholder')}
                alwaysShowSend
                showUserAvatar
                renderUsernameOnMessage
                scrollToBottomComponent={() => null}
                isLoadingEarlier={isTyping}
                minInputToolbarHeight={60}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f8f9fa',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E88E5',
    },
    headerControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    languageButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    languageText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1E88E5',
    },
    speechButton: {
        padding: 8,
        borderRadius: 20,
    },
    speechText: {
        fontSize: 16,
    },
    inputToolbar: {
        backgroundColor: '#f8f9fa',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingVertical: 8,
    },
    typingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f0f0f0',
    },
    typingText: {
        marginLeft: 8,
        color: '#666',
        fontSize: 14,
    },
});