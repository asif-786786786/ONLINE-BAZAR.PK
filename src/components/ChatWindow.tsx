import React, { useState, useEffect, useRef } from 'react';
import { Send, X, User, MessageCircle } from 'lucide-react';
import { 
  collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, 
  where, doc, updateDoc 
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Chat, Message, OperationType } from '../types';
import { handleFirestoreError } from '../utils';
import { formatDistanceToNow } from 'date-fns';

interface ChatWindowProps {
  chat: Chat;
  onClose: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ chat, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'chats', chat.id, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(msgs);
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }, 100);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `chats/${chat.id}/messages`);
    });

    return () => unsubscribe();
  }, [chat.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !auth.currentUser) return;

    try {
      const msgData = {
        chatId: chat.id,
        senderId: auth.currentUser.uid,
        text: newMessage.trim(),
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'chats', chat.id, 'messages'), msgData);
      await updateDoc(doc(db, 'chats', chat.id), {
        lastMessage: newMessage.trim(),
        updatedAt: serverTimestamp(),
      });
      setNewMessage('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `chats/${chat.id}/messages`);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 sm:w-96 bg-white rounded-t-2xl shadow-2xl border border-gray-200 flex flex-col h-[500px] z-[60]">
      <div className="p-4 bg-emerald-600 text-white rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-emerald-500 rounded-full">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Chat with Seller</h3>
            <p className="text-xs opacity-80">Active now</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-emerald-700 rounded-full transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => {
          const isMe = msg.senderId === auth.currentUser?.uid;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                isMe ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
              }`}>
                <p>{msg.text}</p>
                <p className={`text-[10px] mt-1 ${isMe ? 'text-emerald-100' : 'text-gray-400'}`}>
                  {msg.createdAt ? formatDistanceToNow(new Date((msg.createdAt as any).toDate())) + ' ago' : 'Sending...'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
          />
          <button 
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};
