// URL utility functions for handling conversation routing
export const getConversationIdFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('conversation_id');
};

export const setConversationIdInUrl = (conversationId: string): void => {
  const url = new URL(window.location.href);
  url.searchParams.set('conversation_id', conversationId);
  window.history.pushState({}, '', url.toString());
};

export const removeConversationIdFromUrl = (): void => {
  const url = new URL(window.location.href);
  url.searchParams.delete('conversation_id');
  window.history.pushState({}, '', url.toString());
};

export const isDirectConversationAccess = (): boolean => {
  return getConversationIdFromUrl() !== null;
};