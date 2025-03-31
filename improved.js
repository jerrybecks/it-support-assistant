const CONFIG = {
  CACHE_PATHS: [], // Define CACHE_PATHS or import it from a config file
}

// Mock showNotification function
function showNotification(message, type = "info") {
  console.log(`Notification (${type}): ${message}`)
}

// Mock initSystemInfo function
function initSystemInfo() {
  console.log("Initializing System Info...")
}

// Mock initCacheManagement function
function initCacheManagement() {
  console.log("Initializing Cache Management...")
}

// Mock initNetworkInfo function
function initNetworkInfo() {
  console.log("Initializing Network Info...")
}

// Mock initPerformanceMetrics function
function initPerformanceMetrics() {
  console.log("Initializing Performance Metrics...")
}

// Mock initNetworkTraffic function
function initNetworkTraffic() {
  console.log("Initializing Network Traffic...")
}

// Mock initSecurityScanner function
function initSecurityScanner() {
  console.log("Initializing Security Scanner...")
}

// Mock initRunningApplications function
function initRunningApplications() {
  console.log("Initializing Running Applications...")
}

// Mock initDiagnostics function
function initDiagnostics() {
  console.log("Initializing Diagnostics...")
}

// Mock initHardwareHealth function
function initHardwareHealth() {
  console.log("Initializing Hardware Health...")
}

// Mock initScheduledTasks function
function initScheduledTasks() {
  console.log("Initializing Scheduled Tasks...")
}

// Mock initReports function
function initReports() {
  console.log("Initializing Reports...")
}

// Mock initNotifications function
function initNotifications() {
  console.log("Initializing Notifications...")
}

// Add dashboard integration for new features
function initDashboard() {
  const dashboardSystemInfo = document.getElementById("dashboard-system-info")
  const dashboardPerformance = document.getElementById("dashboard-performance")
  const dashboardIssues = document.getElementById("dashboard-issues")

  const runDiagnosticsBtn = document.getElementById("run-diagnostics-btn")
  const cleanCacheBtn = document.getElementById("clean-cache-btn")
  const scanVulnerabilitiesBtn = document.getElementById("scan-vulnerabilities-btn")
  const generateReportBtn = document.getElementById("generate-report-btn")

  // Load dashboard data
  loadDashboardData()

  // Set up buttons
  if (runDiagnosticsBtn) {
    runDiagnosticsBtn.addEventListener("click", async () => {
      showNotification("Running diagnostics...")
      const diagnosticsResults = await window.api.runDiagnostics()
      if (diagnosticsResults.success) {
        showNotification(`Diagnostics complete. Found ${diagnosticsResults.data.length} issues.`)
        displayDashboardIssues(diagnosticsResults.data)
      } else {
        showNotification(`Error running diagnostics: ${diagnosticsResults.error}`, "error")
      }
    })
  }

  if (cleanCacheBtn) {
    cleanCacheBtn.addEventListener("click", async () => {
      showNotification("Cleaning cache...")
      const result = await window.api.cleanCache()
      if (result.success) {
        showNotification("Cache cleaned successfully")
      } else {
        showNotification(`Error cleaning cache: ${result.error}`, "error")
      }
    })
  }

  if (scanVulnerabilitiesBtn) {
    scanVulnerabilitiesBtn.addEventListener("click", async () => {
      showNotification("Scanning for vulnerabilities...")
      const result = await window.api.scanVulnerabilities()
      if (result.success) {
        showNotification(`Vulnerability scan complete. Found ${result.data.length} issues.`)
      } else {
        showNotification(`Error scanning for vulnerabilities: ${result.error}`, "error")
      }
    })
  }

  if (generateReportBtn) {
    generateReportBtn.addEventListener("click", async () => {
      showNotification("Generating report...")
      const result = await window.api.generateReport()
      if (result.success) {
        showNotification("Report generated successfully")

        // Ask if user wants to export the report
        if (confirm("Report generated successfully. Would you like to export it?")) {
          const exportResult = await window.api.exportReport(result.data)
          if (exportResult.success) {
            showNotification(`Report exported to ${exportResult.filePath}`)
          } else {
            showNotification(`Error exporting report: ${exportResult.error}`, "error")
          }
        }
      } else {
        showNotification(`Error generating report: ${result.error}`, "error")
      }
    })
  }

  async function loadDashboardData() {
    try {
      // Load system info
      const systemInfo = await window.api.getSystemInfo()
      if (systemInfo.success) {
        displayDashboardSystemInfo(systemInfo.data)
      }

      // Load performance metrics
      const performanceMetrics = await window.api.getPerformanceMetrics()
      if (performanceMetrics.success) {
        displayDashboardPerformance(performanceMetrics.data)
      }

      // Run diagnostics to check for issues
      const diagnosticsResults = await window.api.runDiagnostics()
      if (diagnosticsResults.success) {
        displayDashboardIssues(diagnosticsResults.data)
      }

      // Add software updates summary to dashboard
      if (dashboardSystemInfo) {
        const updatesSection = document.createElement("div")
        updatesSection.innerHTML = `
         <div class="mt-3">
           <h5>Software Updates</h5>
           <button id="dashboard-check-updates" class="btn btn-sm btn-outline-primary">Check for Updates</button>
           <div id="dashboard-updates-status" class="mt-2"></div>
         </div>
       `
        dashboardSystemInfo.appendChild(updatesSection)

        // Add event listener
        document.getElementById("dashboard-check-updates").addEventListener("click", async () => {
          try {
            const updatesStatus = document.getElementById("dashboard-updates-status")
            updatesStatus.innerHTML = "<p>Checking for updates...</p>"

            const result = await window.api.checkSoftwareUpdates()
            if (result.success) {
              const updateCount = result.data.length
              updatesStatus.innerHTML = `<p>${updateCount} updates available. <a href="#" id="view-updates-link">View details</a></p>`

              document.getElementById("view-updates-link").addEventListener("click", (e) => {
                e.preventDefault()
                document.querySelector('a[href="#software-updates"]').click()
              })
            } else {
              updatesStatus.innerHTML = `<p class="text-danger">Error checking for updates: ${result.error}</p>`
            }
          } catch (error) {
            console.error("Error checking for updates:", error)
          }
        })
      }

      // Add disk space summary to dashboard
      if (dashboardPerformance) {
        const diskSection = document.createElement("div")
        diskSection.innerHTML = `
         <div class="mt-3">
           <h5>Disk Health</h5>
           <button id="dashboard-check-disk" class="btn btn-sm btn-outline-primary">Check Disk</button>
           <div id="dashboard-disk-status" class="mt-2"></div>
         </div>
       `
        dashboardPerformance.appendChild(diskSection)

        // Add event listener
        document.getElementById("dashboard-check-disk").addEventListener("click", async () => {
          try {
            const diskStatus = document.getElementById("dashboard-disk-status")
            diskStatus.innerHTML = "<p>Checking disk health...</p>"

            const result = await window.api.checkDiskHealth()
            if (result.success) {
              diskStatus.innerHTML = `
               <p>SMART Status: <span class="${result.data.smartStatus === "Verified" ? "text-success" : "text-danger"}">${result.data.smartStatus}</span></p>
               <p><a href="#" id="view-disk-link">View details</a></p>
             `

              document.getElementById("view-disk-link").addEventListener("click", (e) => {
                e.preventDefault()
                document.querySelector('a[href="#disk-analyzer"]').click()
              })
            } else {
              diskStatus.innerHTML = `<p class="text-danger">Error checking disk health: ${result.error}</p>`
            }
          } catch (error) {
            console.error("Error checking disk health:", error)
          }
        })
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    }
  }

  function displayDashboardSystemInfo(info) {
    if (!dashboardSystemInfo) return

    let html = ""

    html += createInfoItem("Platform", `${info.platform} ${info.arch}`)
    html += createInfoItem("OS Version", info.release)
    html += createInfoItem("Hostname", info.hostname)
    html += createInfoItem("Uptime", formatUptime(info.uptime))
    html += createInfoItem("CPU", info.cpus[0].model)
    html += createInfoItem("CPU Cores", info.cpus.length)

    dashboardSystemInfo.innerHTML = html
  }

  function displayDashboardPerformance(metrics) {
    if (!dashboardPerformance) return

    let html = ""

    // CPU usage
    const cpuUsage = metrics.cpu[0]
    html += `
     <div class="mb-3">
       <div class="d-flex justify-content-between mb-1">
         <span>CPU Usage</span>
         <span>${(cpuUsage * 100).toFixed(1)}%</span>
       </div>
       <div class="progress">
         <div class="progress-bar bg-info" role="progressbar" style="width: ${Math.min(cpuUsage * 100, 100)}%;" 
           aria-valuenow="${cpuUsage * 100}" aria-valuemin="0" aria-valuemax="100"></div>
       </div>
     </div>
   `

    // Memory usage
    const memoryPercentage = (metrics.memory.used / metrics.memory.total) * 100
    html += `
     <div class="mb-3">
       <div class="d-flex justify-content-between mb-1">
         <span>Memory Usage</span>
         <span>${memoryPercentage.toFixed(1)}%</span>
       </div>
       <div class="progress">
         <div class="progress-bar bg-warning" role="progressbar" style="width: ${memoryPercentage}%;" 
           aria-valuenow="${memoryPercentage}" aria-valuemin="0" aria-valuemax="100"></div>
       </div>
       <div class="small text-muted">Used: ${formatBytes(metrics.memory.used)}, Free: ${formatBytes(metrics.memory.free)}</div>
     </div>
   `

    // Disk usage
    if (metrics.disk && metrics.disk.capacity) {
      const diskPercentage = Number.parseInt(metrics.disk.capacity)
      html += `
       <div>
         <div class="d-flex justify-content-between mb-1">
           <span>Disk Usage</span>
           <span>${metrics.disk.capacity}</span>
         </div>
         <div class="progress">
           <div class="progress-bar bg-danger" role="progressbar" style="width: ${diskPercentage}%;" 
             aria-valuenow="${diskPercentage}" aria-valuemin="0" aria-valuemax="100"></div>
         </div>
         <div class="small text-muted">Used: ${metrics.disk.used}, Free: ${metrics.disk.available}</div>
       </div>
     `
    }

    dashboardPerformance.innerHTML = html
  }

  function displayDashboardIssues(issues) {
    if (!dashboardIssues) return

    if (!issues || issues.length === 0) {
      dashboardIssues.innerHTML = '<p class="text-success">No issues detected. Your system is running well.</p>'
      return
    }

    let html = ""

    // Sort issues by severity (high to low)
    const sortedIssues = [...issues].sort((a, b) => {
      const severityOrder = { high: 0, medium: 1, low: 2 }
      return severityOrder[a.severity] - severityOrder[b.severity]
    })

    // Display top 3 issues
    for (const issue of sortedIssues.slice(0, 3)) {
      html += `
       <div class="issue-item ${issue.severity}">
         <div class="d-flex justify-content-between align-items-start">
           <div>
             <h5>${issue.description}</h5>
             <p>${issue.details}</p>
             <p><strong>Recommendation:</strong> ${issue.recommendation}</p>
           </div>
           ${
             issue.canFix
               ? `
             <button class="btn btn-sm btn-primary fix-issue-btn" data-issue-id="${issue.id}">Fix Issue</button>
           `
               : ""
           }
         </div>
       </div>
     `
    }

    if (sortedIssues.length > 3) {
      html += `<p class="mt-3">And ${sortedIssues.length - 3} more issues. Go to the Diagnostics tab to see all issues.</p>`
    }

    dashboardIssues.innerHTML = html

    // Add event listeners to fix buttons
    document.querySelectorAll(".fix-issue-btn").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const issueId = event.target.getAttribute("data-issue-id")
        await fixIssue(issueId)
      })
    })
  }

  async function fixIssue(issueId) {
    showNotification(`Attempting to fix issue: ${issueId}...`)

    try {
      const result = await window.api.fixIssue(issueId)

      if (result.success) {
        showNotification("Issue fixed successfully")

        if (result.action === "suggest_close" && result.processInfo) {
          if (
            confirm(
              `Would you like to close ${result.processInfo.name} (PID: ${result.processInfo.pid}) to resolve this issue?`,
            )
          ) {
            const closeResult = await window.api.closeApplication(result.processInfo.pid)
            if (closeResult.success) {
              showNotification(`Successfully closed ${result.processInfo.name}`)
              // Refresh diagnostics
              const diagnosticsResults = await window.api.runDiagnostics()
              if (diagnosticsResults.success) {
                displayDashboardIssues(diagnosticsResults.data)
              }
            } else {
              showNotification(`Error closing application: ${closeResult.error}`, "error")
            }
          }
        } else {
          // Refresh diagnostics
          const diagnosticsResults = await window.api.runDiagnostics()
          if (diagnosticsResults.success) {
            displayDashboardIssues(diagnosticsResults.data)
          }
        }
      } else {
        showNotification(`Error fixing issue: ${result.error}`, "error")
      }
    } catch (error) {
      console.error("Error fixing issue:", error)
      showNotification(`Error fixing issue: ${error.message}`, "error")
    }
  }
}

// Add dark mode functionality
function initDarkMode() {
  const darkModeToggle = document.getElementById("darkModeToggle")

  if (darkModeToggle) {
    // Check for saved preference
    if (localStorage.getItem("darkMode") === "enabled") {
      document.body.classList.add("dark-mode")
      darkModeToggle.checked = true
    }

    // Add event listener
    darkModeToggle.addEventListener("change", (e) => {
      if (e.target.checked) {
        document.body.classList.add("dark-mode")
        localStorage.setItem("darkMode", "enabled")
      } else {
        document.body.classList.remove("dark-mode")
        localStorage.setItem("darkMode", "disabled")
      }
    })
  }
}

// Add export/import settings functionality
function initSettingsExportImport() {
  const exportSettingsBtn = document.getElementById("export-settings-btn")
  const importSettingsBtn = document.getElementById("import-settings-btn")

  if (exportSettingsBtn) {
    exportSettingsBtn.addEventListener("click", async () => {
      try {
        const result = await window.api.exportSettings()
        if (result.success) {
          showNotification("Settings exported successfully", "success")
        } else {
          showNotification(`Error exporting settings: ${result.error}`, "error")
        }
      } catch (error) {
        console.error("Error exporting settings:", error)
        showNotification(`Error exporting settings: ${error.message}`, "error")
      }
    })
  }

  if (importSettingsBtn) {
    importSettingsBtn.addEventListener("click", async () => {
      try {
        const result = await window.api.importSettings()
        if (result.success) {
          showNotification("Settings imported successfully", "success")
        } else {
          showNotification(`Error importing settings: ${result.error}`, "error")
        }
      } catch (error) {
        console.error("Error importing settings:", error)
        showNotification(`Error importing settings: ${error.message}`, "error")
      }
    })
  }
}

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components
  initSystemInfo()
  initCacheManagement()
  initNetworkInfo()
  initPerformanceMetrics()
  initNetworkTraffic()
  initSecurityScanner()
  initRunningApplications()
  initDashboard()
  initDiagnostics()
  initHardwareHealth()
  initScheduledTasks()
  initReports()
  initNotifications()
  initDarkMode()
  initSettingsExportImport()
})

// Add these styles to the document
const darkModeStyles = document.createElement("style")
darkModeStyles.textContent = `
  .dark-mode {
    background-color: #222;
    color: #f8f9fa;
  }
  
  .dark-mode .card {
    background-color: #333;
    color: #f8f9fa;
  }
  
  .dark-mode .card-header {
    background-color: #0d6efd;
  }
  
  .dark-mode .table {
    color: #f8f9fa;
  }
  
  .dark-mode .table-striped tbody tr:nth-of-type(odd) {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  .dark-mode .bg-light {
    background-color: #444 !important;
    color: #f8f9fa !important;
  }
  
  .dark-mode .text-muted {
    color: #adb5bd !important;
  }
  
  .dark-mode .border {
    border-color: #444 !important;
  }
  
  .dark-mode .nav-tabs .nav-link {
    color: #adb5bd;
  }
  
  .dark-mode .nav-tabs .nav-link.active {
    color: #fff;
    background-color: #333;
    border-color: #444 #444 #333;
  }
  
  .dark-mode .form-control {
    background-color: #444;
    border-color: #555;
    color: #f8f9fa;
  }
  
  .dark-mode .form-select {
    background-color: #444;
    border-color: #555;
    color: #f8f9fa;
  }
`
document.head.appendChild(darkModeStyles)
/**
 * Helper Functions
 */
function updateElementContent(element, content) {
  if (element) {
    element.innerHTML = content
  }
}

function createInfoItem(label, value) {
  return `
    <div>
      <strong>${label}:</strong> ${value}
    </div>
  `
}

function formatUptime(uptime) {
  const days = Math.floor(uptime / (60 * 60 * 24))
  const hours = Math.floor((uptime % (60 * 60 * 24)) / (60 * 60))
  const minutes = Math.floor((uptime % (60 * 60)) / 60)
  const seconds = Math.floor(uptime % 60)

  let formattedUptime = ""

  if (days > 0) {
    formattedUptime += `${days} days, `
  }

  formattedUptime += `${hours} hours, ${minutes} minutes, ${seconds} seconds`

  return formattedUptime
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

