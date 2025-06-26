// URL utility functions for handling conversation routing
export const getConversationIdFromUrl = (): string | null => {
  const path = window.location.pathname;
  // Remove leading slash and check if it's a valid conversation ID format
  const pathSegment = path.substring(1);
  
  // More flexible validation: conversation IDs can be various formats
  // Accept alphanumeric strings with minimum length of 8 characters
  const conversationIdPattern = /^[a-zA-Z0-9_-]{8,}$/;
  
  if (pathSegment && conversationIdPattern.test(pathSegment)) {
    return pathSegment;
  }
  
  return null;
};

export const setConversationIdInUrl = (conversationId: string): void => {
  const newUrl = `/${conversationId}`;
  window.history.pushState({}, '', newUrl);
};

export const removeConversationIdFromUrl = (): void => {
  window.history.pushState({}, '', '/');
};

export const isDirectConversationAccess = (): boolean => {
  return getConversationIdFromUrl() !== null;
};

export const isBogusConversationUrl = (): boolean => {
  const path = window.location.pathname;
  const pathSegment = path.substring(1);
  
  // Check if there's a path segment but it doesn't match valid conversation ID format
  if (pathSegment && pathSegment !== '') {
    const conversationIdPattern = /^[a-zA-Z0-9_-]{8,}$/;
    return !conversationIdPattern.test(pathSegment);
  }
  
  return false;
};

export const getBogusConversationId = (): string | null => {
  const path = window.location.pathname;
  const pathSegment = path.substring(1);
  
  if (pathSegment && pathSegment !== '') {
    const conversationIdPattern = /^[a-zA-Z0-9_-]{8,}$/;
    if (!conversationIdPattern.test(pathSegment)) {
      return pathSegment;
    }
  }
  
  return null;
};

export const navigateToConversation = (conversationId: string): void => {
  window.location.href = `/${conversationId}`;
};

export const navigateToHome = (): void => {
  window.location.href = '/';
};