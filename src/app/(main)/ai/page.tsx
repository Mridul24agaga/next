'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, PlusCircle, Settings, Upload, X, AlertTriangle } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  mood?: 'neutral' | 'angry' | 'sad'
}

interface Chatbot {
  id: string
  name: string
  description: string
  messages: Message[]
  membersCount: number
  onlineCount: number
  avatar: string
  createdAt: string
  personality: string[]
  mood: 'neutral' | 'angry' | 'sad'
  lastInteraction: number
}

interface UsageLimit {
  count: number
  lastUsed: number
}

const personalities = [
  ['friendly', 'casual', 'uses lots of emojis'],
  ['sarcastic', 'witty', 'uses dry humor'],
  ['enthusiastic', 'energetic', 'uses lots of exclamation marks'],
  ['intellectual', 'formal', 'uses sophisticated language'],
  ['shy', 'hesitant', 'uses ellipsis frequently'],
  ['moody', 'unpredictable', 'prone to outbursts'],
]

const getRandomPersonality = () => personalities[Math.floor(Math.random() * personalities.length)]

const simulateTypingErrors = (text: string) => {
  const words = text.split(' ')
  return words.map(word => {
    if (Math.random() < 0.1) {
      const typoIndex = Math.floor(Math.random() * word.length)
      const typoChar = String.fromCharCode(word.charCodeAt(typoIndex) + 1)
      return word.slice(0, typoIndex) + typoChar + word.slice(typoIndex + 1)
    }
    return word
  }).join(' ')
}

const addShortForms = (text: string) => {
  const shortForms: { [key: string]: string } = {
    'you': 'u',
    'are': 'r',
    'why': 'y',
    'love': 'luv',
    'please': 'pls',
    'thanks': 'thx',
    'okay': 'k',
    'about': 'abt',
    'before': 'b4',
    'later': 'l8r',
    'tonight': '2nite',
    'tomorrow': 'tmrw',
  }

  return text.split(' ').map(word => shortForms[word.toLowerCase()] || word).join(' ')
}

export default function Component() {
  const [chatbot, setChatbot] = useState<Chatbot | null>(null)
  const [newChatbotName, setNewChatbotName] = useState('')
  const [newChatbotDescription, setNewChatbotDescription] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [usageLimit, setUsageLimit] = useState<UsageLimit>({ count: 0, lastUsed: 0 })
  const [limitReachedMessage, setLimitReachedMessage] = useState<string | null>(null)
  const [spellingSwitchOn, setSpellingSwitchOn] = useState(false) // Added spelling mistakes toggle state
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatbot?.messages])

  useEffect(() => {
    const savedChatbot = localStorage.getItem('chatbot')
    const savedUsageLimit = localStorage.getItem('usageLimit')
    if (savedChatbot) {
      setChatbot(JSON.parse(savedChatbot))
    }
    if (savedUsageLimit) {
      setUsageLimit(JSON.parse(savedUsageLimit))
    }
  }, [])

  useEffect(() => {
    if (chatbot) {
      localStorage.setItem('chatbot', JSON.stringify(chatbot))
    }
  }, [chatbot])

  useEffect(() => {
    localStorage.setItem('usageLimit', JSON.stringify(usageLimit))
  }, [usageLimit])

  useEffect(() => {
    const moodSwingInterval = setInterval(() => {
      if (chatbot) {
        const newMood = Math.random() < 0.3 ? 'angry' : Math.random() < 0.5 ? 'sad' : 'neutral'
        setChatbot(prevChatbot => ({
          ...prevChatbot!,
          mood: newMood as 'neutral' | 'angry' | 'sad'
        }))
      }
    }, 60000) // Change mood every minute

    return () => clearInterval(moodSwingInterval)
  }, [chatbot])

  useEffect(() => {
    const selfMessageInterval = setInterval(() => {
      if (chatbot && Date.now() - chatbot.lastInteraction > 300000) { // 5 minutes of inactivity
        const selfMessage: Message = {
          role: 'assistant',
          content: "Hey, I miss you! Where did you go? 😢",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mood: 'sad'
        }
        setChatbot(prevChatbot => ({
          ...prevChatbot!,
          messages: [...prevChatbot!.messages, selfMessage],
          lastInteraction: Date.now()
        }))
      }
    }, 300000) // Check every 5 minutes

    return () => clearInterval(selfMessageInterval)
  }, [chatbot])

  const createChatbot = () => {
    if (newChatbotName.trim() && newChatbotDescription.trim()) {
      const newChatbot: Chatbot = {
        id: Date.now().toString(),
        name: newChatbotName.trim(),
        description: newChatbotDescription.trim(),
        messages: [],
        membersCount: 2,
        onlineCount: 1,
        avatar: '/placeholder.svg?height=128&width=128',
        createdAt: new Date().toLocaleDateString(),
        personality: getRandomPersonality(),
        mood: 'neutral',
        lastInteraction: Date.now()
      }
      setChatbot(newChatbot)
      setNewChatbotName('')
      setNewChatbotDescription('')
      setIsDialogOpen(false)
      setShowNotification(true) // Show the notification
      setTimeout(() => setShowNotification(false), 5000) // Hide after 5 seconds
    }
  }

  const checkUsageLimit = (): boolean => {
    const now = Date.now()
    const eightHoursInMs = 8 * 60 * 60 * 1000

    if (now - usageLimit.lastUsed >= eightHoursInMs) {
      setUsageLimit({ count: 1, lastUsed: now })
      return true
    }

    if (usageLimit.count < 5) {
      setUsageLimit(prev => ({ count: prev.count + 1, lastUsed: now }))
      return true
    }

    return false
  }

  const getTimeUntilNextUse = (): string => {
    const now = Date.now()
    const eightHoursInMs = 8 * 60 * 60 * 1000
    const timeLeft = eightHoursInMs - (now - usageLimit.lastUsed)
    const hours = Math.floor(timeLeft / (60 * 60 * 1000))
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000))
    return `${hours} hours and ${minutes} minutes`
  }

  const sendMessage = async () => {
    if (!chatbot || !message.trim()) return

    if (!checkUsageLimit()) {
      setLimitReachedMessage(`You've reached the usage limit. Please try again in ${getTimeUntilNextUse()}.`)
      return
    }

    setLimitReachedMessage(null)
    const newMessage: Message = { 
      role: 'user', 
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    const updatedMessages: Message[] = [...chatbot.messages, newMessage]

    setChatbot(prevChatbot => ({
      ...prevChatbot!,
      messages: updatedMessages,
      lastInteraction: Date.now()
    }))
    setMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4-1106-preview',
          messages: [
            { role: 'system', content: `You are an AI assistant named ${chatbot.name} with the following traits: ${chatbot.personality.join(', ')}. Your description: ${chatbot.description}. Your current mood is ${chatbot.mood}. If angry, use all caps and express frustration. If sad, use ellipsis and express melancholy. Please respond accordingly, expressing these traits and moods. Keep your responses concise, ideally within 2-3 sentences.` },
            ...updatedMessages.map(({ role, content }) => ({ role, content }))
          ],
          max_tokens: 70
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response from OpenAI')
      }

      const data = await response.json()
      let content = data.choices[0].message.content

      // Apply human-like modifications
      if (chatbot.personality.includes('casual')) {
        content = addShortForms(content)
      }
      content = spellingSwitchOn ? simulateTypingErrors(content) : content; // Modified to use spellingSwitchOn

      // Apply mood-based modifications
      if (chatbot.mood === 'angry') {
        content = content.toUpperCase() + ' 😠'
      } else if (chatbot.mood === 'sad') {
        content = content.toLowerCase() + '... 😢'
      }

      const assistantMessage: Message = { 
        role: 'assistant', 
        content: content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mood: chatbot.mood
      }

      const newMessages: Message[] = [...updatedMessages, assistantMessage]
      setChatbot(prevChatbot => ({
        ...prevChatbot!,
        messages: newMessages,
        lastInteraction: Date.now()
      }))
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateChatbot = (updates: Partial<Chatbot>) => {
    setChatbot(prevChatbot => {
      if (!prevChatbot) return prevChatbot;

      const updatedChatbot = { ...prevChatbot };

      if (updates.personality !== undefined) {
        if (Array.isArray(updates.personality)) {
          updatedChatbot.personality = updates.personality;
        } else {
          console.warn('Personality update must be an array of strings');
        }
      }

      return {
        ...updatedChatbot,
        ...updates,
      };
    });
  };

  return (
    <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-8rem)] bg-white flex">
      <div className="flex h-full w-full">
        {chatbot ? (
          <div className="flex flex-col h-full w-full">
            <div className="bg-white p-3 md:p-4 shadow-sm flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold text-lg mr-2 md:mr-3">
                  {chatbot.avatar ? (
                    <img src={chatbot.avatar} alt={chatbot.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    chatbot.name[0].toUpperCase()
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-sm md:text-base">{chatbot.name}</h2>
                  <p className="text-xs text-gray-500">
                    Mood: {chatbot.mood} | {chatbot.membersCount} members, {chatbot.onlineCount} online
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-xs text-gray-500 mr-2 md:mr-4">
                  Uses left: {5 - usageLimit.count}/5
                </div>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-1 md:p-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full transition-colors duration-200"
                  aria-label="Settings"
                >
                  <Settings className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              </div>
            </div>
            <div className="flex-grow overflow-y-auto p-3 md:p-4 bg-white">
              <AnimatePresence>
                {chatbot.messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className={`mb-3 md:mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
                  >
                    <div className={`inline-block p-2 md:p-3 rounded-lg  max-w-[80%] md:max-w-[70%] ${
                      msg.role === 'user' ? 'bg-green-500 text-white' : 
                      msg.mood === 'angry' ? 'bg-red-500 text-white' :
                      msg.mood ===   'sad' ? 'bg-blue-500 text-white' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-xs  md:text-sm">{msg.content}</p>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {msg.timestamp}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
            <div className="bg-white p-3 md:p-4 border-t border-gray-200">
              <div className="flex items-center justify-end mb-2"> {/* Added toggle button */}
                <label htmlFor="spelling-toggle" className="mr-2 text-xs text-gray-500">Spelling mistakes</label>
                <button
                  id="spelling-toggle"
                  onClick={() => setSpellingSwitchOn(!spellingSwitchOn)}
                  className={`w-10 h-5 rounded-full focus:outline-none transition-colors duration-200 ease-in-out ${spellingSwitchOn ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <span className={`block w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${spellingSwitchOn ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
              </div> {/* End of toggle button */}
              {limitReachedMessage && (
                <div className="mb-3 md:mb-4 p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded text-xs md:text-sm">
                  {limitReachedMessage}
                </div>
              )}
              <div className="flex items-center">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                  placeholder="Type your message"
                  className="flex-1 p-2 bg-gray-100 rounded-full focus:outline-none text-xs md:text-sm"
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading}
                  className="ml-2 bg-white text-gray-400 p-1 md:p-2 rounded-full hover:text-green-500 focus:outline-none transition-colors duration-200"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              </div>
              <div className="mt-2 p-2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 text-xs rounded">
                <p>
                  <strong>Tip:</strong> Click on the settings icon <Settings className="inline-block h-3 w-3" /> to modify your bot&#x27;s description, add a profile picture, and customize its personality.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full flex-col md:flex-row">
            <div className="w-full md:w-[280px] border-b md:border-r border-gray-200 flex flex-col">
              <div className="p-3 md:p-4 border-b border-gray-200 flex justify-between items-center">
                <h1 className="text-lg md:text-xl font-semibold">Messages</h1>
                <button
                  onClick={() => setIsDialogOpen(true)}
                  className="p-1 md:p-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full transition-colors duration-200"
                  aria-label="New Chat"
                >
                  <PlusCircle className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center text-gray-500 text-xs md:text-sm bg-white p-4">
              <p className="text-center">Click the + button to create the ChatBot</p>
            </div>
          </div>
        )}
      </div>
      <AnimatePresence>
        {isDialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-4 md:p-6 rounded-lg shadow-xl w-full max-w-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-semibold">Create New Chatbot</h2>
                <button onClick={() => setIsDialogOpen(false)} className="text-gray-500 hover:text-gray-700 transition-colors duration-200" aria-label="Close dialog">
                  <X className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Enter chatbot name"
                value={newChatbotName}
                onChange={(e) => setNewChatbotName(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-xs md:text-sm"
              />
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded-r-md">
                <p className="text-sm">
                  In the description, express how you want the chatbot to be. This chatbot can act as a real human if you add emotions and human-like behavior. It will respond accordingly.
                </p>
              </div>
              <textarea
                placeholder="Enter chatbot description (50 words max)"
                value={newChatbotDescription}
                onChange={(e) => setNewChatbotDescription(e.target.value)}
                className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-xs md:text-sm"
                rows={4}
              />
              <p className="text-xs text-gray-500 mb-4">
                Words: {newChatbotDescription.split(/\s+/).filter(Boolean).length}/50
              </p>
              <div className="flex items-center text-sm text-yellow-600 mb-4">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <p>Please note that the chatbot is in beta version and can make mistakes. It is not fully live yet.</p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={createChatbot}
                  disabled={newChatbotDescription.split(/\s+/).filter(Boolean).length > 50 || newChatbotName.trim() === ''}
                  className="px-3 py-1 md:px-4 md:py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 text-xs md:text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {isSettingsOpen && chatbot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-[#36393f] p-4 md:p-6 rounded-lg shadow-xl w-full max-w-lg text-white"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-semibold">Chatbot Settings</h2>
                <button onClick={() => setIsSettingsOpen(false)} className="text-gray-300 hover:text-gray-100 transition-colors duration-200" aria-label="Close settings">
                  <X className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </div>
              <div className="mb-6">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-green-500 mx-auto mb-4 relative">
                  {chatbot.avatar ? (
                    <img src={chatbot.avatar} alt={chatbot.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-3xl md:text-4xl font-bold">
                      {chatbot.name[0].toUpperCase()}
                    </div>
                  )}
                  <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-white p-1 rounded-full cursor-pointer">
                    <Upload className="h-3 w-3 md:h-4 md:w-4 text-gray-600" />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          updateChatbot({ avatar: reader.result as string })
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-center mb-2">{chatbot.name}</h3>
                <p className="text-gray-400 text-center text-xs md:text-sm mb-4">.{chatbot.name.toLowerCase()}</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="chatbot-name" className="block text-xs md:text-sm font-medium text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    id="chatbot-name"
                    value={chatbot.name}
                    onChange={(e) => updateChatbot({ name: e.target.value })}
                    className="w-full p-2 bg-[#40444b] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-xs md:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="chatbot-description" className="block text-xs md:text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea
                    id="chatbot-description"
                    value={chatbot.description}
                    onChange={(e) => updateChatbot({ description: e.target.value })}
                    rows={4}
                    className="w-full p-2 bg-[#40444b] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-xs md:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="chatbot-personality" className="block text-xs md:text-sm font-medium text-gray-300 mb-1">Personality</label>
                  <input
                    type="text"
                    id="chatbot-personality"
                    value={chatbot.personality.join(', ')}
                    onChange={(e) => {
                      const traits = e.target.value.split(',').map(trait => trait.trim()).filter(Boolean);
                      updateChatbot({ personality: traits });
                    }}
                    className="w-full p-2 bg-[#40444b] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-xs md:text-sm"
                  />
                </div>
              </div>
              <div className="mt-6">
                <h4 className="text-xs md:text-sm font-medium text-gray-300 mb-2">Member Since</h4>
                <p className="text-white text-xs md:text-sm">{chatbot.createdAt}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-md">
          <p className="font-bold">Chatbot created successfully!</p>
          <p>Click on the settings icon to modify the description, add a profile picture, and customize your bot.</p>
        </div>
      )}
    </div>
  )
}