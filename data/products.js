// Product data — extracted from sophos-field-guide.html
// Run `npm run extract` once you have the HTML file to populate this automatically.
// See scripts/extract-products.js

window.PRODUCTS = {
  // Placeholder — replace with extracted data from sophos-field-guide.html
  endpoint: {
    name: "Sophos Endpoint",
    subtitle: "Next-gen endpoint protection with AI-powered threat prevention.",
    tags: ["Endpoint", "EDR", "XDR", "AI"],
    screens: [
      {
        id: "endpoint_dashboard",
        name: "Dashboard",
        preview: "Overall endpoint health at a glance",
        what: "The Endpoint dashboard shows device health, policy compliance, and active threats across your entire fleet.",
        talk: "\"What you're looking at here is your complete endpoint posture in one view. Green means protected, any red here is something your team gets alerted on automatically.\"",
        points: [
          "Single pane for all endpoint health",
          "Policy compliance at a glance",
          "Automatic alerting on red states"
        ],
        action: "Point to the health summary widgets and explain what each color state means."
      }
    ],
    discoveryByAudience: {
      "IT Manager": [
        "How many endpoints are you managing today, and across how many locations?",
        "What does your current endpoint patching and update process look like?",
        "How do you handle an endpoint that's been offline for weeks and comes back onto the network?",
        "How long does it typically take your team to respond when an endpoint is flagged?",
        "What would a complete endpoint compromise cost your organization in downtime and recovery?"
      ],
      "Security Engineer": [
        "What telemetry are you currently collecting from endpoints, and where does it go?",
        "How are your EDR and SIEM tools integrated today?",
        "Walk me through your last endpoint incident — what did your investigation workflow look like?",
        "What gaps exist between your detection capability and your response capability?",
        "How do you handle threat hunting across your endpoint fleet currently?"
      ],
      "CTO / CISO": [
        "What's your current strategy for reducing dwell time on endpoint threats?",
        "How confident are you that you'd detect a living-off-the-land attack on your endpoints today?",
        "What endpoint risk visibility do you have for your board reporting?",
        "How are you thinking about consolidating your endpoint security stack in the next 12 months?",
        "What does a ransomware event on 10% of your fleet cost your business?"
      ],
      "MSP / Partner SE": [
        "How many endpoint tenants are you managing today?",
        "What's your biggest operational pain point across client endpoint estates?",
        "How do you currently handle client-to-client policy isolation?",
        "What does your escalation path look like when an endpoint event exceeds your team's capacity?",
        "How are you positioning endpoint security as a value-add versus a commodity in your MSP offering?"
      ]
    },
    objections: [
      {
        q: "We already have an endpoint solution — we're not looking to rip and replace.",
        a: "Completely understood. Most of our best conversations start exactly there. The question we'd ask is: are you getting the detection depth and response capability you need, or are you carrying the tool because switching feels hard? We can run alongside what you have today so you can compare."
      },
      {
        q: "Your price is higher than what we're paying now.",
        a: "The license cost is one line item. The real number is what you'd spend on a breach — recovery, forensics, downtime, reputational damage. We'd rather show you what the actual TCO looks like with and without a ransomware event factored in."
      }
    ],
    competitors: [
      {
        name: "vs CrowdStrike",
        points: [
          "Sophos MDR is included — CrowdStrike charges separately for managed response",
          "Simpler deployment and lower operational overhead for mid-market teams",
          "Adaptive Attack Protection activates automatically — no analyst required to trigger it"
        ]
      },
      {
        name: "vs SentinelOne",
        points: [
          "Synchronized Security — Sophos Firewall and Endpoint share threat context natively",
          "Sophos Central consolidates endpoint, email, firewall, and more into one console",
          "MDR service proven at scale — largest MDR customer base in the industry"
        ]
      }
    ],
    specs: [
      ["Deployment", "Cloud-managed via Sophos Central"],
      ["Platforms", "Windows, macOS, Linux"],
      ["Detection", "AI/ML + behavioral + exploit prevention"],
      ["Response", "Automated + MDR-assisted"]
    ]
  }
};
