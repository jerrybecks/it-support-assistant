// Test Module
document.addEventListener("DOMContentLoaded", () => {
  console.log("Test module initializing")
  initTestFunctions()
})

/**
 * Test Functions Module
 */
function initTestFunctions() {
  const testSystemInfoBtn = document.getElementById("test-system-info")
  const testNetworkInfoBtn = document.getElementById("test-network-info")
  const testPerformanceBtn = document.getElementById("test-performance")
  const testCacheBtn = document.getElementById("test-cache")
  const testResultDiv = document.getElementById("test-result")

  // Set up test buttons
  if (testSystemInfoBtn) {
    testSystemInfoBtn.addEventListener("click", testSystemInfo)
  }

  if (testNetworkInfoBtn) {
    testNetworkInfoBtn.addEventListener("click", testNetworkInfo)
  }

  if (testPerformanceBtn) {
    testPerformanceBtn.addEventListener("click", testPerformance)
  }

  if (testCacheBtn) {
    testCacheBtn.addEventListener("click", testCache)
  }

  // Test system info
  async function testSystemInfo() {
    try {
      updateTestResult("Testing system info...")

      const result = await window.api.getSystemInfo()

      if (result.success) {
        const info = result.data
        let html = "<h5>System Info Test Results:</h5>"
        html += `<p><strong>Platform:</strong> ${info.platform} ${info.arch}</p>`
        html += `<p><strong>OS Version:</strong> ${info.release}</p>`
        html += `<p><strong>Hostname:</strong> ${info.hostname}</p>`
        html += `<p><strong>Uptime:</strong> ${formatUptime(info.uptime)}</p>`
        html += `<p><strong>CPU:</strong> ${info.cpus[0].model}</p>`
        html += `<p><strong>CPU Cores:</strong> ${info.cpus.length}</p>`
        html += `<p><strong>Total Memory:</strong> ${formatBytes(info.totalMemory)}</p>`
        html += `<p><strong>Free Memory:</strong> ${formatBytes(info.freeMemory)}</p>`

        updateTestResult(html)
      } else {
        updateTestResult(`<p class="text-danger">Error: ${result.error}</p>`)
      }
    } catch (error) {
      console.error("Error testing system info:", error)
      updateTestResult(`<p class="text-danger">Error: ${error.message}</p>`)
    }
  }

  // Test network info
  async function testNetworkInfo() {
    try {
      updateTestResult("Testing network info...")

      const result = await window.api.getNetworkInfo()

      if (result.success) {
        const interfaces = result.data
        let html = "<h5>Network Info Test Results:</h5>"

        if (interfaces.length === 0) {
          html += "<p>No network interfaces found.</p>"
        } else {
          html += "<ul>"
          for (const iface of interfaces) {
            html += `<li>
              <strong>${iface.name}</strong> (${iface.family})<br>
              Address: ${iface.address}<br>
              MAC: ${iface.mac}<br>
              Internal: ${iface.internal ? "Yes" : "No"}
            </li>`
          }
          html += "</ul>"
        }

        updateTestResult(html)
      } else {
        updateTestResult(`<p class="text-danger">Error: ${result.error}</p>`)
      }
    } catch (error) {
      console.error("Error testing network info:", error)
      updateTestResult(`<p class="text-danger">Error: ${error.message}</p>`)
    }
  }

  // Test performance metrics
  async function testPerformance() {
    try {
      updateTestResult("Testing performance metrics...")

      const result = await window.api.getPerformanceMetrics()

      if (result.success) {
        const metrics = result.data
        let html = "<h5>Performance Metrics Test Results:</h5>"

        // CPU metrics
        html += "<p><strong>CPU Load:</strong></p>"
        html += `<ul>
          <li>1 min: ${metrics.cpu[0].toFixed(2)}</li>
          <li>5 min: ${metrics.cpu[1].toFixed(2)}</li>
          <li>15 min: ${metrics.cpu[2].toFixed(2)}</li>
        </ul>`

        // Memory metrics
        html += "<p><strong>Memory Usage:</strong></p>"
        html += `<ul>
          <li>Total: ${formatBytes(metrics.memory.total)}</li>
          <li>Used: ${formatBytes(metrics.memory.used)}</li>
          <li>Free: ${formatBytes(metrics.memory.free)}</li>
          <li>Percentage: ${((metrics.memory.used / metrics.memory.total) * 100).toFixed(1)}%</li>
        </ul>`

        // Disk metrics
        if (metrics.disk && metrics.disk.capacity) {
          html += "<p><strong>Disk Usage:</strong></p>"
          html += `<ul>
            <li>Filesystem: ${metrics.disk.filesystem || "N/A"}</li>
            <li>Size: ${metrics.disk.size || "N/A"}</li>
            <li>Used: ${metrics.disk.used || "N/A"}</li>
            <li>Available: ${metrics.disk.available || "N/A"}</li>
            <li>Capacity: ${metrics.disk.capacity || "N/A"}</li>
          </ul>`
        }

        updateTestResult(html)
      } else {
        updateTestResult(`<p class="text-danger">Error: ${result.error}</p>`)
      }
    } catch (error) {
      console.error("Error testing performance metrics:", error)
      updateTestResult(`<p class="text-danger">Error: ${error.message}</p>`)
    }
  }

  // Test cache
  async function testCache() {
    try {
      updateTestResult("Testing cache scanning...")

      const result = await window.api.scanCache()

      if (result.success) {
        const cacheLocations = result.data
        let html = "<h5>Cache Test Results:</h5>"

        if (cacheLocations.length === 0) {
          html += "<p>No cache locations found.</p>"
        } else {
          let totalSize = 0
          html += "<ul>"
          for (const location of cacheLocations) {
            totalSize += location.size
            html += `<li>
              <strong>${location.path}</strong><br>
              Size: ${formatBytes(location.size)}<br>
              Last Modified: ${new Date(location.lastModified).toLocaleString()}
            </li>`
          }
          html += "</ul>"
          html += `<p><strong>Total Cache Size:</strong> ${formatBytes(totalSize)}</p>`
        }

        updateTestResult(html)
      } else {
        updateTestResult(`<p class="text-danger">Error: ${result.error}</p>`)
      }
    } catch (error) {
      console.error("Error testing cache:", error)
      updateTestResult(`<p class="text-danger">Error: ${error.message}</p>`)
    }
  }

  // Helper function to update test result
  function updateTestResult(content) {
    if (testResultDiv) {
      testResultDiv.innerHTML = content
    }
  }

  // Helper function to format bytes
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }

  // Helper function to format uptime
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
}

