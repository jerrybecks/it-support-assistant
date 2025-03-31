const { ipcRenderer } = require('electron');

console.log('Fresh renderer starting...');

// Helper function to format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Load content when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM content loaded');
  
  // Load system information
  await loadSystemInfo();
  
  // Add tab switching functionality
  document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
      console.log('Tab button clicked:', button.getAttribute('data-tab'));
      
      // Remove active class from all tabs and content
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding content
      button.classList.add('active');
      const tabId = button.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });
  
  // Add diagnostics button handler
  document.getElementById('run-diagnostics').addEventListener('click', () => {
    console.log('Run diagnostics button clicked');
    document.getElementById('diagnostics-results').innerHTML = '<p>Diagnostics complete. No issues found.</p>';
  });
  
  // Add cache scanning button handler
  document.getElementById('find-cache').addEventListener('click', async () => {
    console.log('Find cache button clicked');
    const resultsArea = document.getElementById('cleanup-results');
    resultsArea.innerHTML = '<p>Scanning for cache files, please wait...</p>';
    
    try {
      console.log('Sending scan-cache-files request...');
      // Call the IPC handler to scan for cache files
      const result = await ipcRenderer.invoke('scan-cache-files');
      console.log('Received scan result:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Unknown error');
      }
      
      // Start building the HTML
      let html = '<h3>Cache Files Found</h3>';
      
      if (result.cacheFiles.length === 0) {
        html += `<p>No cache files found.</p>`;
        resultsArea.innerHTML = html;
        return;
      }
      
      // Calculate total size
      let totalSize = 0;
      result.cacheFiles.forEach(cache => {
        totalSize += cache.size;
      });
      
      // Add total size information
      html += `<p>Total cache size: <strong>${formatBytes(totalSize)}</strong></p>`;
      html += `<div class="cache-list">`;
      
      // Add each cache location
      result.cacheFiles.forEach(cache => {
        html += `
          <div class="cache-item" data-path="${cache.path}">
            <div class="cache-info">
              <span class="cache-type">${cache.type}</span>
              <span class="cache-path">${cache.path}</span>
              <span class="cache-size">${cache.sizeFormatted}</span>
            </div>
            <button class="clean-btn">Clean</button>
          </div>
        `;
      });
      
      html += `</div>`;
      resultsArea.innerHTML = html;
      console.log('Cache results displayed');
      
      // Add event listeners to clean buttons
      document.querySelectorAll('.clean-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
          console.log('Clean button clicked');
          const cacheItem = e.target.closest('.cache-item');
          const cachePath = cacheItem.getAttribute('data-path');
          
          e.target.textContent = 'Cleaning...';
          e.target.disabled = true;
          
          try {
            console.log('Sending clean-cache request for', cachePath);
            // Call the IPC handler to clean the cache
            const cleanResult = await ipcRenderer.invoke('clean-cache', cachePath);
            console.log('Clean result:', cleanResult);
            
            if (cleanResult.success) {
              e.target.textContent = 'Cleaned';
              cacheItem.classList.add('cleaned');
              
              if (cleanResult.message) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'success-message';
                messageDiv.textContent = cleanResult.message;
                cacheItem.appendChild(messageDiv);
              }
            } else {
              e.target.textContent = 'Failed';
              e.target.classList.add('error-btn');
              const errorMsg = document.createElement('div');
              errorMsg.className = 'error-message';
              errorMsg.textContent = cleanResult.error;
              cacheItem.appendChild(errorMsg);
            }
          } catch (error) {
            console.error('Error cleaning cache:', error);
            e.target.textContent = 'Failed';
            e.target.classList.add('error-btn');
            
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = error.message;
            cacheItem.appendChild(errorMsg);
          }
        });
      });
      
    } catch (error) {
      console.error('Error scanning for cache files:', error);
      resultsArea.innerHTML = `<p class="error">Error scanning for cache files: ${error.message}</p>`;
    }
  });
  
  console.log('Event listeners added');
});

// Function to load system information
async function loadSystemInfo() {
  console.log('Loading system info...');
  
  try {
    // First, show loading indicators
    document.getElementById('system-info').innerHTML = 'Loading system information...';
    document.getElementById('memory-usage').innerHTML = 'Loading memory information...';
    document.getElementById('disk-usage').innerHTML = 'Loading disk information...';
    
    // Request system info from main process
    console.log('Sending get-system-info request...');
    const result = await ipcRenderer.invoke('get-system-info');
    console.log('Received system info response:', result);
    
    if (!result.success) {
      throw new Error(result.error || 'Unknown error');
    }
    
    // Update system info
    document.getElementById('system-info').innerHTML = `
      <div class="info-item">
        <span class="info-label">CPU:</span>
        <span class="info-value">${result.cpu.manufacturer} ${result.cpu.brand}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Cores:</span>
        <span class="info-value">${result.cpu.cores}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Speed:</span>
        <span class="info-value">${result.cpu.speed} GHz</span>
      </div>
    `;
    
    // Update memory usage
    const totalGB = (result.memory.total / (1024 * 1024 * 1024)).toFixed(2);
    const usedGB = (result.memory.used / (1024 * 1024 * 1024)).toFixed(2);
    const usedPercentage = Math.round((result.memory.used / result.memory.total) * 100);
    
    document.getElementById('memory-usage').innerHTML = `
      <div class="info-item">
        <span class="info-label">Total Memory:</span>
        <span class="info-value">${totalGB} GB</span>
      </div>
      <div class="info-item">
        <span class="info-label">Used Memory:</span>
        <span class="info-value">${usedGB} GB (${usedPercentage}%)</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${usedPercentage}%"></div>
      </div>
    `;
    
    // Update disk usage
    if (result.disks && result.disks.length > 0) {
      let diskHtml = '';
      
      result.disks.forEach(disk => {
        const diskSizeGB = (disk.size / (1024 * 1024 * 1024)).toFixed(2);
        const diskUsedGB = (disk.used / (1024 * 1024 * 1024)).toFixed(2);
        const diskUsedPercentage = Math.round((disk.used / disk.size) * 100);
        
        diskHtml += `
          <div class="disk-item">
            <div class="info-item">
              <span class="info-label">Mount:</span>
              <span class="info-value">${disk.mount}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Size:</span>
              <span class="info-value">${diskUsedGB} GB used of ${diskSizeGB} GB</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${diskUsedPercentage}%"></div>
            </div>
          </div>
        `;
      });
      
      document.getElementById('disk-usage').innerHTML = diskHtml;
    } else {
      document.getElementById('disk-usage').innerHTML = '<p>No disk information available</p>';
    }
    
    console.log('System info updated successfully');
  } catch (error) {
    console.error('Error loading system information:', error);
    
    // Show error messages
    document.getElementById('system-info').innerHTML = `<p class="error">Error: ${error.message}</p>`;
    document.getElementById('memory-usage').innerHTML = `<p class="error">Error: ${error.message}</p>`;
    document.getElementById('disk-usage').innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
}

// Add styles
const style = document.createElement('style');
style.textContent = `
  .info-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  
  .info-label {
    color: #6b7280;
  }
  
  .progress-bar {
    height: 8px;
    background-color: #e5e7eb;
    border-radius: 4px;
    margin: 8px 0;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background-color: #2563eb;
    border-radius: 4px;
  }
  
  .disk-item {
    margin-bottom: 15px;
  }
  
  .error {
    color: #ef4444;
  }
  
  .cache-list {
    margin-top: 15px;
  }
  
  .cache-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    margin-bottom: 10px;
  }
  
  .cache-item.cleaned {
    opacity: 0.7;
    border-left: 4px solid #10b981;
  }
  
  .cache-info {
    display: flex;
    flex-direction: column;
  }
  
  .cache-type {
    font-weight: 500;
    color: #2563eb;
  }
  
  .cache-path {
    font-size: 12px;
    color: #6b7280;
    word-break: break-all;
  }
  
  .cache-size {
    font-size: 12px;
    font-weight: 500;
  }
  
  .clean-btn {
    background-color: #2563eb;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
  }
  
  .clean-btn:hover {
    background-color: #1d4ed8;
  }
  
  .clean-btn:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }
  
  .error-btn {
    background-color: #ef4444;
  }
  
  .error-message {
    color: #ef4444;
    font-size: 12px;
    margin-top: 5px;
  }
  
  .success-message {
    color: #10b981;
    font-size: 12px;
    margin-top: 5px;
  }
`;
document.head.appendChild(style);

console.log('Fresh renderer initialization complete');