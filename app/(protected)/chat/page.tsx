'use client';

import { useEffect, useState } from 'react';
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

  const { data: convoData, refetch: refetchConvos } = useQuery(CONVERSATIONS, {
    client: apolloClient,
  });
  const { data: msgData, refetch: refetchMsgs } = useQuery(MESSAGES, {
    variables: { withUserId: selected },
    skip: !selected,
    client: apolloClient,
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
    es.onmessage = () => {
      refetchConvos();
      if (selected) refetchMsgs();
    };
    return () => es.close();
  }, [session?.user?.id, selected, refetchConvos, refetchMsgs]);

  const handleSend = async () => {
    if (!message.trim() || !selected) return;
    await send({ variables: { recipientId: selected, content: message.trim() } });
    setMessage('');
    refetchMsgs();
  };

  const handleDelete = async (id: string) => {
    await del({ variables: { withUserId: id } });
    if (selected === id) setSelected(null);
    refetchConvos();
  };

  const conversations = convoData?.conversations ?? [];
  const messages = msgData?.messages ?? [];
  const searchResults = searchData?.searchUsers ?? [];

  return (
    <div className="flex h-full bg-white dark:bg-gray-900">
      <aside className="w-64 space-y-2 border-r p-4">
        <Input
          placeholder="Search users"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-2"
        />
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
                    handleDelete(u.id);
                  }}
                >
                  delete
                </button>
              </div>
            ))}
      </aside>
      <div className="flex flex-1 flex-col">
        <div className="flex-1 space-y-2 overflow-y-auto p-4">
          {messages.map((m: Message) => (
            <div
              key={m.id}
              className={`max-w-[70%] rounded-lg p-2 text-sm ${
                m.senderId === session?.user?.id
                  ? 'self-end bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
              }`}
            >
              {m.content}
            </div>
          ))}
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
