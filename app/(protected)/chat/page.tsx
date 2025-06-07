'use client';

import { useEffect, useState, useRef } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { apolloClient } from '@/lib/apollo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';

type User = { id: string; firstName: string; lastName: string; email: string };
type Message = {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  createdAt: string;
};

const CONVERSATIONS = gql`
  query Conversations {
    conversations {
      id
      firstName
      lastName
      email
    }
  }
`;

const MESSAGES = gql`
  query Messages($withUserId: ID!) {
    messages(withUserId: $withUserId) {
      id
      senderId
      recipientId
      content
      createdAt
    }
  }
`;

const SEARCH_USERS = gql`
  query SearchUsers($term: String!) {
    searchUsers(term: $term) {
      id
      firstName
      lastName
      email
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($recipientId: ID!, $content: String!) {
    sendMessage(recipientId: $recipientId, content: $content) {
      id
      senderId
      recipientId
      content
      createdAt
    }
  }
`;

const DELETE_CONVO = gql`
  mutation DeleteConversation($withUserId: ID!) {
    deleteConversation(withUserId: $withUserId)
  }
`;

export default function ChatPage() {
  const { data: session } = useSession();
  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { data: convoData, refetch: refetchConvos } = useQuery(CONVERSATIONS, {
    client: apolloClient,
  });
  const { data: msgData } = useQuery(MESSAGES, {
    variables: { withUserId: selected },
    skip: !selected,
    client: apolloClient,
    // Poll every second so new messages show up even if the SSE misses them
    pollInterval: 1000,
  });
  const { data: searchData } = useQuery(SEARCH_USERS, {
    variables: { term: search },
    skip: !search,
    client: apolloClient,
  });

  const [send] = useMutation(SEND_MESSAGE, { client: apolloClient });
  const [del] = useMutation(DELETE_CONVO, { client: apolloClient });

  useEffect(() => {
    if (!session?.user?.id) return;
    const es = new EventSource(`/api/chat/stream?userId=${session.user.id}`);
    es.onmessage = (e) => {
      const msg: Message = JSON.parse(e.data);
      refetchConvos();
      if (msg.senderId === selected || msg.recipientId === selected) {
        setMessages((prev) =>
          prev.some((m) => m.id === msg.id) ? prev : [...prev, msg],
        );
      }
    };
    return () => es.close();
    // Keep this effect stable so we don't reopen the stream unnecessarily
  }, [session?.user?.id, refetchConvos]);

  useEffect(() => {
    if (msgData?.messages) setMessages(msgData.messages);
  }, [msgData]);

  useEffect(() => {
    if (!selected) setMessages([]);
  }, [selected]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages, selected]);

  const handleSend = async () => {
    if (!message.trim() || !selected) return;
    const { data } = await send({
      variables: { recipientId: selected, content: message.trim() },
    });
    if (data?.sendMessage) {
      setMessages((prev) => {
        return prev.some((m) => m.id === data.sendMessage.id)
          ? prev
          : [...prev, data.sendMessage];
      });
    }
    setMessage('');
  };

  const handleDelete = async (id: string) => {
    await del({ variables: { withUserId: id } });
    if (selected === id) setSelected(null);
    refetchConvos();
  };

  const conversations = convoData?.conversations ?? [];
  const searchResults = searchData?.searchUsers ?? [];
  const selectedUser =
    conversations.find((u: User) => u.id === selected) ??
    searchResults.find((u: User) => u.id === selected) ??
    null;

  useEffect(() => {
    if (selectedUser) {
      document.title = `${selectedUser.firstName} ${selectedUser.lastName} - Chat`;
    } else {
      document.title = 'Chat';
    }
  }, [selectedUser]);

  return (
    <div className="flex h-[calc(93vh)] overflow-hidden border-2 bg-white pt-5 dark:bg-gray-900">
      <aside className="flex h-full w-64 flex-col border-r p-4">
        <Input
          placeholder="Search users"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-2"
        />
        <div className="flex-1 space-y-2 overflow-y-auto">
          {search
            ? searchResults.map((u: User) => (
                <div
                  key={u.id}
                  className={`cursor-pointer rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    selected === u.id ? 'bg-blue-500 text-white' : ''
                  }`}
                  onClick={() => {
                    setSelected(u.id);
                    setSearch('');
                  }}
                >
                  {u.firstName} {u.lastName}
                </div>
              ))
            : conversations.map((u: User) => (
                <div
                  key={u.id}
                  className={`flex items-center justify-between rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    selected === u.id ? 'bg-blue-500 text-white' : ''
                  }`}
                  onClick={() => setSelected(u.id)}
                >
                  <span>
                    {u.firstName} {u.lastName}
                  </span>
                  <button
                    className="ml-2 text-xs text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete this conversation?')) {
                        handleDelete(u.id);
                      }
                    }}
                  >
                    X
                  </button>
                </div>
              ))}
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <div className="flex h-12 items-center border-b p-4 text-lg font-semibold">
          {selectedUser ? (
            <h2>
              {selectedUser.firstName} {selectedUser.lastName}
            </h2>
          ) : (
            <span>Select a conversation</span>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-end space-y-2 overflow-y-auto border p-4">
          {messages.map((m: Message) => (
            <div
              key={m.id}
              className={`flex ${m.senderId === session?.user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-2 text-sm ${
                  m.senderId === session?.user?.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {selected && (
          <div className="flex items-center gap-2 border-t p-4">
            <Input
              className="flex-1"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
            />
            <Button onClick={handleSend}>Send</Button>
          </div>
        )}
      </div>
    </div>
  );
}
