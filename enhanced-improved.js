// Enhanced version of improved.js with more functionality but without problematic imports
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded - enhanced-improved.js running")

  // Initialize all modules
  initSystemInfo()
  initDashboard()
  initPerformanceMetrics()
  initNetworkInfo()
  initNetworkTraffic()
  initCacheManagement()
  initRunningApplications()
  initDiagnostics()
  initHardwareHealth()
  initSecurityScanner()

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

  const cleanCacheBtn = document.getElementById("clean-cache-btn")
  if (cleanCacheBtn) {
    cleanCacheBtn.addEventListener("click", async () => {
      showNotification("Cleaning cache...")
      try {
        const result = await window.api.cleanCache()
        if (result.success) {
          showNotification("Cache cleaned successfully")
        } else {
          showNotification(`Error: ${result.error}`, "error")
        }
      } catch (error) {
        console.error("Error cleaning cache:", error)
        showNotification(`Error: ${error.message}`, "error")
      }
    })
  }

  const scanVulnerabilitiesBtn = document.getElementById("scan-vulnerabilities-btn")
  if (scanVulnerabilitiesBtn) {
    scanVulnerabilitiesBtn.addEventListener("click", async () => {
      showNotification("Scanning for vulnerabilities...")
      try {
        const result = await window.api.scanVulnerabilities()
        if (result.success) {
          showNotification(`Vulnerability scan complete. Found ${result.data.length} issues.`)
        } else {
          showNotification(`Error: ${result.error}`, "error")
        }
      } catch (error) {
        console.error("Error scanning for vulnerabilities:", error)
        showNotification(`Error: ${error.message}`, "error")
      }
    })
  }

  const generateReportBtn = document.getElementById("generate-report-btn")
  if (generateReportBtn) {
    generateReportBtn.addEventListener("click", async () => {
      showNotification("Generating report...")
      try {
        const result = await window.api.generateReport()
        if (result.success) {
          showNotification("Report generated successfully")
        } else {
          showNotification(`Error: ${result.error}`, "error")
        }
      } catch (error) {
        console.error("Error generating report:", error)
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

  // Performance refresh button
  const refreshPerformanceBtn = document.getElementById("refresh-performance")
  if (refreshPerformanceBtn) {
    refreshPerformanceBtn.addEventListener("click", () => {
      loadPerformanceMetrics()
    })
  }

  // Network buttons
  const detectVpnBtn = document.getElementById("detect-vpn")
  if (detectVpnBtn) {
    detectVpnBtn.addEventListener("click", detectVpn)
  }

  const runSpeedTestBtn = document.getElementById("run-speed-test")
  if (runSpeedTestBtn) {
    runSpeedTestBtn.addEventListener("click", runSpeedTest)
  }

  // Cache buttons
  const scanCacheBtn = document.getElementById("scan-cache")
  if (scanCacheBtn) {
    scanCacheBtn.addEventListener("click", scanCache)
  }

  const cleanCacheTabBtn = document.getElementById("clean-cache")
  if (cleanCacheTabBtn) {
    cleanCacheTabBtn.addEventListener("click", cleanCache)
  }

  // Process management
  const refreshApplicationsBtn = document.getElementById("refresh-applications")
  if (refreshApplicationsBtn) {
    refreshApplicationsBtn.addEventListener("click", loadRunningApplications)
  }

  // Diagnostics button
  const diagnosticsRunBtn = document.getElementById("diagnostics-run-btn")
  if (diagnosticsRunBtn) {
    diagnosticsRunBtn.addEventListener("click", runDiagnostics)
  }

  // Hardware health refresh button
  const refreshHardwareBtn = document.getElementById("refresh-hardware")
  if (refreshHardwareBtn) {
    refreshHardwareBtn.addEventListener("click", loadHardwareHealth)
  }
}

/**
 * Dashboard Module
 */
function initDashboard() {
  const dashboardSystemInfo = document.getElementById("dashboard-system-info")
  const dashboardPerformance = document.getElementById("dashboard-performance")

  // Load dashboard data
  loadDashboardSystemInfo()
  loadDashboardPerformance()

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

  async function loadDashboardPerformance() {
    try {
      if (dashboardPerformance) {
        dashboardPerformance.innerHTML = "<p>Loading performance metrics...</p>"
      }

      const response = await window.api.getPerformanceMetrics()

      if (response.success) {
        const metrics = response.data

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

        if (dashboardPerformance) {
          dashboardPerformance.innerHTML = html
        }
      } else {
        if (dashboardPerformance) {
          dashboardPerformance.innerHTML = `<p class="text-danger">Error: ${response.error}</p>`
        }
      }
    } catch (error) {
      console.error("Error loading dashboard performance:", error)
      if (dashboardPerformance) {
        dashboardPerformance.innerHTML = `<p class="text-danger">Error: ${error.message}</p>`
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
}

// Function to load system information
async function loadSystemInfo() {
  const systemInfoContent = document.getElementById("system-info-content")

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

/**
 * Performance Metrics Module
 */
function initPerformanceMetrics() {
  const performanceMetricsContent = document.getElementById("performance-metrics-content")

  // Load performance metrics on page load
  loadPerformanceMetrics()
}

// Function to load performance metrics
async function loadPerformanceMetrics() {
  const performanceMetricsContent = document.getElementById("performance-metrics-content")

  try {
    if (performanceMetricsContent) {
      performanceMetricsContent.innerHTML = "<p>Loading performance metrics...</p>"
    }

    const response = await window.api.getPerformanceMetrics()

    if (response.success) {
      const metrics = response.data

      let html = '<div class="row">'

      // CPU metrics
      html += '<div class="col-md-4">'
      html += "<h5>CPU Load</h5>"
      html += `<div class="progress">
        <div class="progress-bar bg-info" role="progressbar" style="width: ${Math.min(metrics.cpu[0] * 100, 100)}%;" 
          aria-valuenow="${metrics.cpu[0]}" aria-valuemin="0" aria-valuemax="1">
          ${(metrics.cpu[0] * 100).toFixed(1)}%
        </div>
      </div>`
      html += `<div class="small text-muted">1 min: ${metrics.cpu[0].toFixed(2)}, 5 min: ${metrics.cpu[1].toFixed(2)}, 15 min: ${metrics.cpu[2].toFixed(2)}</div>`
      html += "</div>"

      // Memory metrics
      html += '<div class="col-md-4">'
      html += "<h5>Memory Usage</h5>"
      const memoryPercentage = (metrics.memory.used / metrics.memory.total) * 100
      html += `<div class="progress">
        <div class="progress-bar bg-warning" role="progressbar" style="width: ${memoryPercentage.toFixed(1)}%;" 
          aria-valuenow="${memoryPercentage}" aria-valuemin="0" aria-valuemax="100">
          ${memoryPercentage.toFixed(1)}%
        </div>
      </div>`
      html += `<div class="small text-muted">Used: ${formatBytes(metrics.memory.used)}, Free: ${formatBytes(metrics.memory.free)}, Total: ${formatBytes(metrics.memory.total)}</div>`
      html += "</div>"

      // Disk metrics
      html += '<div class="col-md-4">'
      html += "<h5>Disk Usage</h5>"
      if (metrics.disk && metrics.disk.capacity) {
        const diskPercentage = Number.parseInt(metrics.disk.capacity)
        html += `<div class="progress">
          <div class="progress-bar bg-danger" role="progressbar" style="width: ${diskPercentage}%;" 
            aria-valuenow="${diskPercentage}" aria-valuemin="0" aria-valuemax="100">
            ${diskPercentage}%
          </div>
        </div>`
        html += `<div class="small text-muted">Used: ${metrics.disk.used}, Free: ${metrics.disk.available}, Total: ${metrics.disk.size}</div>`
      } else {
        html += "<p>Disk information not available</p>"
      }
      html += "</div>"

      html += "</div>"

      // Get application memory usage
      const memoryResponse = await window.api.getMemoryUsage()

      if (memoryResponse.success) {
        const appMemoryUsage = memoryResponse.data

        html += '<div class="mt-4">'
        html += "<h5>Top Memory Usage by Application</h5>"
        html += '<div class="table-responsive">'
        html += '<table class="table table-sm table-striped">'
        html += "<thead><tr><th>Application</th><th>Memory</th><th>PID</th></tr></thead>"
        html += "<tbody>"

        for (const app of appMemoryUsage.slice(0, 10)) {
          html += `<tr>
            <td>${app.command}</td>
            <td>${formatBytes(app.memoryUsage)}</td>
            <td>${app.pid}</td>
          </tr>`
        }

        html += "</tbody></table></div></div>"
      }

      if (performanceMetricsContent) {
        performanceMetricsContent.innerHTML = html
      }

      // Initialize performance chart
      initPerformanceChart()
    } else {
      if (performanceMetricsContent) {
        performanceMetricsContent.innerHTML = `<p class="text-danger">Error: ${response.error}</p>`
      }
    }
  } catch (error) {
    console.error("Error loading performance metrics:", error)
    if (performanceMetricsContent) {
      performanceMetricsContent.innerHTML = `<p class="text-danger">Error loading performance metrics: ${error.message}</p>`
    }
  }
}

// Initialize performance chart using Chart.js
function initPerformanceChart() {
  const performanceChart = document.getElementById("performance-chart")

  if (!performanceChart || !window.Chart) {
    console.log("Chart element or Chart.js not available")
    return
  }

  try {
    // Sample data for the chart
    const labels = Array.from({ length: 10 }, (_, i) => `${i * 5} min ago`).reverse()
    const cpuData = Array.from({ length: 10 }, () => Math.random() * 100)
    const memoryData = Array.from({ length: 10 }, () => Math.random() * 100)

    // Create chart
    new window.Chart(performanceChart, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "CPU Usage (%)",
            data: cpuData,
            borderColor: "rgba(13, 110, 253, 1)",
            backgroundColor: "rgba(13, 110, 253, 0.1)",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Memory Usage (%)",
            data: memoryData,
            borderColor: "rgba(255, 193, 7, 1)",
            backgroundColor: "rgba(255, 193, 7, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: "Usage (%)",
            },
          },
        },
      },
    })
  } catch (error) {
    console.error("Error initializing performance chart:", error)
  }
}

/**
 * Network Information Module
 */
function initNetworkInfo() {
  const networkInfoContent = document.getElementById("network-info-content")

  // Load network info on page load
  loadNetworkInfo()
}

// Function to load network information
async function loadNetworkInfo() {
  const networkInfoContent = document.getElementById("network-info-content")

  try {
    if (networkInfoContent) {
      networkInfoContent.innerHTML = "<p>Loading network information...</p>"
    }

    const response = await window.api.getNetworkInfo()

    if (response.success) {
      const networkInterfaces = response.data

      if (networkInterfaces.length === 0) {
        if (networkInfoContent) {
          networkInfoContent.innerHTML = "<p>No network interfaces found.</p>"
        }
        return
      }

      let html = "<h5>Network Interfaces:</h5>"

      for (const iface of networkInterfaces) {
        html += `
          <div class="network-interface">
            <div><strong>${iface.name}</strong> (${iface.family})</div>
            <div>Address: ${iface.address}</div>
            <div>MAC: ${iface.mac}</div>
            <div>Internal: ${iface.internal ? "Yes" : "No"}</div>
          </div>
        `
      }

      if (networkInfoContent) {
        networkInfoContent.innerHTML = html
      }
    } else {
      if (networkInfoContent) {
        networkInfoContent.innerHTML = `<p class="text-danger">Error: ${response.error}</p>`
      }
    }
  } catch (error) {
    console.error("Error loading network info:", error)
    if (networkInfoContent) {
      networkInfoContent.innerHTML = `<p class="text-danger">Error loading network information: ${error.message}</p>`
    }
  }
}

// Function to detect VPN
async function detectVpn() {
  const vpnStatusContent = document.getElementById("vpn-status")

  try {
    if (vpnStatusContent) {
      vpnStatusContent.innerHTML = "<p>Detecting VPN connection...</p>"
    }

    const response = await window.api.detectVpn()

    if (response.success) {
      const vpnData = response.data

      if (vpnData.vpnDetected) {
        if (vpnStatusContent) {
          vpnStatusContent.innerHTML = `
            <div class="alert alert-info">
              <strong>VPN Detected!</strong>
              <div>Interfaces: ${vpnData.detectedInterfaces.join(", ")}</div>
            </div>
          `
        }
      } else {
        if (vpnStatusContent) {
          vpnStatusContent.innerHTML = `
            <div class="alert alert-secondary">
              No VPN connection detected.
            </div>
          `
        }
      }
    } else {
      if (vpnStatusContent) {
        vpnStatusContent.innerHTML = `<p class="text-danger">Error: ${response.error}</p>`
      }
    }
  } catch (error) {
    console.error("Error detecting VPN:", error)
    if (vpnStatusContent) {
      vpnStatusContent.innerHTML = `<p class="text-danger">Error detecting VPN: ${error.message}</p>`
    }
  }
}

// Function to run speed test
async function runSpeedTest() {
  const speedTestResultsContent = document.getElementById("speed-test-results")
  const runSpeedTestBtn = document.getElementById("run-speed-test")

  try {
    if (speedTestResultsContent) {
      speedTestResultsContent.innerHTML = `
        <div class="alert alert-info">
          Running speed test... This may take a minute.
          <div class="spinner-border spinner-border-sm ms-2" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      `
    }

    // Disable the button while test is running
    if (runSpeedTestBtn) {
      runSpeedTestBtn.disabled = true
    }

    const response = await window.api.runSpeedTest()

    // Re-enable the button
    if (runSpeedTestBtn) {
      runSpeedTestBtn.disabled = false
    }

    if (response.success) {
      const speedData = response.data

      if (speedTestResultsContent) {
        speedTestResultsContent.innerHTML = `
          <div class="alert alert-success">
            <strong>Speed Test Results:</strong>
            <div>Download: ${speedData.download.toFixed(2)} Mbps</div>
            <div>Upload: ${speedData.upload.toFixed(2)} Mbps</div>
            <div>Ping: ${speedData.ping.toFixed(2)} ms</div>
            <div class="mt-2">
              <small>Server: ${speedData.server.name}, ${speedData.server.location}, ${speedData.server.country}</small>
            </div>
          </div>
        `
      }
    } else {
      if (speedTestResultsContent) {
        speedTestResultsContent.innerHTML = `<p class="text-danger">Error: ${response.error}</p>`
      }
    }
  } catch (error) {
    console.error("Error running speed test:", error)
    if (speedTestResultsContent) {
      speedTestResultsContent.innerHTML = `<p class="text-danger">Error running speed test: ${error.message}</p>`
    }

    // Re-enable the button
    if (runSpeedTestBtn) {
      runSpeedTestBtn.disabled = false
    }
  }
}

/**
 * Network Traffic Monitoring
 */
function initNetworkTraffic() {
  const networkTrafficContent = document.getElementById("network-traffic-content")
  const startMonitoringBtn = document.getElementById("start-monitoring")
  const stopMonitoringBtn = document.getElementById("stop-monitoring")

  let isMonitoring = false
  let unsubscribeFromUpdates = null

  // Set up start monitoring button
  if (startMonitoringBtn) {
    startMonitoringBtn.addEventListener("click", startMonitoring)
  }

  // Set up stop monitoring button
  if (stopMonitoringBtn) {
    stopMonitoringBtn.addEventListener("click", stopMonitoring)
  }

  // Function to start network monitoring
  async function startMonitoring() {
    try {
      if (isMonitoring) {
        return
      }

      if (networkTrafficContent) {
        networkTrafficContent.innerHTML = "<p>Starting network monitoring...</p>"
      }

      const response = await window.api.startNetworkMonitoring()

      if (response.success) {
        isMonitoring = true

        if (startMonitoringBtn) {
          startMonitoringBtn.disabled = true
        }

        if (stopMonitoringBtn) {
          stopMonitoringBtn.disabled = false
        }

        // Get initial network traffic data
        const trafficResponse = await window.api.getNetworkTraffic()

        if (trafficResponse.success) {
          displayNetworkTraffic(trafficResponse.data)
        }

        // Subscribe to updates
        unsubscribeFromUpdates = window.api.onNetworkTrafficUpdate((data) => {
          displayNetworkTraffic(data)
        })
      } else {
        if (networkTrafficContent) {
          networkTrafficContent.innerHTML = `<p class="text-danger">Error: ${response.error}</p>`
        }
      }
    } catch (error) {
      console.error("Error starting network monitoring:", error)
      if (networkTrafficContent) {
        networkTrafficContent.innerHTML = `<p class="text-danger">Error starting network monitoring: ${error.message}</p>`
      }
    }
  }

  // Function to stop network monitoring
  async function stopMonitoring() {
    try {
      if (!isMonitoring) {
        return
      }

      const response = await window.api.stopNetworkMonitoring()

      if (response.success) {
        isMonitoring = false

        if (startMonitoringBtn) {
          startMonitoringBtn.disabled = false
        }

        if (stopMonitoringBtn) {
          stopMonitoringBtn.disabled = true
        }

        // Unsubscribe from updates
        if (unsubscribeFromUpdates) {
          unsubscribeFromUpdates()
          unsubscribeFromUpdates = null
        }

        if (networkTrafficContent) {
          networkTrafficContent.innerHTML = "<p>Network monitoring stopped.</p>"
        }
      } else {
        if (networkTrafficContent) {
          networkTrafficContent.innerHTML = `<p class="text-danger">Error: ${response.error}</p>`
        }
      }
    } catch (error) {
      console.error("Error stopping network monitoring:", error)
      if (networkTrafficContent) {
        networkTrafficContent.innerHTML = `<p class="text-danger">Error stopping network monitoring: ${error.message}</p>`
      }
    }
  }

  // Function to display network traffic
  function displayNetworkTraffic(connections) {
    if (!networkTrafficContent) return

    if (!connections || connections.length === 0) {
      networkTrafficContent.innerHTML = "<p>No active network connections found.</p>"
      return
    }

    let html = `<h5>Active Network Connections (${connections.length})</h5>`
    html += '<div class="table-responsive">'
    html += '<table class="table table-sm table-striped">'

    if (process.platform === "darwin" || process.platform === "linux") {
      html += "<thead><tr><th>Command</th><th>PID</th><th>User</th><th>Type</th><th>Address</th></tr></thead>"
      html += "<tbody>"

      for (const conn of connections.slice(0, 20)) {
        html += `<tr>
          <td>${conn.command || "N/A"}</td>
          <td>${conn.pid || "N/A"}</td>
          <td>${conn.user || "N/A"}</td>
          <td>${conn.type || "N/A"}</td>
          <td>${conn.address || "N/A"}</td>
        </tr>`
      }
    } else if (process.platform === "win32") {
      html +=
        "<thead><tr><th>Protocol</th><th>Local Address</th><th>Foreign Address</th><th>State</th><th>PID</th></tr></thead>"
      html += "<tbody>"

      for (const conn of connections.slice(0, 20)) {
        html += `<tr>
          <td>${conn.protocol || "N/A"}</td>
          <td>${conn.localAddress || "N/A"}</td>
          <td>${conn.foreignAddress || "N/A"}</td>
          <td>${conn.state || "N/A"}</td>
          <td>${conn.pid || "N/A"}</td>
        </tr>`
      }
    }

    html += "</tbody></table></div>"

    if (connections.length > 20) {
      html += `<p class="small text-muted">Showing 20 of ${connections.length} connections</p>`
    }

    networkTrafficContent.innerHTML = html
  }
}

/**
 * Cache Management Module
 */
function initCacheManagement() {
  const cacheContent = document.getElementById("cache-content")

  // No need to load anything on init for cache management
}

// Function to scan cache
async function scanCache() {
  const cacheContent = document.getElementById("cache-content")

  try {
    if (cacheContent) {
      cacheContent.innerHTML = "<p>Scanning for cache files...</p>"
    }

    const response = await window.api.scanCache()

    if (response.success) {
      const cacheLocations = response.data

      if (cacheLocations.length === 0) {
        if (cacheContent) {
          cacheContent.innerHTML = "<p>No cache locations found.</p>"
        }
        return
      }

      let html = "<h5>Cache Locations:</h5>"
      html += '<div class="list-group">'

      for (const location of cacheLocations) {
        html += `
          <div class="list-group-item">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <strong>${location.path}</strong>
                <div>Last Modified: ${new Date(location.lastModified).toLocaleString()}</div>
              </div>
              <button class="btn btn-sm btn-warning clean-specific-cache-btn" data-path="${location.path}">Clean</button>
            </div>
          </div>
        `
      }

      html += "</div>"

      if (cacheContent) {
        cacheContent.innerHTML = html

        // Add event listeners to clean buttons
        document.querySelectorAll(".clean-specific-cache-btn").forEach((button) => {
          button.addEventListener("click", async (event) => {
            const cachePath = event.target.getAttribute("data-path")
            await cleanSpecificCache(cachePath)
          })
        })
      }
    } else {
      if (cacheContent) {
        cacheContent.innerHTML = `<p class="text-danger">Error: ${response.error}</p>`
      }
    }
  } catch (error) {
    console.error("Error scanning cache:", error)
    if (cacheContent) {
      cacheContent.innerHTML = `<p class="text-danger">Error scanning cache: ${error.message}</p>`
    }
  }
}

// Function to clean all cache
async function cleanCache() {
  const cacheContent = document.getElementById("cache-content")

  try {
    if (cacheContent) {
      cacheContent.innerHTML = "<p>Cleaning all cache files...</p>"
    }

    const response = await window.api.cleanCache()

    if (response.success) {
      if (cacheContent) {
        cacheContent.innerHTML = '<p class="text-success">Cache cleaned successfully!</p>'
      }

      // Rescan after cleaning
      setTimeout(scanCache, 1000)
    } else {
      if (cacheContent) {
        cacheContent.innerHTML = `<p class="text-danger">Error: ${response.error}</p>`
      }
    }
  } catch (error) {
    console.error("Error cleaning cache:", error)
    if (cacheContent) {
      cacheContent.innerHTML = `<p class="text-danger">Error cleaning cache: ${error.message}</p>`
    }
  }
}

// Function to clean specific cache
async function cleanSpecificCache(cachePath) {
  const cacheContent = document.getElementById("cache-content")

  try {
    if (cacheContent) {
      cacheContent.innerHTML = `<p>Cleaning cache at ${cachePath}...</p>`
    }

    const response = await window.api.cleanCache(cachePath)

    if (response.success) {
      if (cacheContent) {
        cacheContent.innerHTML = `<p class="text-success">Cache at ${cachePath} cleaned successfully!</p>`
      }

      // Rescan after cleaning
      setTimeout(scanCache, 1000)
    } else {
      if (cacheContent) {
        cacheContent.innerHTML = `<p class="text-danger">Error: ${response.error}</p>`
      }
    }
  } catch (error) {
    console.error("Error cleaning specific cache:", error)
    if (cacheContent) {
      cacheContent.innerHTML = `<p class="text-danger">Error cleaning cache: ${error.message}</p>`
    }
  }
}

/**
 * Running Applications Module
 */
function initRunningApplications() {
  const runningApplicationsContent = document.getElementById("running-applications-content")

  // Load running applications on page load
  loadRunningApplications()
}

// Function to load running applications
async function loadRunningApplications() {
  const runningApplicationsContent = document.getElementById("running-applications-content")

  try {
    if (runningApplicationsContent) {
      runningApplicationsContent.innerHTML = "<p>Loading running applications...</p>"
    }

    const response = await window.api.getRunningApplications()

    if (response.success) {
      const applications = response.data

      if (applications.length === 0) {
        if (runningApplicationsContent) {
          runningApplicationsContent.innerHTML = "<p>No applications found.</p>"
        }
        return
      }

      let html = `<h5>Running Applications (${applications.length})</h5>`
      html += '<div class="list-group">'

      for (const app of applications) {
        html += `
          <div class="app-list-item d-flex justify-content-between align-items-center">
            <div>
              <div><strong>${app.name}</strong> (PID: ${app.pid})</div>
              <div class="small text-muted">Memory: ${formatBytes(app.memory * 1024 * 1024)}, CPU: ${app.cpu.toFixed(1)}%</div>
            </div>
            <button class="btn btn-sm btn-danger close-app-btn" data-pid="${app.pid}">Close</button>
          </div>
        `
      }

      html += "</div>"

      if (runningApplicationsContent) {
        runningApplicationsContent.innerHTML = html

        // Add event listeners to close buttons
        document.querySelectorAll(".close-app-btn").forEach((button) => {
          button.addEventListener("click", async (event) => {
            const pid = event.target.getAttribute("data-pid")
            await closeApplication(pid)
          })
        })
      }
    } else {
      if (runningApplicationsContent) {
        runningApplicationsContent.innerHTML = `<p class="text-danger">Error: ${response.error}</p>`
      }
    }
  } catch (error) {
    console.error("Error loading running applications:", error)
    if (runningApplicationsContent) {
      runningApplicationsContent.innerHTML = `<p class="text-danger">Error loading running applications: ${error.message}</p>`
    }
  }
}

// Function to close an application
async function closeApplication(pid) {
  try {
    if (!confirm(`Are you sure you want to close the application with PID ${pid}?`)) {
      return
    }

    const response = await window.api.closeApplication(pid)

    if (response.success) {
      showNotification(`Application with PID ${pid} closed successfully`)
      // Refresh the list after closing
      loadRunningApplications()
    } else {
      // Check if the process no longer exists
      if (response.error && response.error.includes("no longer exists")) {
        showNotification(`The application with PID ${pid} is no longer running. Refreshing list...`)
        loadRunningApplications()
      } else {
        showNotification(`Error closing application: ${response.error}`, "error")
      }
    }
  } catch (error) {
    console.error("Error closing application:", error)
    showNotification(`Error closing application: ${error.message}`, "error")
  }
}

/**
 * Diagnostics Module
 */
function initDiagnostics() {
  const diagnosticsStatus = document.getElementById("diagnostics-status")
  const diagnosticsResults = document.getElementById("diagnostics-results")
}

// Function to run diagnostics
async function runDiagnostics() {
  const diagnosticsStatus = document.getElementById("diagnostics-status")
  const diagnosticsResults = document.getElementById("diagnostics-results")

  try {
    if (diagnosticsStatus) {
      diagnosticsStatus.innerHTML =
        '<p>Running diagnostics... <div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div></p>'
    }

    const response = await window.api.runDiagnostics()

    if (response.success) {
      const issues = response.data

      if (diagnosticsStatus) {
        diagnosticsStatus.innerHTML = `<p>Diagnostics completed. Found ${issues.length} issues.</p>`
      }

      displayDiagnosticResults(issues)
    } else {
      if (diagnosticsStatus) {
        diagnosticsStatus.innerHTML = `<p class="text-danger">Error running diagnostics: ${response.error}</p>`
      }

      if (diagnosticsResults) {
        diagnosticsResults.innerHTML = ""
      }
    }
  } catch (error) {
    console.error("Error running diagnostics:", error)

    if (diagnosticsStatus) {
      diagnosticsStatus.innerHTML = `<p class="text-danger">Error running diagnostics: ${error.message}</p>`
    }

    if (diagnosticsResults) {
      diagnosticsResults.innerHTML = ""
    }
  }
}

// Function to display diagnostic results
function displayDiagnosticResults(issues) {
  const diagnosticsResults = document.getElementById("diagnostics-results")

  if (!diagnosticsResults) return

  if (issues.length === 0) {
    diagnosticsResults.innerHTML =
      '<div class="alert alert-success">No issues detected. Your system is running well.</div>'
    return
  }

  // Group issues by type
  const issuesByType = {}

  for (const issue of issues) {
    if (!issuesByType[issue.type]) {
      issuesByType[issue.type] = []
    }

    issuesByType[issue.type].push(issue)
  }

  let html = ""

  // Display issues by type
  for (const [type, typeIssues] of Object.entries(issuesByType)) {
    html += `<h4 class="mt-4">${type.charAt(0).toUpperCase() + type.slice(1)} Issues</h4>`

    for (const issue of typeIssues) {
      html += `
        <div class="issue-item ${issue.severity} mb-3">
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
  }

  diagnosticsResults.innerHTML = html

  // Add event listeners to fix buttons
  document.querySelectorAll(".fix-issue-btn").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const issueId = event.target.getAttribute("data-issue-id")
      await fixIssue(issueId)
    })
  })
}

// Function to fix an issue
async function fixIssue(issueId) {
  const diagnosticsStatus = document.getElementById("diagnostics-status")

  try {
    if (diagnosticsStatus) {
      diagnosticsStatus.innerHTML = `<p>Attempting to fix issue: ${issueId}...</p>`
    }

    const result = await window.api.fixIssue(issueId)

    if (result.success) {
      if (diagnosticsStatus) {
        diagnosticsStatus.innerHTML = '<p class="text-success">Issue fixed successfully</p>'
      }

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
            runDiagnostics()
          } else {
            showNotification(`Error closing application: ${closeResult.error}`, "error")
          }
        }
      } else {
        // Refresh diagnostics
        runDiagnostics()
      }
    } else {
      if (diagnosticsStatus) {
        diagnosticsStatus.innerHTML = `<p class="text-danger">Error fixing issue: ${result.error}</p>`
      }
    }
  } catch (error) {
    console.error("Error fixing issue:", error)

    if (diagnosticsStatus) {
      diagnosticsStatus.innerHTML = `<p class="text-danger">Error fixing issue: ${error.message}</p>`
    }
  }
}

/**
 * Hardware Health Module
 */
function initHardwareHealth() {
  const hardwareHealthContent = document.getElementById("hardware-health-content")
  const refreshHardwareBtn = document.getElementById("refresh-hardware")

  // Load hardware health on page load
  loadHardwareHealth()

  // Set up refresh button
  if (refreshHardwareBtn) {
    refreshHardwareBtn.addEventListener("click", loadHardwareHealth)
  }

  async function loadHardwareHealth() {
    try {
      if (hardwareHealthContent) {
        hardwareHealthContent.innerHTML = "<p>Loading hardware health information...</p>"
      }

      const response = await window.api.getHardwareHealth()

      if (response.success) {
        const hardwareHealth = response.data

        let html = '<div class="row">'

        // CPU temperature
        html += '<div class="col-md-6">'
        html += '<div class="hardware-metric">'
        html += '<div class="hardware-metric-icon">🌡️</div>'
        html += "<div>"
        html += `<div class="hardware-metric-value">${hardwareHealth.cpuTemp ? `${hardwareHealth.cpuTemp.toFixed(1)}°C` : "N/A"}</div>`
        html += '<div class="hardware-metric-label">CPU Temperature</div>'
        html += "</div>"
        html += "</div>"
        html += "</div>"

        // Fan speed
        html += '<div class="col-md-6">'
        html += '<div class="hardware-metric">'
        html += '<div class="hardware-metric-icon">💨</div>'
        html += "<div>"
        html += `<div class="hardware-metric-value">${hardwareHealth.fanSpeeds && hardwareHealth.fanSpeeds.length > 0 ? `${hardwareHealth.fanSpeeds[0]} RPM` : "N/A"}</div>`
        html += '<div class="hardware-metric-label">Fan Speed</div>'
        html += "</div>"
        html += "</div>"
        html += "</div>"

        // Battery health
        html += '<div class="col-md-6">'
        html += '<div class="hardware-metric">'
        html += '<div class="hardware-metric-icon">🔋</div>'
        html += "<div>"
        html += `<div class="hardware-metric-value">${hardwareHealth.batteryHealth || "N/A"}</div>`
        html += '<div class="hardware-metric-label">Battery Health</div>'
        html += "</div>"
        html += "</div>"
        html += "</div>"

        // Storage health
        html += '<div class="col-md-6">'
        html += '<div class="hardware-metric">'
        html += '<div class="hardware-metric-icon">💾</div>'
        html += "<div>"
        html += `<div class="hardware-metric-value">${hardwareHealth.storageHealth || "N/A"}</div>`
        html += '<div class="hardware-metric-label">Storage Health</div>'
        html += "</div>"
        html += "</div>"
        html += "</div>"

        html += "</div>"

        if (hardwareHealthContent) {
          hardwareHealthContent.innerHTML = html
        }

        // Initialize temperature chart if Chart.js is available
        initTemperatureChart()
      } else {
        if (hardwareHealthContent) {
          hardwareHealthContent.innerHTML = `<p class="text-danger">Error: ${response.error}</p>`
        }
      }
    } catch (error) {
      console.error("Error loading hardware health:", error)
      if (hardwareHealthContent) {
        hardwareHealthContent.innerHTML = `<p class="text-danger">Error loading hardware health: ${error.message}</p>`
      }
    }
  }

  function initTemperatureChart() {
    const temperatureChart = document.getElementById("temperature-chart")

    if (!temperatureChart || !window.Chart) {
      console.log("Temperature chart element or Chart.js not available")
      return
    }

    try {
      // Sample data for the chart
      const labels = Array.from({ length: 10 }, (_, i) => `${i * 5} min ago`).reverse()
      const temperatureData = Array.from({ length: 10 }, () => Math.random() * 20 + 40) // Random temps between 40-60°C

      // Create chart
      new window.Chart(temperatureChart, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "CPU Temperature (°C)",
              data: temperatureData,
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.1)",
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: false,
              min: 30,
              max: 90,
              title: {
                display: true,
                text: "Temperature (°C)",
              },
            },
          },
        },
      })
    } catch (error) {
      console.error("Error initializing temperature chart:", error)
    }
  }
}

/**
 * Security Scanner Module
 */
function initSecurityScanner() {
  const vulnerabilitiesContent = document.getElementById("vulnerabilities-content")
  const securityEventsContent = document.getElementById("security-events-content")
  const scanVulnerabilitiesBtn = document.getElementById("scan-vulnerabilities")

  // Set up scan button in the security tab
  if (scanVulnerabilitiesBtn) {
    scanVulnerabilitiesBtn.addEventListener("click", scanVulnerabilities)
  }

  // Function to scan for vulnerabilities
  async function scanVulnerabilities() {
    try {
      if (vulnerabilitiesContent) {
        vulnerabilitiesContent.innerHTML = "<p>Scanning for vulnerabilities...</p>"
      }

      const response = await window.api.scanVulnerabilities()

      if (response.success) {
        const vulnerabilities = response.data

        if (vulnerabilities.length === 0) {
          if (vulnerabilitiesContent) {
            vulnerabilitiesContent.innerHTML = `
              <div class="alert alert-success">
                <strong>No vulnerabilities found!</strong>
                <p>Your system appears to be secure.</p>
              </div>
            `
          }
          return
        }

        let html = `<h5>Found ${vulnerabilities.length} potential vulnerabilities:</h5>`
        html += '<div class="list-group">'

        for (const vuln of vulnerabilities) {
          let severityClass = "bg-warning"

          if (vuln.severity === "high") {
            severityClass = "bg-danger"
          } else if (vuln.severity === "low") {
            severityClass = "bg-info"
          }

          html += `
            <div class="list-group-item">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <div class="d-flex align-items-center">
                    <span class="badge ${severityClass} me-2">${vuln.severity}</span>
                    <strong>${vuln.type.replace("_", " ").toUpperCase()}</strong>
                  </div>
                  <div class="mt-1">${vuln.details}</div>
                </div>
              </div>
            </div>
          `
        }

        html += "</div>"

        if (vulnerabilitiesContent) {
          vulnerabilitiesContent.innerHTML = html
        }

        // Load security events
        loadSecurityEvents()
      } else {
        if (vulnerabilitiesContent) {
          vulnerabilitiesContent.innerHTML = `<p class="text-danger">Error: ${response.error}</p>`
        }
      }
    } catch (error) {
      console.error("Error scanning for vulnerabilities:", error)
      if (vulnerabilitiesContent) {
        vulnerabilitiesContent.innerHTML = `<p class="text-danger">Error scanning for vulnerabilities: ${error.message}</p>`
      }
    }
  }

  // Function to load security events
  async function loadSecurityEvents() {
    try {
      if (securityEventsContent) {
        securityEventsContent.innerHTML = "<p>Loading security events...</p>"
      }

      const response = await window.api.getHistoricalData("events")

      if (response.success) {
        const events = response.data
          ? response.data.filter(
              (event) =>
                event.event_type &&
                (event.event_type.includes("vulnerability") ||
                  event.severity === "warning" ||
                  event.severity === "error"),
            )
          : []

        if (events.length === 0) {
          if (securityEventsContent) {
            securityEventsContent.innerHTML = "<p>No security events found.</p>"
          }
          return
        }

        let html = '<div class="table-responsive">'
        html += '<table class="table table-sm table-striped">'
        html += "<thead><tr><th>Time</th><th>Type</th><th>Description</th><th>Severity</th></tr></thead>"
        html += "<tbody>"

        for (const event of events.slice(0, 10)) {
          let severityClass = ""

          if (event.severity === "warning") {
            severityClass = "text-warning"
          } else if (event.severity === "error") {
            severityClass = "text-danger"
          }

          html += `<tr>
            <td>${new Date(event.timestamp).toLocaleString()}</td>
            <td>${event.event_type ? event.event_type.replace("_", " ") : "N/A"}</td>
            <td>${event.description || "N/A"}</td>
            <td class="${severityClass}">${event.severity || "N/A"}</td>
          </tr>`
        }

        html += "</tbody></table></div>"

        if (events.length > 10) {
          html += `<p class="small text-muted">Showing 10 of ${events.length} events</p>`
        }

        if (securityEventsContent) {
          securityEventsContent.innerHTML = html
        }
      } else {
        if (securityEventsContent) {
          securityEventsContent.innerHTML = `<p class="text-danger">Error: ${response.error}</p>`
        }
      }
    } catch (error) {
      console.error("Error loading security events:", error)
      if (securityEventsContent) {
        securityEventsContent.innerHTML = `<p class="text-danger">Error loading security events: ${error.message}</p>`
      }
    }
  }

  // Load security events on initialization
  loadSecurityEvents()
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
  const notification = document.getElementById("notification")
  const notificationMessage = document.getElementById("notification-message")

  if (!notification || !notificationMessage) {
    // Fallback to alert if notification elements don't exist
    alert(message)
    return
  }

  // Set notification color based on type
  if (type === "error") {
    notification.style.backgroundColor = "#dc3545"
  } else if (type === "warning") {
    notification.style.backgroundColor = "#ffc107"
    notification.style.color = "#000"
  } else if (type === "success") {
    notification.style.backgroundColor = "#198754"
  } else {
    notification.style.backgroundColor = "#0d6efd"
  }

  // Set message
  notificationMessage.textContent = message

  // Show notification
  notification.classList.add("show")

  // Hide after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show")
  }, 3000)
}

