import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Send,
  User,
  MessageCircle,
  X,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { chatAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { ChatConversation, User as UserType } from "../../types";
import toast from "react-hot-toast";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
}

const ChatSection: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeChat, setActiveChat] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserType[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (activeChat) {
      fetchMessages();
      // Poll for new messages every 5 seconds to reduce server load
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [activeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      const response = await chatAPI.getConversations(user!.id);
      setConversations(response.data);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    }
  };

  const fetchMessages = async () => {
    if (!activeChat) return;

    try {
      const response = await chatAPI.getMessages(user!.id, activeChat.id);
      setMessages(response.data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await chatAPI.findUser(query);
      // Filter out current user from results
      const filteredResults = response.data.filter(
        (u: UserType) => u.id !== user!.id
      );
      setSearchResults(filteredResults);
    } catch (error) {
      toast.error("Failed to search users");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = (selectedUser: UserType) => {
    // Check if conversation already exists
    const existingConversation = conversations.find(
      (conv) => conv.id === selectedUser.id
    );

    if (existingConversation) {
      setActiveChat(existingConversation);
    } else {
      // Create new conversation object
      const newConversation: ChatConversation = {
        id: selectedUser.id,
        username: selectedUser.username,
        email: selectedUser.email,
        role: selectedUser.role,
        lastMessage: "",
        lastMessageTime: new Date(),
        unreadCount: 0,
        isLastMessageFromMe: false,
      };
      setActiveChat(newConversation);
    }

    setShowSearch(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChat || sendingMessage) return;

    setSendingMessage(true);
    try {
      await chatAPI.sendMessage({
        senderId: user!.id,
        receiverId: activeChat.id,
        message: newMessage.trim(),
      });

      setNewMessage("");

      // Refresh conversations and messages
      await Promise.all([fetchConversations(), fetchMessages()]);

      toast.success("Message sent!");
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 168) {
      // 7 days
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "PROFESSOR":
        return "text-blue-600";
      case "ALUMNI":
        return "text-purple-600";
      case "STUDENT":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "PROFESSOR":
        return "bg-blue-100 text-blue-800";
      case "ALUMNI":
        return "bg-purple-100 text-purple-800";
      case "STUDENT":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar - Conversations List */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Messages</h2>
            <button
              onClick={() => setShowSearch(true)}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              title="Start new chat"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Search Modal */}
          {showSearch && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Start New Chat
                    </h3>
                    <button
                      onClick={() => {
                        setShowSearch(false);
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        searchUsers(e.target.value);
                      }}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Search by email or username..."
                      autoFocus
                    />
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto">
                  {loading ? (
                    <div className="p-4 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-sm text-gray-600">Searching...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="p-2">
                      {searchResults.map((searchUser) => (
                        <button
                          key={searchUser.id}
                          onClick={() => startNewChat(searchUser)}
                          className="w-full p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                              <User className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center">
                                <p className="font-medium text-gray-900">
                                  {searchUser.username}
                                </p>
                                <span
                                  className={`ml-2 px-2 py-1 text-xs rounded-full ${getRoleBadge(
                                    searchUser.role
                                  )}`}
                                >
                                  {searchUser.role}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {searchUser.email}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : searchQuery && !loading ? (
                    <div className="p-4 text-center text-gray-500">
                      <User className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p>No users found</p>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p>Search for users to start chatting</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No conversations yet
              </h3>
              <p className="text-gray-600 mb-4">
                Start a new chat to begin messaging
              </p>
              <button
                onClick={() => setShowSearch(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start New Chat
              </button>
            </div>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setActiveChat(conversation)}
                className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                  activeChat?.id === conversation.id
                    ? "bg-blue-50 border-r-2 border-blue-500"
                    : ""
                }`}
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <p className="font-medium text-gray-900 truncate">
                          {conversation.username}
                        </p>
                        <span
                          className={`ml-2 px-2 py-1 text-xs rounded-full ${getRoleBadge(
                            conversation.role
                          )}`}
                        >
                          {conversation.role}
                        </span>
                      </div>
                      {conversation.lastMessageTime && (
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.lastMessageTime.toString())}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage || "No messages yet"}
                      </p>
                      {conversation.unreadCount &&
                        conversation.unreadCount > 0 && (
                          <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-gray-200">
              <div className="flex items-center">
                <button
                  onClick={() => setActiveChat(null)}
                  className="mr-3 p-1 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <div className="flex items-center">
                    <h3 className="font-semibold text-gray-900">
                      {activeChat.username}
                    </h3>
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded-full ${getRoleBadge(
                        activeChat.role
                      )}`}
                    >
                      {activeChat.role}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{activeChat.email}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === user!.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === user!.id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.senderId === user!.id
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Type a message..."
                  disabled={sendingMessage}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sendingMessage}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {sendingMessage ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          /* No Chat Selected */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Welcome to SmartEval Chat
              </h3>
              <p className="text-gray-600 mb-6">
                Select a conversation to start messaging
              </p>
              <button
                onClick={() => setShowSearch(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start New Chat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSection;
