/**
 * IT Support Assistant - L1 Support Duties
 *
 * This application can perform the following L1 support tasks:
 *
 * 1. System Information
 *    - Display detailed system information (OS, CPU, memory, etc.)
 *    - Monitor system performance metrics
 *
 * 2. Cache Management
 *    - Scan for cache files
 *    - Clean cache files to free up disk space
 *
 * 3. Network Diagnostics
 *    - Display network interface information
 *    - Detect VPN connections
 *    - Run network speed tests
 *    - Monitor network traffic and connections
 *
 * 4. Performance Monitoring
 *    - Track CPU, memory, and disk usage
 *    - Monitor application memory usage
 *
 * 5. Security Scanning
 *    - Scan for potential vulnerabilities
 *    - Check for outdated software and open ports
 *
 * 6. Process Management
 *    - List running applications with resource usage
 *    - Close unnecessary applications to free up system resources
 */

// This file serves as documentation for the IT Support Assistant capabilities
// It can be imported in other files if needed to expose these capabilities programmatically

// Export the capabilities as an object that can be used by other modules
module.exports = {
  capabilities: {
    systemInfo: {
      name: "System Information",
      description: "Display detailed system information and monitor performance metrics",
      functions: ["getSystemInfo", "getPerformanceMetrics"],
    },
    cacheManagement: {
      name: "Cache Management",
      description: "Scan for and clean cache files to free up disk space",
      functions: ["scanCache", "cleanCache"],
    },
    networkDiagnostics: {
      name: "Network Diagnostics",
      description: "Analyze network interfaces, detect VPNs, run speed tests, and monitor traffic",
      functions: ["getNetworkInfo", "detectVpn", "runSpeedTest", "getNetworkTraffic"],
    },
    performanceMonitoring: {
      name: "Performance Monitoring",
      description: "Track system resources and application memory usage",
      functions: ["getPerformanceMetrics", "getMemoryUsage"],
    },
    securityScanning: {
      name: "Security Scanning",
      description: "Scan for vulnerabilities, outdated software, and open ports",
      functions: ["scanVulnerabilities"],
    },
    processManagement: {
      name: "Process Management",
      description: "List and close unnecessary applications to free up system resources",
      functions: ["getRunningApplications", "closeApplication"],
    },
  },

  // Helper function to get all capability names
  getAllCapabilityNames: function () {
    return Object.keys(this.capabilities).map((key) => this.capabilities[key].name)
  },

  // Helper function to get all functions
  getAllFunctions: function () {
    return Object.keys(this.capabilities).reduce((acc, key) => {
      return acc.concat(this.capabilities[key].functions)
    }, [])
  },
}

