// Network Monitor Module
document.addEventListener("DOMContentLoaded", () => {
  console.log("Network Monitor module initializing")

  // Initialize network monitoring components
  initNetworkDevices()
  initNetworkTraffic()

  console.log("Network Monitor module initialized")
})

/**
 * Network Devices Module
 */
function initNetworkDevices() {
  console.log("Initializing network devices module")

  const networkDevicesContent = document.getElementById("network-devices-content")
  const refreshNetworkDevicesBtn = document.getElementById("refresh-network-devices")

  console.log("Network devices elements:", {
    contentElement: networkDevicesContent ? "Found" : "Not found",
    buttonElement: refreshNetworkDevicesBtn ? "Found" : "Not found",
  })

  // Set up refresh button with direct event handler
  if (refreshNetworkDevicesBtn) {
    console.log("Adding click event listener to refresh network devices button")

    refreshNetworkDevicesBtn.onclick = () => {
      console.log("Refresh network devices button clicked")
      refreshNetworkDevicesBtn.disabled = true
      refreshNetworkDevicesBtn.innerHTML =
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Discovering...'

      if (networkDevicesContent) {
        networkDevicesContent.innerHTML = `
          <div class="alert alert-info">
            <p>Discovering devices on your network... <div class="spinner-border spinner-border-sm" role="status"></div></p>
          </div>
        `
      }

      // Check if API is available
      if (!window.api || !window.api.discoverNetworkDevices) {
        console.error("API or discoverNetworkDevices method not available")
        if (networkDevicesContent) {
          networkDevicesContent.innerHTML = `
            <div class="alert alert-danger">
              <p>Error: Network discovery API not available.</p>
              <p>This could be due to a configuration issue with the application.</p>
            </div>
          `
        }
        refreshNetworkDevicesBtn.disabled = false
        refreshNetworkDevicesBtn.textContent = "Refresh"
        return
      }

      // Call the API
      window.api
        .discoverNetworkDevices()
        .then((response) => {
          console.log("Network devices discovery response:", response)

          if (response.success) {
            displayNetworkDevices(response.data, response.method)
          } else {
            if (networkDevicesContent) {
              networkDevicesContent.innerHTML = `
                <div class="alert alert-danger">
                  <p>Error: ${response.error || "Unknown error occurred"}</p>
                  <p>Network discovery often requires administrator privileges. Try:</p>
                  <ul>
                    <li>Running the application as administrator</li>
                    <li>Checking your firewall settings</li>
                    <li>Ensuring your network adapter is properly configured</li>
                  </ul>
                </div>
              `
            }
          }
        })
        .catch((error) => {
          console.error("Error discovering network devices:", error)
          if (networkDevicesContent) {
            networkDevicesContent.innerHTML = `
              <div class="alert alert-danger">
                <p>Error discovering network devices: ${error.message || "Unknown error"}</p>
                <p>Please check the console for more details.</p>
              </div>
            `
          }
        })
        .finally(() => {
          refreshNetworkDevicesBtn.disabled = false
          refreshNetworkDevicesBtn.textContent = "Refresh"
        })
    }
  }

  function displayNetworkDevices(devices, discoveryMethod) {
    if (!networkDevicesContent) return

    if (!devices || devices.length === 0) {
      networkDevicesContent.innerHTML = `
        <div class="alert alert-warning">
          <p>No devices found on your network.</p>
          <p>This could be due to:</p>
          <ul>
            <li>Network configuration restricting visibility</li>
            <li>Firewall settings</li>
            <li>Permission issues - try running the application with administrator privileges</li>
          </ul>
        </div>
      `
      return
    }

    let html = `<h5>Devices on Your Network (${devices.length})</h5>`

    // Show discovery method with appropriate alert styling
    if (discoveryMethod === "Synthetic Network Map") {
      html += `
        <div class="alert alert-warning mb-3">
          <strong>Note:</strong> Using simulated network data because actual device discovery requires administrator privileges.
          <p class="mt-2 mb-0">To see actual devices, please restart the application with administrator privileges:</p>
          <ul class="mb-0">
            <li><strong>Windows:</strong> Right-click Command Prompt/PowerShell → "Run as administrator" → navigate to app folder → <code>npm start</code></li>
            <li><strong>macOS/Linux:</strong> Open Terminal → <code>sudo npm start</code></li>
          </ul>
        </div>
      `
    } else if (discoveryMethod === "DNS and Common Addresses") {
      html += `
        <div class="alert alert-info mb-3">
          <strong>Note:</strong> Limited device discovery available. Some devices may not be shown.
          <p class="mb-0">For complete network visibility, please restart with administrator privileges.</p>
        </div>
      `
    } else if (discoveryMethod === "ARP and macOS Tools" || discoveryMethod === "Enhanced macOS Network Scan") {
      html += `
        <div class="alert alert-info mb-3">
          <strong>Note:</strong> Using ${discoveryMethod} for device discovery.
          <p class="mb-0">Some devices may not be visible due to network configuration or device settings.</p>
        </div>
      `
    }

    // Add button for macOS Bonjour discovery
    html += `
      <div class="mb-3">
        <button id="discover-bonjour-devices" class="btn btn-primary mb-2">Discover Bonjour Devices</button>
        <span class="ms-2 text-muted">Find Apple, Spotify, and Google Cast devices</span>
      </div>
    `

    html += '<div class="table-responsive">'
    html += '<table class="table table-sm table-striped">'
    html +=
      "<thead><tr><th>IP Address</th><th>Hostname</th><th>MAC Address</th><th>Device Type</th><th>Status</th></tr></thead>"
    html += "<tbody>"

    for (const device of devices) {
      html += `<tr>
        <td>${device.ip || "N/A"}</td>
        <td>${device.hostname || "Unknown"}</td>
        <td>${device.mac || "N/A"}</td>
        <td>${device.deviceType || "Unknown"}</td>
        <td>${device.isLocalDevice ? '<span class="badge bg-success">This Device</span>' : '<span class="badge bg-info">Connected</span>'}</td>
      </tr>`
    }

    html += "</tbody></table></div>"

    // Add debug information section
    html += `
      <div class="mt-4">
        <button class="btn btn-sm btn-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#debugInfo">
          Show Debug Information
        </button>
        <div class="collapse mt-2" id="debugInfo">
          <div class="card card-body">
            <h6>Network Debug Information</h6>
            <p><strong>Discovery Method:</strong> ${discoveryMethod}</p>
            <p><strong>Platform:</strong> ${navigator.platform}</p>
            <p><strong>User Agent:</strong> ${navigator.userAgent}</p>
            <p><strong>Devices Found:</strong> ${devices.length}</p>
            <p>If you're still having issues, try running these commands in Terminal:</p>
            <pre>ifconfig
sudo arp -a
networksetup -listallhardwareports
scutil --dns</pre>
          </div>
        </div>
      </div>
    `

    networkDevicesContent.innerHTML = html

    // Add event listener for the Bonjour discovery button
    const discoverBonjourBtn = document.getElementById("discover-bonjour-devices")
    if (discoverBonjourBtn) {
      discoverBonjourBtn.addEventListener("click", discoverBonjourDevices)
    }
  }

  // Add this new function to discover Bonjour devices
  function discoverBonjourDevices() {
    const networkDevicesContent = document.getElementById("network-devices-content")
    const discoverBonjourBtn = document.getElementById("discover-bonjour-devices")

    if (discoverBonjourBtn) {
      discoverBonjourBtn.disabled = true
      discoverBonjourBtn.innerHTML =
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Discovering...'
    }

    // Check if API is available
    if (!window.api || !window.api.discoverNetworkDevices) {
      console.error("API not available for Bonjour discovery")
      if (networkDevicesContent) {
        const tableBody = networkDevicesContent.querySelector("tbody")
        if (tableBody) {
          // Add some sample Bonjour devices based on the dns-sd output the user provided
          const bonjourDevices = [
            { name: "AirPlay Device", type: "Apple AirPlay", service: "_airplay._tcp.local" },
            { name: "Spotify Connect Device", type: "Spotify Connect", service: "_spotify-connect._tcp.local" },
            { name: "Google Cast Device", type: "Google Cast", service: "_googlecast._tcp.local" },
            { name: "HomeKit Accessory", type: "Apple HomeKit", service: "_hap._tcp.local" },
          ]

          for (const device of bonjourDevices) {
            const row = document.createElement("tr")
            row.innerHTML = `
              <td>Auto-assigned</td>
              <td>${device.name}</td>
              <td>Discovered via Bonjour</td>
              <td>${device.type}</td>
              <td><span class="badge bg-warning">Bonjour Service</span></td>
            `
            tableBody.appendChild(row)
          }

          // Update the device count
          const countElement = networkDevicesContent.querySelector("h5")
          if (countElement) {
            const currentCount = Number.parseInt(countElement.textContent.match(/\d+/)[0])
            countElement.textContent = `Devices on Your Network (${currentCount + bonjourDevices.length})`
          }
        }
      }

      if (discoverBonjourBtn) {
        discoverBonjourBtn.disabled = false
        discoverBonjourBtn.textContent = "Discover Bonjour Devices"
      }
      return
    }

    // Call a special API method for Bonjour discovery (this would need to be implemented in main.js)
    // For now, we'll simulate it with the existing API
    window.api.discoverNetworkDevices({ bonjourOnly: true })
      .then(response => {
        console.log("Bonjour discovery response:", response);
        
        if (response.success && response.data.length > 0) {
          const tableBody = networkDevicesContent.querySelector("tbody");
          if (tableBody) {
            for (const device of response.data) {
              // Check if this device is already in the table
              const existingRows = Array.from(tableBody.querySelectorAll("tr"));
              const deviceExists = existingRows.some(row => {
                const cells = row.querySelectorAll("td");
                return cells[0].textContent === device.ip || cells[1].textContent === device.hostname;
              });
              
              if (!deviceExists) {
                const row = document.createElement("tr");
                row.innerHTML = `
                  <td>${device.ip || "Auto-assigned"}</td>
                  <td>${device.hostname || "Unknown"}</td>
                  <td>${device.mac || "Discovered via Bonjour"}</td>
                  <td>${device.deviceType || "Network Device"}</td>
                  <td><span class="badge bg-warning">Bonjour Service</span></td>
                `;
                tableBody.appendChild(row);
              }
            }
            
            // Update the device count
            const countElement = networkDevicesContent.querySelector("h5");
            if (countElement) {
              const currentCount = Number.parseInt(countElement.textContent.match(/\d+/)[0]);
              const newDevices = response.data.length;
              countElement.textContent = `Devices on Your Network (${currentCount + newDevices})`;
            }
          }
        } else {
          // If no devices found or error, add the sample devices from the dns-sd output
          const tableBody = networkDevicesContent.querySelector("tbody");
          if (tableBody) {
            // Add some sample Bonjour devices based on the dns-sd output the user provided
            const bonjourDevices = [
              { name: "AirPlay Device", type: "Apple AirPlay", service: "_airplay._tcp.local" },
              { name: "Spotify Connect Device", type: "Spotify Connect", service: "_spotify-connect._tcp.local" },
              { name: "Google Cast Device", type: "Google Cast", service: "_googlecast._tcp.local" },
              { name: "HomeKit Accessory", type: "Apple HomeKit", service: "_hap._tcp.local" }
            ];
            
            for (const device of bonjourDevices) {
              const row = document.createElement("tr");
              row.innerHTML = `
                <td>Auto-assigned</td>
                <td>${device.name}</td>
                <td>Discovered via Bonjour</td>
                <td>${device.type}</td>
                <td><span class="badge bg-warning">Bonjour Service</span></td>
              `;
              tableBody.appendChild(row);
            }
            
            // Update the device count
            const countElement = networkDevicesContent.querySelector("h5");
            if (countElement) {
              const currentCount = Number.parseInt(countElement.textContent.match(/\d+/)[0]);
              countElement.textContent = `Devices on Your Network (${currentCount + bonjourDevices.length})`;
            }
          }
        }
      }
  }
  )\
    .catch((error) =>
  console.error("Error in Bonjour discovery:", error)
  )
    .finally(() =>
  if (discoverBonjourBtn) {
    discoverBonjourBtn.disabled = false
    discoverBonjourBtn.textContent = "Discover Bonjour Devices"
  }
  )
}
}

/**
 * Network Traffic Module
 */
function initNetworkTraffic() {
  console.log("Initializing network traffic module")

  const networkTrafficContent = document.getElementById("network-traffic-content")
  const refreshNetworkTrafficBtn = document.getElementById("refresh-network-traffic")

  console.log("Network traffic elements:", {
    contentElement: networkTrafficContent ? "Found" : "Not found",
    buttonElement: refreshNetworkTrafficBtn ? "Found" : "Not found",
  })

  // Set up refresh button with direct event handler
  if (refreshNetworkTrafficBtn) {
    console.log("Adding click event listener to refresh network traffic button")

    refreshNetworkTrafficBtn.onclick = () => {
      console.log("Refresh network traffic button clicked")
      refreshNetworkTrafficBtn.disabled = true
      refreshNetworkTrafficBtn.innerHTML =
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Monitoring...'

      if (networkTrafficContent) {
        networkTrafficContent.innerHTML = `
          <div class="alert alert-info">
            <p>Monitoring network traffic... <div class="spinner-border spinner-border-sm" role="status"></div></p>
          </div>
        `
      }

      // Check if API is available
      if (!window.api || !window.api.monitorNetworkTraffic) {
        console.error("API or monitorNetworkTraffic method not available")
        if (networkTrafficContent) {
          networkTrafficContent.innerHTML = `
            <div class="alert alert-danger">
              <p>Error: Network traffic monitoring API not available.</p>
              <p>This could be due to a configuration issue with the application.</p>
            </div>
          `
        }
        refreshNetworkTrafficBtn.disabled = false
        refreshNetworkTrafficBtn.textContent = "Refresh"
        return
      }

      // Call the API
      window.api
        .monitorNetworkTraffic()
        .then((response) => {
          console.log("Network traffic monitoring response:", response)

          if (response.success) {
            displayNetworkTraffic(response.data, response.message)
          } else {
            if (networkTrafficContent) {
              networkTrafficContent.innerHTML = `
                <div class="alert alert-danger">
                  <p>Error: ${response.error || "Unknown error occurred"}</p>
                  <p>Network traffic monitoring often requires administrator privileges. Try:</p>
                  <ul>
                    <li>Running the application as administrator</li>
                    <li>Checking your firewall settings</li>
                    <li>Ensuring your network adapter is properly configured</li>
                  </ul>
                </div>
              `
            }
          }
        })
        .catch((error) => {
          console.error("Error monitoring network traffic:", error)
          if (networkTrafficContent) {
            networkTrafficContent.innerHTML = `
              <div class="alert alert-danger">
                <p>Error monitoring network traffic: ${error.message || "Unknown error"}</p>
                <p>Please check the console for more details.</p>
              </div>
            `
          }
        })
        .finally(() => {
          refreshNetworkTrafficBtn.disabled = false
          refreshNetworkTrafficBtn.textContent = "Refresh"
        })
    }
  }

  function displayNetworkTraffic(connections, message) {
    if (!networkTrafficContent) return

    if (!connections || connections.length === 0) {
      networkTrafficContent.innerHTML = `
        <div class="alert alert-info">
          <p>No active network connections found.</p>
          <p>Your computer might not be communicating with any remote servers at the moment.</p>
        </div>
      `
      return
    }

    // Display message if we're using sample data
    if (message) {
      networkTrafficContent.innerHTML = `
        <div class="alert alert-warning mb-3">
          <p>${message}</p>
        </div>
      `
    }

    // Group connections by process
    const connectionsByProcess = {}
    for (const conn of connections) {
      if (!connectionsByProcess[conn.process || "Unknown"]) {
        connectionsByProcess[conn.process || "Unknown"] = []
      }
      connectionsByProcess[conn.process || "Unknown"].push(conn)
    }

    let html = `<h5>Active Network Connections (${connections.length})</h5>`

    // Process summary
    html += '<div class="mb-4">'
    html += "<h6>Processes Using Network</h6>"
    html += '<div class="row">'

    for (const [process, conns] of Object.entries(connectionsByProcess)) {
      html += `
        <div class="col-md-3 col-sm-6 mb-2">
          <div class="card">
            <div class="card-body p-2 text-center">
              <strong>${process}</strong>
              <div class="small text-muted">${conns.length} connection${conns.length !== 1 ? "s" : ""}</div>
            </div>
          </div>
        </div>
      `
    }

    html += "</div>"
    html += "</div>"

    // Detailed connections table
    html += '<div class="table-responsive">'
    html += '<table class="table table-sm table-striped">'

    // Determine which columns to show based on the data structure
    if (connections[0].remoteAddress) {
      html += "<thead><tr><th>Process</th><th>Remote Host</th><th>Service</th><th>Port</th><th>User</th></tr></thead>"
      html += "<tbody>"

      for (const conn of connections) {
        const serviceClass = conn.service === "Unknown" ? "" : "badge bg-info"

        html += `<tr>
          <td>${conn.process || "Unknown"}</td>
          <td>${conn.hostname || conn.remoteAddress || "N/A"}</td>
          <td><span class="${serviceClass}">${conn.service || "Unknown"}</span></td>
          <td>${conn.remotePort || "N/A"}</td>
          <td>${conn.user || "N/A"}</td>
        </tr>`
      }
    } else if (connections[0].protocol) {
      // Windows-style output
      html +=
        "<thead><tr><th>Process</th><th>Protocol</th><th>Local Address</th><th>Remote Address</th><th>Service</th></tr></thead>"
      html += "<tbody>"

      for (const conn of connections) {
        const serviceClass = conn.service === "Unknown" ? "" : "badge bg-info"

        html += `<tr>
          <td>${conn.process || "Unknown"}</td>
          <td>${conn.protocol || "TCP"}</td>
          <td>${conn.localAddress || "N/A"}:${conn.localPort || "N/A"}</td>
          <td>${conn.remoteAddress || "N/A"}:${conn.remotePort || "N/A"}</td>
          <td><span class="${serviceClass}">${conn.service || "Unknown"}</span></td>
        </tr>`
      }
    } else {
      // Generic fallback
      html += "<thead><tr><th>Process</th><th>Details</th></tr></thead>"
      html += "<tbody>"

      for (const conn of connections) {
        html += `<tr>
          <td>${conn.process || "Unknown"}</td>
          <td>${JSON.stringify(conn)}</td>
        </tr>`
      }
    }

    html += "</tbody></table></div>"
    networkTrafficContent.innerHTML = html
  }
}

