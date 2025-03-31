// Simple version of improved.js without Chart.js dependencies
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded - simple-improved.js running")

  // Initialize basic functionality
  initSystemInfo()
  initDashboard()

  // Add event listeners to buttons
  setupButtonListeners()
})

/**
 * Set up event listeners for all buttons
 */
function setupButtonListeners() {
  // Dashboard buttons
  const runDiagnosticsBtn = document.getElementById("run-diagnostics-btn")
  if (runDiagnosticsBtn) {
    runDiagnosticsBtn.addEventListener("click", async () => {
      showNotification("Running diagnostics...")
      try {
        const result = await window.api.runDiagnostics()
        if (result.success) {
          showNotification(`Diagnostics complete. Found ${result.data.length} issues.`)
        } else {
          showNotification(`Error: ${result.error}`, "error")
        }
      } catch (error) {
        console.error("Error running diagnostics:", error)
        showNotification(`Error: ${error.message}`, "error")
      }
    })
  }

  // System info refresh button
  const refreshSystemInfoBtn = document.getElementById("refresh-system-info")
  if (refreshSystemInfoBtn) {
    refreshSystemInfoBtn.addEventListener("click", () => {
      loadSystemInfo()
    })
  }
}

/**
 * Dashboard Module
 */
function initDashboard() {
  const dashboardSystemInfo = document.getElementById("dashboard-system-info")

  // Load dashboard data
  loadDashboardSystemInfo()

  async function loadDashboardSystemInfo() {
    try {
      if (dashboardSystemInfo) {
        dashboardSystemInfo.innerHTML = "<p>Loading system information...</p>"
      }

      const response = await window.api.getSystemInfo()

      if (response.success) {
        const info = response.data

        let html = ""
        html += createInfoItem("Platform", `${info.platform} ${info.arch}`)
        html += createInfoItem("OS Version", info.release)
        html += createInfoItem("Hostname", info.hostname)
        html += createInfoItem("Uptime", formatUptime(info.uptime))
        html += createInfoItem("CPU", info.cpus[0].model)
        html += createInfoItem("CPU Cores", info.cpus.length)

        if (dashboardSystemInfo) {
          dashboardSystemInfo.innerHTML = html
        }
      } else {
        if (dashboardSystemInfo) {
          dashboardSystemInfo.innerHTML = `<p class="text-danger">Error: ${response.error}</p>`
        }
      }
    } catch (error) {
      console.error("Error loading dashboard system info:", error)
      if (dashboardSystemInfo) {
        dashboardSystemInfo.innerHTML = `<p class="text-danger">Error: ${error.message}</p>`
      }
    }
  }
}

/**
 * System Information Module
 */
function initSystemInfo() {
  const systemInfoContent = document.getElementById("system-info-content")

  // Load system info on page load
  loadSystemInfo()

  // Function to load system information
  async function loadSystemInfo() {
    try {
      if (systemInfoContent) {
        systemInfoContent.innerHTML = "<p>Loading system information...</p>"
      }

      const response = await window.api.getSystemInfo()

      if (response.success) {
        const info = response.data

        let html = '<div class="row">'

        // Basic system info
        html += '<div class="col-md-6">'
        html += createInfoItem("Platform", `${info.platform} ${info.arch}`)
        html += createInfoItem("OS Version", info.release)
        html += createInfoItem("Hostname", info.hostname)
        html += createInfoItem("Uptime", formatUptime(info.uptime))
        html += createInfoItem("User", info.userInfo.username)
        html += createInfoItem("Home Directory", info.homedir)
        html += "</div>"

        // CPU and memory info
        html += '<div class="col-md-6">'
        html += createInfoItem("CPU", info.cpus[0].model)
        html += createInfoItem("CPU Cores", info.cpus.length)
        html += createInfoItem("Total Memory", formatBytes(info.totalMemory))
        html += createInfoItem("Free Memory", formatBytes(info.freeMemory))
        html += createInfoItem("Memory Usage", `${Math.round((1 - info.freeMemory / info.totalMemory) * 100)}%`)
        html += "</div>"

        html += "</div>"

        if (systemInfoContent) {
          systemInfoContent.innerHTML = html
        }
      } else {
        if (systemInfoContent) {
          systemInfoContent.innerHTML = `<p class="text-danger">Error: ${response.error}</p>`
        }
      }
    } catch (error) {
      console.error("Error loading system info:", error)
      if (systemInfoContent) {
        systemInfoContent.innerHTML = `<p class="text-danger">Error loading system information: ${error.message}</p>`
      }
    }
  }
}

/**
 * Helper Functions
 */
function createInfoItem(label, value) {
  return `
    <div class="mb-2">
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

function showNotification(message, type = "info") {
  alert(message)
}

