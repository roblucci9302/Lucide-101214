/**
 * Conversation Bridge - IPC handlers for agents, history, ask, and listen features
 */
const { ipcMain } = require('electron');
const authService = require('../../features/common/services/authService');
const agentProfileService = require('../../features/common/services/agentProfileService');
const conversationHistoryService = require('../../features/common/services/conversationHistoryService');
const askService = require('../../features/ask/askService');
const listenService = require('../../features/listen/listenService');

module.exports = {
    initialize() {
        // Agent Profiles
        ipcMain.handle('agent:get-available-profiles', () => agentProfileService.getAvailableProfiles());
        ipcMain.handle('agent:get-active-profile', () => agentProfileService.getCurrentProfile());
        ipcMain.handle('agent:set-active-profile', async (event, profileId) => {
            const userId = authService.getCurrentUserId();
            const success = await agentProfileService.setActiveProfile(userId, profileId);
            return { success };
        });

        // Conversation History (Phase 2)
        ipcMain.handle('history:get-all-sessions', async (event, options) => {
            const userId = authService.getCurrentUserId();
            return await conversationHistoryService.getAllSessions(userId, options);
        });
        ipcMain.handle('history:search-sessions', async (event, query, filters) => {
            const userId = authService.getCurrentUserId();
            return await conversationHistoryService.searchSessions(userId, query, filters);
        });
        ipcMain.handle('history:get-session-messages', async (event, sessionId) => {
            return await conversationHistoryService.getSessionMessages(sessionId);
        });
        ipcMain.handle('history:get-stats', async () => {
            const userId = authService.getCurrentUserId();
            return await conversationHistoryService.getSessionStats(userId);
        });
        ipcMain.handle('history:update-metadata', async (event, sessionId, metadata) => {
            return await conversationHistoryService.updateSessionMetadata(sessionId, metadata);
        });
        ipcMain.handle('history:delete-session', async (event, sessionId) => {
            return await conversationHistoryService.deleteSession(sessionId);
        });
        ipcMain.handle('history:generate-title', async (event, sessionId) => {
            return await conversationHistoryService.generateTitleFromContent(sessionId);
        });

        // Ask Feature
        ipcMain.handle('ask:sendQuestionFromAsk', async (event, userPrompt) => await askService.sendMessage(userPrompt));
        ipcMain.handle('ask:sendQuestionFromSummary', async (event, userPrompt) => await askService.sendMessage(userPrompt));
        ipcMain.handle('ask:toggleAskButton', async () => await askService.toggleAskButton());
        ipcMain.handle('ask:closeAskWindow', async () => await askService.closeAskWindow());

        // Listen Feature
        ipcMain.handle('listen:sendMicAudio', async (event, { data, mimeType }) => await listenService.handleSendMicAudioContent(data, mimeType));
        ipcMain.handle('listen:sendSystemAudio', async (event, { data, mimeType }) => {
            const result = await listenService.sttService.sendSystemAudioContent(data, mimeType);
            if (result.success) {
                listenService.sendToRenderer('system-audio-data', { data });
            }
            return result;
        });
        ipcMain.handle('listen:startMacosSystemAudio', async () => await listenService.handleStartMacosAudio());
        ipcMain.handle('listen:stopMacosSystemAudio', async () => await listenService.handleStopMacosAudio());
        ipcMain.handle('update-google-search-setting', async (event, enabled) => await listenService.handleUpdateGoogleSearchSetting(enabled));
        ipcMain.handle('listen:isSessionActive', async () => await listenService.isSessionActive());
        ipcMain.handle('listen:changeSession', async (event, listenButtonText) => {
            console.log('[ConversationBridge] listen:changeSession from mainheader', listenButtonText);
            try {
                await listenService.handleListenRequest(listenButtonText);
                return { success: true };
            } catch (error) {
                console.error('[ConversationBridge] listen:changeSession failed', error.message);
                return { success: false, error: error.message };
            }
        });

        console.log('[ConversationBridge] Initialized');
    },

    // Renderer로 상태를 전송
    sendAskProgress(win, progress) {
        win.webContents.send('feature:ask:progress', progress);
    }
};
