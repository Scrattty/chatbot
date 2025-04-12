import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Smile, Mic } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface Conversation {
  id: string;
  userId: string;
  date: string;
  topic: string;
  messages: Message[];
}

const Chat = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastActivityTime, setLastActivityTime] = useState<Date>(new Date());
  const [mood, setMood] = useState<string>('');
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const [isMoodRated, setIsMoodRated] = useState(false);

  // Function to make an API call to the backend
  const getBotResponse = async (userInput: string) => {
    try {
      setIsProcessing(true);
      const response = await fetch('http://localhost:5000/get_response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_input: userInput }),
      });

      const data = await response.json();
      console.log("Backend responded with:", data);
      return data.response;
    } catch (error) {
      console.error('Error:', error);
      return "Sorry, I couldn't process your request at the moment.";
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    // Check for existing conversation
    const savedConversation = localStorage.getItem('currentConversation');
    if (savedConversation) {
      const conversation = JSON.parse(savedConversation);
      // Convert string timestamps back to Date objects
      const parsedMessages = conversation.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(parsedMessages);
      setCurrentConversation({
        ...conversation,
        messages: parsedMessages
      });
      setIsMoodRated(true); // Set to true since we're continuing a conversation
      // Clear the temporary storage
      localStorage.removeItem('currentConversation');
    } else if (messages.length === 0) {
      const botMessage: Message = {
        id: crypto.randomUUID(),
        text: "Hello! How are you feeling today? (Please rate your mood from 1-10, where 1 is very low and 10 is excellent)",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([botMessage]);
    }
  }, [navigate]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setLastActivityTime(new Date());

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Handle mood rating
    if (!isMoodRated && messages.length === 1 && !isNaN(Number(message)) && Number(message) >= 1 && Number(message) <= 10) {
      setMood(message);
      const response = `Thank you for sharing. I see your mood is ${message}/10. `;
      const followUp = Number(message) < 5 
        ? "I'm here to support you. Would you like to talk about what's bothering you?"
        : "That's great! Would you like to share what's making you feel good today?";

      const botMessage: Message = {
        id: crypto.randomUUID(),
        text: response + followUp,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } else {
      // Get bot response from backend
      const botResponse = await getBotResponse(message);
      const botMessage: Message = {
        id: crypto.randomUUID(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="flex items-center p-4 border-b">
          <h2 className="font-semibold">
            {currentConversation?.topic || 'New Chat'}
          </h2>
        </div>

        <div ref={chatAreaRef} className="h-[500px] p-4 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-4 ${msg.sender === 'user' ? 'flex justify-end' : ''}`}
            >
              <div
                className={`rounded-lg p-4 max-w-[80%] ${msg.sender === 'user' ? 'bg-[#BAE6F2]' : 'bg-gray-100'}`}
              >
                <p>{msg.text}</p>
                <span className="text-xs text-gray-500">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex gap-2 items-center text-gray-500">
              <div className="animate-bounce">●</div>
              <div className="animate-bounce [animation-delay:0.2s]">●</div>
              <div className="animate-bounce [animation-delay:0.4s]">●</div>
            </div>
          )}
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Smile className="w-6 h-6 text-gray-500" />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Write your message..."
              className="flex-1 p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#BAE6F2]"
            />
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Mic className="w-6 h-6 text-gray-500" />
            </button>
            <button 
              onClick={handleSendMessage}
              disabled={isProcessing}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Send className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
