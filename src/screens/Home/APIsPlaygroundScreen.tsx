import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  gql,
} from '@apollo/client';
import { ApolloProvider, useQuery } from '@apollo/client/react';
import { Image } from 'expo-image';
import { useTheme } from '../../context/ThemeContext';

// ----------------------------------------------------
// Apollo GraphQL Client Setup
// ----------------------------------------------------
const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: 'https://rickandmortyapi.com/graphql' }),
  cache: new InMemoryCache(),
});

// GraphQL Query Schema
const GET_CHARACTERS = gql`
  query GetCharacters($name: String!) {
    characters(filter: { name: $name }) {
      results {
        id
        name
        status
        species
        image
      }
    }
  }
`;

// Exported interfaces for object shapes (Per user rule preference)
export interface Character {
  id: string;
  name: string;
  status: string;
  species: string;
  image: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  timestamp: string;
  sender: 'user' | 'server';
}

export interface RestPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

// ----------------------------------------------------
// Sub-Component: GraphQL Characters Search Tab
// ----------------------------------------------------
const GraphQLTabContent: React.FC = () => {
  const { theme } = useTheme();
  const [searchName, setSearchName] = useState('Rick');

  const { data, loading, error, refetch } = useQuery<{ characters: { results: Character[] } }>(GET_CHARACTERS, {
    variables: { name: searchName },
    client: apolloClient,
  });

  const handleSearchChange = (text: string) => {
    setSearchName(text);
  };

  const renderCharacter = ({ item }: { item: Character }) => (
    <View style={[styles.itemCard, { backgroundColor: theme.background, borderColor: theme.cardBorder }]}>
      <Image
        source={{ uri: item.image }}
        style={styles.avatarImage}
        contentFit="cover"
        transition={200}
        cachePolicy="disk"
      />
      <View style={styles.itemMeta}>
        <Text style={[styles.itemTitle, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
        <Text style={[styles.itemSubtitle, { color: theme.textMuted }]}>{item.species} • {item.status}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.tabContainer}>
      <Text style={[styles.playgroundLabel, { color: theme.primary }]}> Rick & Morty GraphQL Search</Text>
      <Text style={[styles.playgroundDesc, { color: theme.textMuted }]}>
        Queries public GraphQL server using Apollo Client bindings with reactive query variables.
      </Text>

      <TextInput
        style={[styles.inputBox, { backgroundColor: theme.card, color: theme.text, borderColor: theme.cardBorder }]}
        value={searchName}
        onChangeText={handleSearchChange}
        placeholder="Type character name (e.g. Rick, Morty)..."
        placeholderTextColor={theme.textMuted}
      />

      {loading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="small" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textMuted }]}>Querying GraphQL server...</Text>
        </View>
      )}

      {error && (
        <View style={[styles.statusAlert, { backgroundColor: theme.error + '15', borderColor: theme.error }]}>
          <Text style={{ color: theme.error, fontWeight: '700' }}>GraphQL Fetch Error</Text>
          <Text style={{ color: theme.text, fontSize: 13, marginTop: 4 }}>{error.message}</Text>
          <TouchableOpacity style={[styles.retryBtn, { backgroundColor: theme.error }]} onPress={() => refetch()}>
            <Text style={styles.retryBtnText}>Retry Query</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && data?.characters?.results && (
        <FlatList
          data={data.characters.results.slice(0, 10)}
          renderItem={renderCharacter}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>No characters found.</Text>
          }
        />
      )}
    </View>
  );
};

// ----------------------------------------------------
// Sub-Component: REST Error & Retry Tab
// ----------------------------------------------------
const RestTabContent: React.FC = () => {
  const { theme } = useTheme();
  const [data, setData] = useState<RestPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);
  const [retryAttempt, setRetryAttempt] = useState(0);

  // REST API request helper with exponential backoff retry mechanism
  const fetchRestData = useCallback(async (shouldFail: boolean, maxRetries = 3) => {
    setLoading(true);
    setErrorInfo(null);
    setData([]);
    setRetryAttempt(0);

    const url = shouldFail
      ? 'https://jsonplaceholder.typicode.com/invalid-endpoint-for-error-handling'
      : 'https://jsonplaceholder.typicode.com/posts?_limit=3';

    const executeFetch = async (attempt: number): Promise<RestPost[]> => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP Error Status: ${response.status}`);
        }
        return await response.json();
      } catch (err: any) {
        if (attempt < maxRetries) {
          setRetryAttempt(attempt + 1);
          // Wait exponentially: 500ms, 1000ms, 2000ms
          const backoffTime = Math.pow(2, attempt) * 500;
          await new Promise<void>((resolve) => setTimeout(() => resolve(), backoffTime));
          return executeFetch(attempt + 1);
        }
        throw err;
      }
    };

    try {
      const posts = await executeFetch(0);
      setData(posts);
    } catch (err: any) {
      setErrorInfo(err.message || 'Network request failed.');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ScrollView style={styles.tabContainer} contentContainerStyle={{ paddingBottom: 20 }}>
      <Text style={[styles.playgroundLabel, { color: theme.primary }]}>REST API Error Handling & Retries</Text>
      <Text style={[styles.playgroundDesc, { color: theme.textMuted }]}>
        Simulates standard REST integration. Supports exponential backoff auto-retries on endpoint failure.
      </Text>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: theme.primary }]}
          onPress={() => fetchRestData(false)}
          disabled={loading}
        >
          <Text style={[styles.actionBtnText, { color: theme.background }]}>Fetch Success</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: theme.error }]}
          onPress={() => fetchRestData(true)}
          disabled={loading}
        >
          <Text style={[styles.actionBtnText, { color: theme.background }]}>Fetch Fail (Retry)</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="small" color={theme.primary} />
          {retryAttempt > 0 ? (
            <Text style={[styles.loadingText, { color: theme.textMuted }]}>
              Attempt {retryAttempt} failed. Retrying in {Math.pow(2, retryAttempt - 1) * 500}ms...
            </Text>
          ) : (
            <Text style={[styles.loadingText, { color: theme.textMuted }]}>Executing fetch...</Text>
          )}
        </View>
      )}

      {errorInfo && (
        <View style={[styles.statusAlert, { backgroundColor: theme.error + '15', borderColor: theme.error }]}>
          <Text style={{ color: theme.error, fontWeight: '700' }}>REST Fetch Failed</Text>
          <Text style={{ color: theme.text, fontSize: 13, marginTop: 4 }}>{errorInfo}</Text>
          <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 6, fontStyle: 'italic' }}>
            Auto-retry limit of 3 exceeded.
          </Text>
        </View>
      )}

      {data.length > 0 && (
        <View style={styles.resultsWrapper}>
          <Text style={[styles.resultsTitle, { color: theme.text }]}>Fetch Result (Success)</Text>
          {data.map((post) => (
            <View key={post.id} style={[styles.itemCard, { backgroundColor: theme.background, borderColor: theme.cardBorder }]}>
              <View style={styles.itemMeta}>
                <Text style={[styles.itemTitle, { color: theme.primary }]} numberOfLines={1}>{post.title}</Text>
                <Text style={[styles.itemSubtitle, { color: theme.text }]} numberOfLines={2}>{post.body}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

// ----------------------------------------------------
// Sub-Component: WebSockets Chat Tab
// ----------------------------------------------------
const WebSocketsTabContent: React.FC = () => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [status, setStatus] = useState<'Disconnected' | 'Connecting' | 'Connected'>('Disconnected');
  const socketRef = useRef<WebSocket | null>(null);

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    setStatus('Disconnected');
  }, []);

  const connectSocket = useCallback(() => {
    disconnectSocket();
    setStatus('Connecting');

    try {
      // Connect to public WebSocket echo endpoint
      const ws = new WebSocket('wss://ws.postman-echo.com/raw');
      socketRef.current = ws;

      ws.onopen = () => {
        setStatus('Connected');
      };

      ws.onmessage = (event) => {
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          text: event.data,
          timestamp: new Date().toLocaleTimeString(),
          sender: 'server',
        };
        setMessages((prev) => [...prev, newMessage]);
      };

      ws.onerror = (e) => {
        console.warn('[WebSocket Error]', e);
        setStatus('Disconnected');
      };

      ws.onclose = () => {
        setStatus('Disconnected');
      };
    } catch (err) {
      console.warn('[WebSocket Init Error]', err);
      setStatus('Disconnected');
    }
  }, [disconnectSocket]);

  useEffect(() => {
    // Automatically connect on mount
    connectSocket();
    return () => {
      disconnectSocket();
    };
  }, [connectSocket, disconnectSocket]);

  const handleSendMessage = () => {
    if (!inputVal.trim() || !socketRef.current || status !== 'Connected') return;

    const userMsg: ChatMessage = {
      id: Date.now().toString() + '-user',
      text: inputVal,
      timestamp: new Date().toLocaleTimeString(),
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMsg]);
    socketRef.current.send(inputVal);
    setInputVal('');
  };

  const renderMessageItem = ({ item }: { item: ChatMessage }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.chatBubbleRow, isUser ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }]}>
        <View
          style={[
            styles.chatBubble,
            isUser
              ? { backgroundColor: theme.primary, borderBottomRightRadius: 2 }
              : { backgroundColor: theme.card, borderColor: theme.cardBorder, borderWidth: 1, borderBottomLeftRadius: 2 },
          ]}
        >
          <Text style={[styles.chatBubbleText, isUser ? { color: theme.background } : { color: theme.text }]}>
            {item.text}
          </Text>
          <Text style={[styles.chatBubbleTime, isUser ? { color: theme.background + '99' } : { color: theme.textMuted }]}>
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.tabContainer}>
      <Text style={[styles.playgroundLabel, { color: theme.primary }]}>WebSockets Real-time Echo Chat</Text>
      <Text style={[styles.playgroundDesc, { color: theme.textMuted }]}>
        Establishes a duplex WebSocket stream. Sending messages echoes them back in real time.
      </Text>

      <View style={styles.statusPanel}>
        <Text style={[styles.statusIndicatorLabel, { color: theme.text }]}>
          Status: <Text style={{ color: status === 'Connected' ? '#10B981' : status === 'Connecting' ? '#F59E0B' : theme.error, fontWeight: '800' }}>{status}</Text>
        </Text>
        <TouchableOpacity
          style={[styles.connectionBtn, { backgroundColor: status === 'Connected' ? theme.error : theme.primary }]}
          onPress={status === 'Connected' ? disconnectSocket : connectSocket}
        >
          <Text style={[styles.connectionBtnText, { color: theme.background }]}>
            {status === 'Connected' ? 'Disconnect' : 'Connect'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatListContainer}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.textMuted }]}>No real-time messages yet.</Text>
        }
      />

      <View style={styles.chatInputRow}>
        <TextInput
          style={[styles.chatInput, { backgroundColor: theme.card, color: theme.text, borderColor: theme.cardBorder }]}
          value={inputVal}
          onChangeText={setInputVal}
          placeholder={status === 'Connected' ? 'Type message to echo...' : 'Connect to chat...'}
          placeholderTextColor={theme.textMuted}
          editable={status === 'Connected'}
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: theme.primary }, status !== 'Connected' && { opacity: 0.5 }]}
          onPress={handleSendMessage}
          disabled={status !== 'Connected'}
        >
          <Text style={[styles.sendBtnText, { color: theme.background }]}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ----------------------------------------------------
// Main Component Screen (Tab Manager)
// ----------------------------------------------------
export const APIsPlaygroundScreen: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'REST' | 'GraphQL' | 'WebSockets'>('REST');

  return (
    <ApolloProvider client={apolloClient}>
      <View style={[styles.mainScreenContainer, { backgroundColor: theme.background }]}>
        {/* Navigation Tabs */}
        <View style={[styles.tabsRow, { borderBottomColor: theme.cardBorder }]}>
          {(['REST', 'GraphQL', 'WebSockets'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabButton, isActive && { borderBottomColor: theme.primary, borderBottomWidth: 3 }]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    { color: isActive ? theme.primary : theme.textMuted, fontWeight: isActive ? '700' : '500' },
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Tab Content Display */}
        <View style={styles.contentArea}>
          {activeTab === 'REST' && <RestTabContent />}
          {activeTab === 'GraphQL' && <GraphQLTabContent />}
          {activeTab === 'WebSockets' && <WebSocketsTabContent />}
        </View>
      </View>
    </ApolloProvider>
  );
};

const styles = StyleSheet.create({
  mainScreenContainer: {
    flex: 1,
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
  },
  tabButton: {
    paddingVertical: 14,
    flex: 1,
    alignItems: 'center',
  },
  tabButtonText: {
    fontSize: 15,
  },
  contentArea: {
    flex: 1,
  },
  tabContainer: {
    flex: 1,
    padding: 16,
  },
  playgroundLabel: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  playgroundDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  inputBox: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    fontSize: 15,
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },
  centerContainer: {
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 13,
  },
  statusAlert: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  retryBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E2E8F0',
  },
  itemMeta: {
    marginLeft: 12,
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  itemSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionBtn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  actionBtnText: {
    fontWeight: '600',
    fontSize: 14,
  },
  resultsWrapper: {
    marginTop: 10,
  },
  resultsTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  statusPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIndicatorLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  connectionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  connectionBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  chatListContainer: {
    flexGrow: 1,
    paddingVertical: 10,
  },
  chatBubbleRow: {
    flexDirection: 'row',
    marginBottom: 8,
    width: '100%',
  },
  chatBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 12,
  },
  chatBubbleText: {
    fontSize: 14,
    lineHeight: 18,
  },
  chatBubbleTime: {
    fontSize: 9,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  chatInput: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 14,
    marginRight: 10,
  },
  sendBtn: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnText: {
    fontWeight: '700',
    fontSize: 14,
  },
});
