# APIs & Networking Integration - REST, GraphQL & WebSockets

This document describes the configurations, client setups, and integration details for REST, GraphQL, and WebSockets inside our application.

All features are sandbox-demonstrated in the **APIs Playground Screen** ([APIsPlaygroundScreen.tsx](file:///Users/ajay/Documents/ReactNativeAppProduction/src/screens/Home/APIsPlaygroundScreen.tsx)).

---

## 1. REST API - Error Handling & Backoff Auto-Retries

To achieve a production-grade REST fetching integration, we implemented a custom fetch wrapper that handles:
1. **HTTP Error Checks**: Validates response statuses (`response.ok`) and throws descriptive errors.
2. **Auto-Retries with Exponential Backoff**:
   - If a request fails (due to timeout or server drops), it automatically schedules a retry.
   - Applies an exponential backoff formula (`Math.pow(2, attempt) * 500ms`) so retries occur progressively later (e.g. 500ms, 1000ms, 2000ms), giving the server time to recover.
   - Throws a final error after reaching a maximum limit (e.g., 3 retries).

```typescript
const executeFetch = async (attempt: number): Promise<RestPost[]> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (err) {
    if (attempt < maxRetries) {
      const backoffTime = Math.pow(2, attempt) * 500;
      await new Promise(resolve => setTimeout(resolve, backoffTime));
      return executeFetch(attempt + 1);
    }
    throw err;
  }
};
```

---

## 2. GraphQL Basics (Apollo Client)

We use **Apollo Client** to communicate with GraphQL endpoints.

### Setup
1. Define a client instance with caches:
   ```typescript
   import { ApolloClient, InMemoryCache } from '@apollo/client';

   const apolloClient = new ApolloClient({
     uri: 'https://rickandmortyapi.com/graphql',
     cache: new InMemoryCache(),
   });
   ```
2. Wrap components inside the provider:
   ```typescript
   import { ApolloProvider } from '@apollo/client';

   <ApolloProvider client={apolloClient}>
     <MyGraphQLScreen />
   </ApolloProvider>
   ```

### Executing Queries with Variables
Write a standard GraphQL query schema and execute it using the `useQuery` hook:
```graphql
const GET_CHARACTERS = gql`
  query GetCharacters($name: String!) {
    characters(filter: { name: $name }) {
      results {
        id
        name
        status
        image
      }
    }
  }
`;
```
Query it reactively in components:
```typescript
const { data, loading, error } = useQuery(GET_CHARACTERS, {
  variables: { name: searchString },
});
```

---

## 3. WebSockets (Real-time Stream)

WebSockets enable persistent, two-way duplex communication between client and server.

### Life Cycle Management
We establish connections inside a component's lifecycle hooks to ensure sockets are cleaned up on unmount:

```typescript
useEffect(() => {
  const ws = new WebSocket('wss://ws.postman-echo.com/raw');
  
  ws.onopen = () => setStatus('Connected');
  
  ws.onmessage = (event) => {
    // Receive message
    console.log('Received:', event.data);
  };
  
  ws.onclose = () => setStatus('Disconnected');

  return () => {
    ws.close(); // Clean up on unmount!
  };
}, []);
```

### Sending Messages
```typescript
ws.send(messageString);
```
