"use client"

import { Message } from "ai"
/**
 * Zustand store for whether the mobile menu is open or not
 */
import { create } from "zustand"

interface MobileNavStore {
    currentConversationId: string | null
    conversations: Record<string, Message[]>
    updateConversation(conversationId: string, messages: Message[]): void
    createConversation(conversationid: string): void
    setCurrentConversationId: (conversationId: string) => void
}

export const useConversationsStore = create<MobileNavStore>((set) => {

    if (!globalThis.window) {
        return {
            currentConversationId: null,
            conversations: {},
            updateConversation: () => { },
            createConversation: () => { },
            setCurrentConversationId: () => { }
        }
    }

    let parsedConversations = {}
    try {
        const initialConversations = window.localStorage.getItem('conversations')
        parsedConversations = JSON.parse(initialConversations || '{}')
    } catch (e) {
        console.error("Failed to load conversations from storage")
    }

    console.log("PARSED", parsedConversations)

    return {
        currentConversationId: new URL(window.location.href).searchParams.get('c') || null,
        conversations: parsedConversations,
        updateConversation: (conversationId, messages) => set((state) => {
            const newConversations = {
                ...state.conversations,
                [conversationId]: messages
            }
            console.log("NEW", newConversations)
            window.localStorage.setItem('conversations', JSON.stringify(newConversations))
            return { conversations: newConversations }
        }),
        createConversation: (conversationid) => set((state) => {
            const newConversations = {
                ...state.conversations,
                [conversationid]: []
            }
            console.log("NEW", newConversations)
            window.localStorage.setItem('conversations', JSON.stringify(newConversations))
            return { conversations: newConversations }
        }),
        setCurrentConversationId: (conversationId) => set({ currentConversationId: conversationId })
    }
})
