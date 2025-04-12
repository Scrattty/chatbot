import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, Star, Trash2, Eye, Calendar, ArrowLeft } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string | Date;
}

interface ChatHistory {
  id: string;
  userId: string;
  date: string;
  topic: string;
  messages: Message[];
}

const History = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<ChatHistory[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedConversation, setSelectedConversation] = useState<ChatHistory | null>(null);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      navigate('/signin');
      return;
    }

    const user = JSON.parse(currentUser);
    const allConversations = JSON.parse(localStorage.getItem('conversations') || '[]');
    const userConversations = allConversations
      .filter((conv: ChatHistory) => conv.userId === user.email)
      .sort((a: ChatHistory, b: ChatHistory) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setConversations(userConversations);
  }, [navigate]);

  const handleDeleteConversation = (id: string) => {
    const updatedConversations = conversations.filter(conv => conv.id !== id);
    setConversations(updatedConversations);
    localStorage.setItem('conversations', JSON.stringify(updatedConversations));
    setSelectedConversation(null);
  };

  const handleContinueConversation = (conversation: ChatHistory) => {
    // Store the complete conversation with all messages
    localStorage.setItem('currentConversation', JSON.stringify({
      ...conversation,
      messages: conversation.messages
    }));
    navigate('/chat');
  };

  const formatDate = (date: string) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const groupConversationsByDate = () => {
    const grouped: { [key: string]: ChatHistory[] } = {};
    conversations
      .filter(conv => !selectedDate || new Date(conv.date).toISOString().split('T')[0] === selectedDate)
      .forEach(conv => {
        const dateKey = formatDate(conv.date);
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(conv);
      });
    return grouped;
  };

  if (selectedConversation) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setSelectedConversation(null)}
                className="hover:bg-gray-100 p-2 rounded-full"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-semibold">Chat History</h2>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {selectedConversation.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      msg.sender === 'user' ? 'bg-[#BAE6F2]' : 'bg-gray-100'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => handleDeleteConversation(selectedConversation.id)}
                className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                Delete Chat
              </button>
              <button
                onClick={() => handleContinueConversation(selectedConversation)}
                className="px-4 py-2 bg-[#BAE6F2] hover:bg-[#A5D5E1] rounded-lg"
              >
                Continue Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Your Wellness Journey</h1>
            {conversations.length > 0 && (
              <div className="flex items-center gap-4">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#BAE6F2]"
                />
                <button 
                  onClick={() => {
                    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
                    const allConversations = JSON.parse(localStorage.getItem('conversations') || '[]');
                    const otherConversations = allConversations.filter((conv: ChatHistory) => conv.userId !== currentUser.email);
                    localStorage.setItem('conversations', JSON.stringify(otherConversations));
                    setConversations([]);
                  }}
                  className="text-red-500 hover:text-red-600"
                >
                  Clear All History
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-2 mb-6">
            <button className="flex-1 bg-[#BAE6F2] py-2 rounded-lg relative">
              Conversations
              <Star className="w-5 h-5 text-green-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
            </button>
            <Link to="/mood-tracker" className="flex-1 bg-[#BAE6F2]/50 py-2 rounded-lg text-center">
              Mood Tracker
            </Link>
          </div>

          <div className="space-y-8">
            {Object.entries(groupConversationsByDate()).map(([date, convs]) => (
              <div key={date}>
                <h3 className="text-lg font-semibold mb-4">{date}</h3>
                <div className="space-y-4">
                  {convs.map((conv) => (
                    <div
                      key={conv.id}
                      className="bg-gray-50 p-6 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => setSelectedConversation(conv)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">
                            {conv.topic}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(conv.date).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleContinueConversation(conv);
                            }}
                            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Continue Chat
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteConversation(conv.id);
                            }}
                            className="text-red-500 hover:text-red-600 p-2"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MessageCircle className="w-4 h-4" />
                        <span>{conv.messages.length} messages</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {conversations.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No conversations yet</p>
                <Link
                  to="/chat"
                  className="inline-flex items-center bg-[#BAE6F2] text-black px-6 py-3 rounded-full hover:bg-[#A5D5E1] transition-colors"
                >
                  Start a New Chat
                  <span className="ml-2">→</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;