# Real-time Messaging Feature

This implementation provides a complete real-time messaging system between guests and hosts.

## Features

- ✅ **Real-time messaging** - Messages update every 3 seconds using polling
- ✅ **Conversation management** - Automatic conversation creation when guest contacts host
- ✅ **Unread message tracking** - Badge counters in navigation showing unread count
- ✅ **Message history** - Full conversation history with timestamps
- ✅ **Read receipts** - Track when messages are read
- ✅ **Responsive UI** - Works on desktop and mobile

## Database Schema

### Conversation Model

```prisma
model Conversation {
  id           String    @id @default(cuid())
  listingId    String
  guestId      String
  hostId       String
  lastMessage  String?
  lastMessageAt DateTime?
  guestUnreadCount Int @default(0)
  hostUnreadCount  Int @default(0)
  messages Message[]
  // ... relations
}
```

### Message Model

```prisma
model Message {
  id             String       @id @default(cuid())
  conversationId String
  senderId       String
  content        String       @db.Text
  isRead         Boolean      @default(false)
  readAt         DateTime?
  // ... relations
}
```

## API Endpoints

### Server Actions

- `getConversations()` - Get all conversations for current user
- `getConversation(id)` - Get specific conversation details
- `getOrCreateConversation(listingId)` - Create or retrieve conversation for a listing
- `getMessages(conversationId)` - Get all messages in a conversation
- `sendMessage(conversationId, content)` - Send a new message
- `markMessagesAsRead(conversationId)` - Mark all messages as read

### API Routes

- `GET /api/messages/poll` - Poll for new messages (real-time updates)
- `GET /api/messages/unread-count` - Get total unread message count

## Components

### MessagesDialog

Full-featured chat dialog with:

- Real-time message polling
- Send messages with Enter key
- Auto-scroll to latest message
- Loading states
- User avatars

### MessagesInbox

Inbox page showing all conversations:

- List of conversations sorted by last message
- Unread badges
- Listing thumbnails
- Relative timestamps

### ContactHostButton

Button component to initiate conversation:

```tsx
<ContactHostButton listingId={listing.id} hostName={listing.user.name} />
```

## Hooks

### useMessagesDialog

```tsx
const { open, close, isOpen } = useMessagesDialog();

// Open with existing conversation
open(conversationId);

// Open with listing (creates conversation)
open(undefined, listingId);
```

### useUnreadMessageCount

```tsx
const unreadCount = useUnreadMessageCount();
// Returns total unread count, updates every 10 seconds
```

## Usage

### 1. View Messages Inbox

Navigate to `/messages` to see all conversations

### 2. Contact a Host

On any listing page, click "Contact Host" button (only visible to non-hosts)

### 3. Real-time Updates

Messages automatically update every 3 seconds while chat is open
Unread count badge updates every 10 seconds in navigation

### 4. Navigation Badge

The Messages menu item shows unread count badge when there are new messages

## Implementation Details

### Real-time Strategy

The system uses **polling** for real-time updates:

- Message polling: Every 3 seconds when chat is open
- Unread count polling: Every 10 seconds globally

**Why polling over WebSockets?**

- Simpler implementation with Next.js App Router
- No additional server infrastructure needed
- Sufficient for typical messaging use cases
- Easy to upgrade to WebSockets/SSE later if needed

### Message Read Tracking

- Messages are marked as read when conversation is opened
- Unread counters are separate for guest and host
- Read receipts show when messages were read

### Performance Optimizations

- Only new messages are fetched using timestamp filtering
- Conversations are cached client-side
- Efficient database indexes on conversation and message queries

## Future Enhancements

Possible improvements:

1. **WebSocket integration** for true real-time (using Socket.io or Pusher)
2. **Push notifications** for new messages
3. **Message attachments** (images, files)
4. **Typing indicators**
5. **Message reactions** (emoji reactions)
6. **Message search**
7. **Conversation archiving**
8. **Block/Report users**
9. **Message templates** for hosts
10. **Auto-responses** for common questions

## Files Added

### Database

- `prisma/schema.prisma` - Added Conversation and Message models

### Server Actions

- `src/actions/messages/get-conversations.ts`
- `src/actions/messages/get-conversation.ts`
- `src/actions/messages/get-or-create-conversation.ts`
- `src/actions/messages/get-messages.ts`
- `src/actions/messages/send-message.ts`
- `src/actions/messages/mark-as-read.ts`

### API Routes

- `src/app/api/messages/poll/route.ts`
- `src/app/api/messages/unread-count/route.ts`

### Pages

- `src/app/(protected)/messages/page.tsx`

### Components

- `src/components/messages/MessagesDialog.tsx`
- `src/components/messages/MessagesInbox.tsx`
- `src/components/messages/ContactHostButton.tsx`

### Hooks

- `src/hooks/use-messages-dialog.ts`
- `src/hooks/use-unread-message-count.ts`

### Modified Files

- `src/app/layout.tsx` - Added MessagesDialog globally
- `src/components/desktop/Menu.tsx` - Added unread badge to Messages link
- `src/app/(public)/listings/[id]/ListingClient.tsx` - Added Contact Host button
