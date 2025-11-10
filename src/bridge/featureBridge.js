// src/bridge/featureBridge.js
const { ipcMain, app, BrowserWindow, dialog } = require('electron');
const fs = require('fs').promises;
const path = require('path');
const settingsService = require('../features/settings/settingsService');
const authService = require('../features/common/services/authService');
const whisperService = require('../features/common/services/whisperService');
const ollamaService = require('../features/common/services/ollamaService');
const modelStateService = require('../features/common/services/modelStateService');
const shortcutsService = require('../features/shortcuts/shortcutsService');
const presetRepository = require('../features/common/repositories/preset');
const localAIManager = require('../features/common/services/localAIManager');
const askService = require('../features/ask/askService');
const listenService = require('../features/listen/listenService');
const permissionService = require('../features/common/services/permissionService');
const encryptionService = require('../features/common/services/encryptionService');
const agentProfileService = require('../features/common/services/agentProfileService');
const conversationHistoryService = require('../features/common/services/conversationHistoryService');
const workflowService = require('../features/common/services/workflowService');
const documentService = require('../features/common/services/documentService');
const indexingService = require('../features/common/services/indexingService');
const ragService = require('../features/common/services/ragService');

// Track event listeners for cleanup
const eventListeners = [];

function trackListener(emitter, event, handler) {
  emitter.on(event, handler);
  eventListeners.push({ emitter, event, handler });
}

module.exports = {
  // Renderer로부터의 요청을 수신하고 서비스로 전달
  initialize() {
    // Settings Service
    ipcMain.handle('settings:getPresets', async () => await settingsService.getPresets());
    ipcMain.handle('settings:get-auto-update', async () => await settingsService.getAutoUpdateSetting());
    ipcMain.handle('settings:set-auto-update', async (event, isEnabled) => await settingsService.setAutoUpdateSetting(isEnabled));  
    ipcMain.handle('settings:get-model-settings', async () => await settingsService.getModelSettings());
    ipcMain.handle('settings:clear-api-key', async (e, { provider }) => await settingsService.clearApiKey(provider));
    ipcMain.handle('settings:set-selected-model', async (e, { type, modelId }) => await settingsService.setSelectedModel(type, modelId));    

    ipcMain.handle('settings:get-ollama-status', async () => await settingsService.getOllamaStatus());
    ipcMain.handle('settings:ensure-ollama-ready', async () => await settingsService.ensureOllamaReady());
    ipcMain.handle('settings:shutdown-ollama', async () => await settingsService.shutdownOllama());

    // Shortcuts
    ipcMain.handle('settings:getCurrentShortcuts', async () => await shortcutsService.loadKeybinds());
    ipcMain.handle('shortcut:getDefaultShortcuts', async () => await shortcutsService.handleRestoreDefaults());
    ipcMain.handle('shortcut:closeShortcutSettingsWindow', async () => await shortcutsService.closeShortcutSettingsWindow());
    ipcMain.handle('shortcut:openShortcutSettingsWindow', async () => await shortcutsService.openShortcutSettingsWindow());
    ipcMain.handle('shortcut:saveShortcuts', async (event, newKeybinds) => await shortcutsService.handleSaveShortcuts(newKeybinds));
    ipcMain.handle('shortcut:toggleAllWindowsVisibility', async () => await shortcutsService.toggleAllWindowsVisibility());

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

    // Workflows (Phase 3)
    ipcMain.handle('workflows:get-current-profile-workflows', () => {
        return workflowService.getCurrentProfileWorkflows();
    });
    ipcMain.handle('workflows:get-workflows-metadata', (event, profileId) => {
        return workflowService.getProfileWorkflowsMetadata(profileId);
    });
    ipcMain.handle('workflows:get-workflow', (event, profileId, workflowId) => {
        return workflowService.getWorkflow(profileId, workflowId);
    });
    ipcMain.handle('workflows:build-prompt', (event, profileId, workflowId, formData) => {
        return workflowService.buildPrompt(profileId, workflowId, formData);
    });
    ipcMain.handle('workflows:get-form-fields', (event, profileId, workflowId) => {
        return workflowService.getWorkflowFormFields(profileId, workflowId);
    });
    ipcMain.handle('workflows:validate-form', (event, profileId, workflowId, formData) => {
        return workflowService.validateFormData(profileId, workflowId, formData);
    });

    // Knowledge Base - Documents (Phase 4)
    ipcMain.handle('documents:get-all', async () => {
        const userId = authService.getCurrentUserId();
        return await documentService.getAllDocuments(userId);
    });
    ipcMain.handle('documents:search', async (event, query, filters) => {
        const userId = authService.getCurrentUserId();
        return await documentService.searchDocuments(userId, query, filters);
    });
    ipcMain.handle('documents:get-stats', async () => {
        const userId = authService.getCurrentUserId();
        return await documentService.getDocumentStats(userId);
    });
    ipcMain.handle('documents:delete', async (event, documentId) => {
        return await documentService.deleteDocument(documentId);
    });
    ipcMain.handle('documents:upload', async () => {
        try {
            const userId = authService.getCurrentUserId();
            if (!userId) {
                throw new Error('User not authenticated');
            }

            // Open file picker dialog
            const result = await dialog.showOpenDialog({
                title: 'Upload Document',
                properties: ['openFile'],
                filters: [
                    { name: 'Documents', extensions: ['txt', 'md', 'pdf', 'docx'] },
                    { name: 'Text Files', extensions: ['txt', 'md'] },
                    { name: 'PDF Files', extensions: ['pdf'] },
                    { name: 'Word Documents', extensions: ['docx'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            });

            if (result.canceled || result.filePaths.length === 0) {
                return { success: false, cancelled: true };
            }

            const filePath = result.filePaths[0];
            const filename = path.basename(filePath);

            // Check file size before reading (prevent DoS)
            const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
            const stats = await fs.stat(filePath);

            if (stats.size > MAX_FILE_SIZE) {
                console.warn(`[FeatureBridge] File too large: ${stats.size} bytes (max: ${MAX_FILE_SIZE})`);
                return {
                    success: false,
                    error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`
                };
            }

            // Read file buffer
            const buffer = await fs.readFile(filePath);

            console.log(`[FeatureBridge] Uploading document: ${filename} (${buffer.length} bytes)`);

            // Upload document
            const document = await documentService.uploadDocument(userId, {
                filename,
                filepath: filePath,
                buffer
            });

            // Index document for semantic search
            try {
                console.log(`[FeatureBridge] Indexing document: ${document.id}`);
                const indexResult = await indexingService.indexDocument(
                    document.id,
                    document.content,
                    { generateEmbeddings: true }
                );

                // Update document indexed status
                await documentService.updateDocument(document.id, {
                    chunk_count: indexResult.chunk_count,
                    indexed: 1
                });

                console.log(`[FeatureBridge] Document indexed: ${indexResult.chunk_count} chunks`);
            } catch (indexError) {
                console.error('[FeatureBridge] Error indexing document:', indexError);
                // Continue even if indexing fails
            }

            return {
                success: true,
                document: {
                    id: document.id,
                    title: document.title,
                    filename: document.filename
                }
            };
        } catch (error) {
            console.error('[FeatureBridge] Error uploading document:', error);
            return {
                success: false,
                error: error.message
            };
        }
    });

    // RAG (Phase 4)
    ipcMain.handle('rag:retrieve-context', async (event, query, options) => {
        return await ragService.retrieveContext(query, options);
    });
    ipcMain.handle('rag:get-session-citations', async (event, sessionId) => {
        return await ragService.getSessionCitations(sessionId);
    });

    // Permissions
    ipcMain.handle('check-system-permissions', async () => await permissionService.checkSystemPermissions());
    ipcMain.handle('request-microphone-permission', async () => await permissionService.requestMicrophonePermission());
    ipcMain.handle('open-system-preferences', async (event, section) => await permissionService.openSystemPreferences(section));
    ipcMain.handle('mark-keychain-completed', async () => await permissionService.markKeychainCompleted());
    ipcMain.handle('check-keychain-completed', async () => await permissionService.checkKeychainCompleted());
    ipcMain.handle('initialize-encryption-key', async () => {
        const userId = authService.getCurrentUserId();
        await encryptionService.initializeKey(userId);
        return { success: true };
    });

    // User/Auth
    ipcMain.handle('get-current-user', () => authService.getCurrentUser());
    ipcMain.handle('start-firebase-auth', async () => await authService.startFirebaseAuthFlow());
    ipcMain.handle('firebase-logout', async () => await authService.signOut());

    // App
    ipcMain.handle('quit-application', () => app.quit());

    // Whisper
    ipcMain.handle('whisper:download-model', async (event, modelId) => await whisperService.handleDownloadModel(modelId));
    ipcMain.handle('whisper:get-installed-models', async () => await whisperService.handleGetInstalledModels());
       
    // General
    ipcMain.handle('get-preset-templates', () => presetRepository.getPresetTemplates());
    ipcMain.handle('get-web-url', () => process.env.pickleglass_WEB_URL || 'http://localhost:3000');

    // Ollama
    ipcMain.handle('ollama:get-status', async () => await ollamaService.handleGetStatus());
    ipcMain.handle('ollama:install', async () => await ollamaService.handleInstall());
    ipcMain.handle('ollama:start-service', async () => await ollamaService.handleStartService());
    ipcMain.handle('ollama:ensure-ready', async () => await ollamaService.handleEnsureReady());
    ipcMain.handle('ollama:get-models', async () => await ollamaService.handleGetModels());
    ipcMain.handle('ollama:get-model-suggestions', async () => await ollamaService.handleGetModelSuggestions());
    ipcMain.handle('ollama:pull-model', async (event, modelName) => await ollamaService.handlePullModel(modelName));
    ipcMain.handle('ollama:is-model-installed', async (event, modelName) => await ollamaService.handleIsModelInstalled(modelName));
    ipcMain.handle('ollama:warm-up-model', async (event, modelName) => await ollamaService.handleWarmUpModel(modelName));
    ipcMain.handle('ollama:auto-warm-up', async () => await ollamaService.handleAutoWarmUp());
    ipcMain.handle('ollama:get-warm-up-status', async () => await ollamaService.handleGetWarmUpStatus());
    ipcMain.handle('ollama:shutdown', async (event, force = false) => await ollamaService.handleShutdown(force));

    // Ask
    ipcMain.handle('ask:sendQuestionFromAsk', async (event, userPrompt) => await askService.sendMessage(userPrompt));
    ipcMain.handle('ask:sendQuestionFromSummary', async (event, userPrompt) => await askService.sendMessage(userPrompt));
    ipcMain.handle('ask:toggleAskButton', async () => await askService.toggleAskButton());
    ipcMain.handle('ask:closeAskWindow',  async () => await askService.closeAskWindow());
    
    // Listen
    ipcMain.handle('listen:sendMicAudio', async (event, { data, mimeType }) => await listenService.handleSendMicAudioContent(data, mimeType));
    ipcMain.handle('listen:sendSystemAudio', async (event, { data, mimeType }) => {
        const result = await listenService.sttService.sendSystemAudioContent(data, mimeType);
        if(result.success) {
            listenService.sendToRenderer('system-audio-data', { data });
        }
        return result;
    });
    ipcMain.handle('listen:startMacosSystemAudio', async () => await listenService.handleStartMacosAudio());
    ipcMain.handle('listen:stopMacosSystemAudio', async () => await listenService.handleStopMacosAudio());
    ipcMain.handle('update-google-search-setting', async (event, enabled) => await listenService.handleUpdateGoogleSearchSetting(enabled));
    ipcMain.handle('listen:isSessionActive', async () => await listenService.isSessionActive());
    ipcMain.handle('listen:changeSession', async (event, listenButtonText) => {
      console.log('[FeatureBridge] listen:changeSession from mainheader', listenButtonText);
      try {
        await listenService.handleListenRequest(listenButtonText);
        return { success: true };
      } catch (error) {
        console.error('[FeatureBridge] listen:changeSession failed', error.message);
        return { success: false, error: error.message };
      }
    });

    // ModelStateService
    ipcMain.handle('model:validate-key', async (e, { provider, key }) => await modelStateService.handleValidateKey(provider, key));
    ipcMain.handle('model:get-all-keys', async () => await modelStateService.getAllApiKeys());
    ipcMain.handle('model:set-api-key', async (e, { provider, key }) => await modelStateService.setApiKey(provider, key));
    ipcMain.handle('model:remove-api-key', async (e, provider) => await modelStateService.handleRemoveApiKey(provider));
    ipcMain.handle('model:get-selected-models', async () => await modelStateService.getSelectedModels());
    ipcMain.handle('model:set-selected-model', async (e, { type, modelId }) => await modelStateService.handleSetSelectedModel(type, modelId));
    ipcMain.handle('model:get-available-models', async (e, { type }) => await modelStateService.getAvailableModels(type));
    ipcMain.handle('model:are-providers-configured', async () => await modelStateService.areProvidersConfigured());
    ipcMain.handle('model:get-provider-config', () => modelStateService.getProviderConfig());
    ipcMain.handle('model:re-initialize-state', async () => await modelStateService.initialize());

    // LocalAIManager 이벤트를 모든 윈도우에 브로드캐스트
    // Track listeners for cleanup
    trackListener(localAIManager, 'install-progress', (service, data) => {
      const event = { service, ...data };
      BrowserWindow.getAllWindows().forEach(win => {
        if (win && !win.isDestroyed()) {
          win.webContents.send('localai:install-progress', event);
        }
      });
    });
    trackListener(localAIManager, 'installation-complete', (service) => {
      BrowserWindow.getAllWindows().forEach(win => {
        if (win && !win.isDestroyed()) {
          win.webContents.send('localai:installation-complete', { service });
        }
      });
    });
    trackListener(localAIManager, 'error', (error) => {
      BrowserWindow.getAllWindows().forEach(win => {
        if (win && !win.isDestroyed()) {
          win.webContents.send('localai:error-occurred', error);
        }
      });
    });
    // Handle error-occurred events from LocalAIManager's error handling
    trackListener(localAIManager, 'error-occurred', (error) => {
      BrowserWindow.getAllWindows().forEach(win => {
        if (win && !win.isDestroyed()) {
          win.webContents.send('localai:error-occurred', error);
        }
      });
    });
    trackListener(localAIManager, 'model-ready', (data) => {
      BrowserWindow.getAllWindows().forEach(win => {
        if (win && !win.isDestroyed()) {
          win.webContents.send('localai:model-ready', data);
        }
      });
    });
    trackListener(localAIManager, 'state-changed', (service, state) => {
      const event = { service, ...state };
      BrowserWindow.getAllWindows().forEach(win => {
        if (win && !win.isDestroyed()) {
          win.webContents.send('localai:service-status-changed', event);
        }
      });
    });

    // 주기적 상태 동기화 시작
    localAIManager.startPeriodicSync();

    // ModelStateService 이벤트를 모든 윈도우에 브로드캐스트
    modelStateService.on('state-updated', (state) => {
      BrowserWindow.getAllWindows().forEach(win => {
        if (win && !win.isDestroyed()) {
          win.webContents.send('model-state:updated', state);
        }
      });
    });
    modelStateService.on('settings-updated', () => {
      BrowserWindow.getAllWindows().forEach(win => {
        if (win && !win.isDestroyed()) {
          win.webContents.send('settings-updated');
        }
      });
    });
    modelStateService.on('force-show-apikey-header', () => {
      BrowserWindow.getAllWindows().forEach(win => {
        if (win && !win.isDestroyed()) {
          win.webContents.send('force-show-apikey-header');
        }
      });
    });

    // LocalAI 통합 핸들러 추가
    ipcMain.handle('localai:install', async (event, { service, options }) => {
      return await localAIManager.installService(service, options);
    });
    ipcMain.handle('localai:get-status', async (event, service) => {
      return await localAIManager.getServiceStatus(service);
    });
    ipcMain.handle('localai:start-service', async (event, service) => {
      return await localAIManager.startService(service);
    });
    ipcMain.handle('localai:stop-service', async (event, service) => {
      return await localAIManager.stopService(service);
    });
    ipcMain.handle('localai:install-model', async (event, { service, modelId, options }) => {
      return await localAIManager.installModel(service, modelId, options);
    });
    ipcMain.handle('localai:get-installed-models', async (event, service) => {
      return await localAIManager.getInstalledModels(service);
    });
    ipcMain.handle('localai:run-diagnostics', async (event, service) => {
      return await localAIManager.runDiagnostics(service);
    });
    ipcMain.handle('localai:repair-service', async (event, service) => {
      return await localAIManager.repairService(service);
    });
    
    // 에러 처리 핸들러
    ipcMain.handle('localai:handle-error', async (event, { service, errorType, details }) => {
      return await localAIManager.handleError(service, errorType, details);
    });
    
    // 전체 상태 조회
    ipcMain.handle('localai:get-all-states', async (event) => {
      return await localAIManager.getAllServiceStates();
    });

    console.log('[FeatureBridge] Initialized with all feature handlers.');
  },

  /**
   * Cleanup all event listeners to prevent memory leaks
   * Should be called before app shutdown
   */
  cleanup() {
    console.log('[FeatureBridge] Cleaning up event listeners...');

    eventListeners.forEach(({ emitter, event, handler }) => {
      try {
        emitter.removeListener(event, handler);
      } catch (error) {
        console.error(`[FeatureBridge] Error removing listener for event '${event}':`, error);
      }
    });

    // Clear the array
    eventListeners.length = 0;

    console.log('[FeatureBridge] Event listeners cleanup complete');
  },

  // Renderer로 상태를 전송
  sendAskProgress(win, progress) {
    win.webContents.send('feature:ask:progress', progress);
  },
};