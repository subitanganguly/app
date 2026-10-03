// ============================================================
// BACKUP.JS - Complete Backup Management (Updated with Auto Backup Timer)
// ============================================================

class BackupManager {
  constructor() {
    this.API_URL = 'https://script.google.com/macros/s/AKfycbzk-HhwqfQ-wKfDu8jtsTtdT-yffTPgA66c5kNwfGknn3IiplYjjenQkXa7y5Zh8R2NnA/exec';
    this.STORAGE_KEY = 'backup_settings';
    this.settings = this.loadSettings();
    this.isBackupInProgress = false;
    this.debounceTimer = null;
    this.autoBackupInterval = null;
    this.init();
  }

  init() {
    // Check if settings exist
    if (!this.settings) {
      setTimeout(() => this.showBackupModal(), 1000);
    } else {
      if (this.settings.autoBackup) {
        this.enableAutoBackup();
        //console.log('Auto backup enabled');
        this.showToast('Auto backup is enabled', 'info');
      }
    }
    this.setupAutoBackupListeners();
  }

  loadSettings() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error loading settings:', e);
      return null;
    }
  }

  saveSettings(settings) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
      this.settings = settings;
      return true;
    } catch (e) {
      console.error('Error saving settings:', e);
      return false;
    }
  }

  // ============================================================
  // MODAL MANAGEMENT (Bootstrap 5)
  // ============================================================

  showBackupModal() {
    if (typeof bootstrap === 'undefined') {
      console.error('Bootstrap is not loaded. Please include Bootstrap 5.');
      return;
    }

    this.removeModal();

    // Get current delay value
    const currentDelay = this.settings?.delay || 30000;

    const modalHTML = `
      <div class="modal fade" id="backupSettingsModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title">
                <i class="bi bi-cloud-upload"></i> Backup Settings
              </h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form id="backupSettingsForm">
                <div class="mb-3">
                  <label for="backupSettingsPassword" class="form-label">Cloud Backup Password</label>
                  <input type="password" class="form-control" id="backupSettingsPassword" 
                         placeholder="Enter cloud backup password" required>
                  <div class="invalid-feedback">Password is required</div>
                  <small class="form-text text-muted">
                    <i class="bi bi-info-circle"></i> This password is used to upload backups to Google Drive
                  </small>
                </div>
                <div class="mb-3">
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="autoBackupToggle" ${this.settings?.autoBackup ? 'checked' : ''}>
                    <label class="form-check-label" for="autoBackupToggle">
                      <i class="bi bi-clock-history"></i> Auto Backup
                    </label>
                    <small class="form-text text-muted d-block mt-1">
                      Automatically backup to cloud at set intervals
                    </small>
                  </div>
                </div>
                <div class="mb-3">
                  <label for="backupDelay" class="form-label">Auto Backup Interval</label>
                  <select class="form-select" id="backupDelay">
                    <option value="10000" ${currentDelay === 10000 ? 'selected' : ''}>10 seconds</option>
                    <option value="30000" ${currentDelay === 30000 ? 'selected' : ''}>30 seconds</option>
                    <option value="50000" ${currentDelay === 50000 ? 'selected' : ''}>50 seconds</option>
                    <option value="60000" ${currentDelay === 60000 ? 'selected' : ''}>1 minute</option>
                    <option value="300000" ${currentDelay === 300000 ? 'selected' : ''}>5 minutes</option>
                  </select>
                  <small class="form-text text-muted">
                    <i class="bi bi-info-circle"></i> Backup will run every X seconds/minutes regardless of changes
                  </small>
                </div>
                <hr>
                <div class="mb-3">
                  <label class="form-label">Quick Actions</label>
                  <button type="button" class="btn btn-outline-primary w-100 mb-2" id="manualBackupFromModalBtn">
                    <i class="bi bi-cloud-upload"></i> Backup Now
                  </button>
                  <button type="button" class="btn btn-outline-danger w-100" id="resetBackupSettingsBtn">
                    <i class="bi bi-trash"></i> Reset Settings
                  </button>
                </div>
              </form>
              <div id="backupModalStatus" class="mt-3"></div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" id="saveBackupSettingsBtn">
                <i class="bi bi-check-circle"></i> Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstElementChild);

    const modal = new bootstrap.Modal(document.getElementById('backupSettingsModal'));
    modal.show();
    this.setupModalEvents(modal);
  }

  removeModal() {
    const existingModal = document.getElementById('backupSettingsModal');
    if (existingModal) {
      existingModal.remove();
    }
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  }

  setupModalEvents(modal) {
    // Save settings
    document.getElementById('saveBackupSettingsBtn').addEventListener('click', () => {
      this.saveBackupSettings(modal);
    });

    // Manual backup from modal
    document.getElementById('manualBackupFromModalBtn').addEventListener('click', () => {
      const password = document.getElementById('backupSettingsPassword').value;
      if (password) {
        this.performBackup(password);
      } else {
        document.getElementById('backupSettingsPassword').classList.add('is-invalid');
        this.showToast('Please enter password', 'warning');
      }
    });

    // Reset settings
    document.getElementById('resetBackupSettingsBtn').addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all backup settings?')) {
        this.resetSettings();
        modal.hide();
        this.showToast('Settings reset successfully', 'info');
      }
    });

    // Enter key support
    document.getElementById('backupSettingsPassword').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        document.getElementById('saveBackupSettingsBtn').click();
      }
    });

    // Remove invalid class on input
    document.getElementById('backupSettingsPassword').addEventListener('input', function() {
      this.classList.remove('is-invalid');
    });
  }

  // ============================================================
  // SAVE SETTINGS
  // ============================================================

  saveBackupSettings(modal) {
    const password = document.getElementById('backupSettingsPassword').value;
    const autoBackup = document.getElementById('autoBackupToggle').checked;
    const delay = parseInt(document.getElementById('backupDelay').value) || 30000;

    if (!password) {
      document.getElementById('backupSettingsPassword').classList.add('is-invalid');
      return;
    }

    const settings = {
      password: password,
      autoBackup: autoBackup,
      lastBackup: null,
      delay: delay
    };

    if (this.saveSettings(settings)) {
      // Clear existing interval if any
      if (this.autoBackupInterval) {
        clearInterval(this.autoBackupInterval);
        this.autoBackupInterval = null;
      }

      this.showToast('Settings saved successfully!', 'success');
      modal.hide();
      
      if (autoBackup) {
        this.enableAutoBackup();
        // Perform initial backup
        setTimeout(() => this.performBackup(password), 1000);
      }
    }
  }

  // ============================================================
  // AUTO BACKUP (Timer-based)
  // ============================================================

  enableAutoBackup() {
    console.log('Auto backup enabled');
    this.addAutoBackupIndicator();

    // Clear existing interval if any
    if (this.autoBackupInterval) {
      clearInterval(this.autoBackupInterval);
      this.autoBackupInterval = null;
    }

    // Start the interval
    const delay = this.settings?.delay || 30000;
    this.autoBackupInterval = setInterval(() => {
      if (this.settings && this.settings.password) {
        console.log(`Auto backup triggered by timer (${delay/1000}s interval)`);
        this.performBackup(this.settings.password);
      }
    }, delay);

    // Also keep the change-based trigger as a backup
    this.setupAutoBackupListeners();
  }

  addAutoBackupIndicator() {
    // Remove existing indicator
    const existing = document.getElementById('autoBackupIndicator');
    if (existing) existing.remove();

    const delay = this.settings?.delay || 30000;
    const delayDisplay = delay >= 60000 ? (delay/60000) + 'min' : (delay/1000) + 's';

    const indicator = document.createElement('div');
    indicator.id = 'autoBackupIndicator';
    indicator.className = 'position-fixed bottom-0 start-0 p-2';
    indicator.style.zIndex = '9999';
    indicator.innerHTML = `
      <div class="bg-success text-white rounded p-1 px-2 shadow-sm" style="opacity: 0.85; font-size: 10px;">
        <i class="bi bi-clock-history me-1"></i> Auto Backup (${delayDisplay})
        <span class="badge bg-light text-dark ms-1" id="lastBackupTime" style="font-size: 9px;">Never</span>
      </div>
    `;
    document.body.appendChild(indicator);

    // Update last backup time if available
    if (this.settings && this.settings.lastBackup) {
      this.updateLastBackupTime();
    }
  }

  updateLastBackupTime() {
    const timeElement = document.getElementById('lastBackupTime');
    if (timeElement && this.settings && this.settings.lastBackup) {
      const date = new Date(this.settings.lastBackup);
      timeElement.textContent = date.toLocaleTimeString();
    }
  }

  setupAutoBackupListeners() {
    // Listen for data changes (as a backup trigger)
    document.addEventListener('change', (e) => {
      // Ignore backup-related inputs
      if (e.target.closest('#backupSettingsForm')) return;
      if (e.target.closest('#cloudUploadStatus')) return;
      
      if (this.settings && this.settings.autoBackup) {
        // Just log the change, interval will handle the backup
        console.log('Data change detected, auto backup will run on schedule');
      }
    });

    // Custom event for data changes
    document.addEventListener('dataChanged', () => {
      if (this.settings && this.settings.autoBackup) {
        console.log('Data change event detected, auto backup will run on schedule');
      }
    });
  }

  // ============================================================
  // PERFORM BACKUP (CORS Fixed)
  // ============================================================

  async performBackup(password) {
    if (this.isBackupInProgress) {
      console.log('Backup already in progress');
      return;
    }

    try {
      this.isBackupInProgress = true;
      this.showToast('Backing up to cloud...', 'info');

      // Collect data from the page's existing functions
      const backupData = await this.collectData();
      const jsonData = JSON.stringify(backupData);
      
      // Base64 encode
      let base64Data;
      try {
        base64Data = btoa(unescape(encodeURIComponent(jsonData)));
      } catch (e) {
        try {
          base64Data = btoa(jsonData);
        } catch (err) {
          base64Data = this.base64Encode(jsonData);
        }
      }

      const payload = {
        password: password,
        file: base64Data,
        fileName: 'backup_' + new Date().toISOString().split('T')[0] + '.json',
        mimeType: 'application/json'
      };

      // Send to Google Apps Script using no-cors
      await fetch(this.API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      this.onBackupSuccess();

    } catch (error) {
      console.error('Backup error:', error);
      this.showToast('Backup failed: ' + error.message, 'danger');
    } finally {
      this.isBackupInProgress = false;
    }
  }

  // ============================================================
  // COLLECT DATA (Uses your page's functions)
  // ============================================================

  async collectData() {
    const STORE_NAMES = [
      'projects',
      'employees', 
      'designations',
      'phases',
      'attendance',
      'salarySettings',
      'expenses',
      'prizeSettings',
      'companyPrize'
    ];

    const backupData = {};
    let totalRecords = 0;

    // Use the page's getAllData function if available
    for (let i = 0; i < STORE_NAMES.length; i++) {
      const store = STORE_NAMES[i];
      try {
        let data = [];
        if (typeof window.getAllData === 'function') {
          data = await window.getAllData(store);
        } else {
          // Fallback: try to get data from the page's database
          const db = await window.openDB();
          if (db.objectStoreNames.contains(store)) {
            data = await new Promise((resolve, reject) => {
              const transaction = db.transaction(store, 'readonly');
              const storeObj = transaction.objectStore(store);
              const request = storeObj.getAll();
              request.onsuccess = () => resolve(request.result);
              request.onerror = () => reject(request.error);
            });
          }
          db.close();
        }
        backupData[store] = data;
        totalRecords += data.length;
      } catch (error) {
        console.error(`Error collecting data from ${store}:`, error);
        backupData[store] = [];
      }
    }

    backupData.metadata = {
      appName: window.APP_NAME || 'tea-estate-management',
      exportedAt: new Date().toISOString(),
      version: window.DB_VERSION || 1,
      totalRecords: totalRecords,
      stores: STORE_NAMES
    };

    return backupData;
  }

  // Base64 encoding fallback
  base64Encode(str) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';
    let i = 0;
    while (i < str.length) {
      const a = str.charCodeAt(i++);
      const b = i < str.length ? str.charCodeAt(i++) : 0;
      const c = i < str.length ? str.charCodeAt(i++) : 0;
      const bits = (a << 16) | (b << 8) | c;
      output += chars.charAt((bits >> 18) & 0x3F);
      output += chars.charAt((bits >> 12) & 0x3F);
      output += i - 2 < str.length ? chars.charAt((bits >> 6) & 0x3F) : '=';
      output += i - 1 < str.length ? chars.charAt(bits & 0x3F) : '=';
    }
    return output;
  }

  onBackupSuccess() {
    if (this.settings) {
      this.settings.lastBackup = new Date().toISOString();
      this.saveSettings(this.settings);
      this.updateLastBackupTime();
    }
    this.showToast('✓ Backup successful!', 'success');
    document.dispatchEvent(new CustomEvent('backupCompleted'));
  }

  // ============================================================
  // TOAST NOTIFICATION (Small - 8px font)
  // ============================================================

  showToast(message, type = 'success') {
    const existingToasts = document.querySelectorAll('.backup-toast');
    existingToasts.forEach(t => t.remove());

    const bgColor = {
      success: 'bg-success',
      danger: 'bg-danger',
      info: 'bg-info',
      warning: 'bg-warning'
    }[type] || 'bg-primary';

    const icon = {
      success: 'bi-check-circle',
      danger: 'bi-x-circle',
      info: 'bi-info-circle',
      warning: 'bi-exclamation-triangle'
    }[type] || 'bi-info-circle';

    const toastHTML = `
      <div class="backup-toast position-fixed top-0 end-0 p-2" style="z-index: 9999; margin-top: 10px; margin-right: 10px;">
        <div class="toast show border-0 shadow-sm" role="alert" style="min-width: auto; max-width: 250px;">
          <div class="toast-header ${bgColor} text-white py-1 px-2">
            <i class="bi ${icon} me-1" style="font-size: 10px;"></i>
            <strong class="me-auto" style="font-size: 9px;">Backup</strong>
            <button type="button" class="btn-close btn-close-white" style="width: 14px; height: 14px; font-size: 8px;" onclick="this.closest('.backup-toast').remove()"></button>
          </div>
          <div class="toast-body py-1 px-2" style="font-size: 8px; line-height: 1.2;">
            ${message}
          </div>
        </div>
      </div>
    `;

    const toastContainer = document.createElement('div');
    toastContainer.innerHTML = toastHTML;
    document.body.appendChild(toastContainer.firstElementChild);

    // Auto remove after 4 seconds
    setTimeout(() => {
      const toast = document.querySelector('.backup-toast');
      if (toast) {
        toast.remove();
      }
    }, 4000);
  }

  // ============================================================
  // UTILITY METHODS
  // ============================================================

  manualBackup() {
    if (this.settings && this.settings.password) {
      this.performBackup(this.settings.password);
    } else {
      this.showBackupModal();
    }
  }

  getBackupStatus() {
    if (this.settings) {
      return {
        autoBackup: this.settings.autoBackup,
        lastBackup: this.settings.lastBackup,
        hasPassword: !!this.settings.password,
        delay: this.settings.delay || 30000
      };
    }
    return null;
  }

  resetSettings() {
    // Clear interval
    if (this.autoBackupInterval) {
      clearInterval(this.autoBackupInterval);
      this.autoBackupInterval = null;
    }
    localStorage.removeItem(this.STORAGE_KEY);
    this.settings = null;
    const indicator = document.getElementById('autoBackupIndicator');
    if (indicator) indicator.remove();
    this.showToast('Settings have been reset', 'info');
  }
}

// ============================================================
// INITIALIZE
// ============================================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
      window.backupManager = new BackupManager();
    }, 500);
  });
} else {
  setTimeout(() => {
    window.backupManager = new BackupManager();
  }, 500);
}

// ============================================================
// GLOBAL FUNCTIONS
// ============================================================

function triggerBackup() {
  if (window.backupManager) {
    window.backupManager.manualBackup();
  } else {
    console.error('Backup manager not initialized');
  }
}

function resetBackupSettings() {
  if (window.backupManager) {
    window.backupManager.resetSettings();
  }
}

function getBackupStatus() {
  if (window.backupManager) {
    return window.backupManager.getBackupStatus();
  }
  return null;
}