const { contextBridge, ipcRenderer } = require("electron")

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  // System information
  getSystemInfo: () => ipcRenderer.invoke("get-system-info"),

  // Cache management
  scanCache: (customPaths) => ipcRenderer.invoke("scan-cache", customPaths),
  cleanCache: (cachePath) => ipcRenderer.invoke("clean-cache", cachePath),

  // Network information
  getNetworkInfo: () => ipcRenderer.invoke("get-network-info"),
  detectVpn: () => ipcRenderer.invoke("detect-vpn"),
  runSpeedTest: () => ipcRenderer.invoke("run-speed-test"),
  discoverNetworkDevices: () => ipcRenderer.invoke("discover-network-devices"),
  monitorNetworkTraffic: () => ipcRenderer.invoke("monitor-network-traffic"),

  // Performance monitoring
  getPerformanceMetrics: () => ipcRenderer.invoke("get-performance-metrics"),
  getMemoryUsage: () => ipcRenderer.invoke("get-memory-usage"),

  // Network traffic monitoring
  startNetworkMonitoring: () => ipcRenderer.invoke("start-network-monitoring"),
  stopNetworkMonitoring: () => ipcRenderer.invoke("stop-network-monitoring"),
  getNetworkTraffic: () => ipcRenderer.invoke("get-network-traffic"),
  onNetworkTrafficUpdate: (callback) => {
    ipcRenderer.on("network-traffic-update", (_, data) => callback(data))
    return () => {
      ipcRenderer.removeAllListeners("network-traffic-update")
    }
  },

  // Security
  scanVulnerabilities: () => ipcRenderer.invoke("scan-vulnerabilities"),

  // Process management
  getRunningApplications: () => ipcRenderer.invoke("get-running-applications"),
  closeApplication: (pid) => ipcRenderer.invoke("close-application", pid),

  // Automated diagnostics
  runDiagnostics: () => ipcRenderer.invoke("run-diagnostics"),
  fixIssue: (issueId) => ipcRenderer.invoke("fix-issue", issueId),

  // Hardware health monitoring
  getHardwareHealth: () => ipcRenderer.invoke("get-hardware-health"),

  // Scheduled tasks
  getScheduledTasks: () => ipcRenderer.invoke("get-scheduled-tasks"),
  updateScheduledTask: (task) => ipcRenderer.invoke("update-scheduled-task", task),
  runScheduledTask: (taskName) => ipcRenderer.invoke("run-scheduled-task", taskName),
  onScheduledTaskRun: (callback) => {
    ipcRenderer.on("scheduled-task-run", (_, data) => callback(data))
    return () => {
      ipcRenderer.removeAllListeners("scheduled-task-run")
    }
  },

  // Reporting
  generateReport: () => ipcRenderer.invoke("generate-report"),
  getHistoricalData: (dataType, startDate, endDate) =>
    ipcRenderer.invoke("get-historical-data", dataType, startDate, endDate),
  exportReport: (reportData) => ipcRenderer.invoke("export-report", reportData),

  // New APIs for additional services

  // Software Updates
  checkSoftwareUpdates: () => ipcRenderer.invoke("check-software-updates"),
  installSoftwareUpdate: (updateId) => ipcRenderer.invoke("install-software-update", updateId),

  // Disk Analyzer
  checkDiskHealth: () => ipcRenderer.invoke("check-disk-health"),
  analyzeDiskSpace: () => ipcRenderer.invoke("analyze-disk-space"),
  findLargeFiles: () => ipcRenderer.invoke("find-large-files"),
  openFile: (filePath) => ipcRenderer.invoke("open-file", filePath),
  deleteFile: (filePath) => ipcRenderer.invoke("delete-file", filePath),

  // Log Analyzer
  analyzeLogs: (filters) => ipcRenderer.invoke("analyze-logs", filters),
  exportLogResults: (logData) => ipcRenderer.invoke("export-log-results", logData),

  // Startup Manager
  getStartupItems: () => ipcRenderer.invoke("get-startup-items"),
  addStartupItem: (item) => ipcRenderer.invoke("add-startup-item", item),
  toggleStartupItem: (id, enable) => ipcRenderer.invoke("toggle-startup-item", id, enable),
  removeStartupItem: (id) => ipcRenderer.invoke("remove-startup-item", id),

  // Export/Import Settings
  exportSettings: () => ipcRenderer.invoke("export-settings"),
  importSettings: () => ipcRenderer.invoke("import-settings"),
})

