const interferenceConfig = {
  id: 3,
  title: "Interface Interference",
  subtitle: "",
  color: "blue",

  phases: {
    experience: {
      title: "Experience",
      instruction: "Imagine you're signing up for a shopping website. Please pay attention to the settings on the welcome screen.",
      iframeSrc: "/modules/interference/experience.html",
      simulationLabel: "ShopSmart Electronics",
    },

    reflection: {
      title: "Reflection",
      questions: [
        {
          id: "r1",
          question: "What observations do you have from the previous example?",
          options: [
            { id: "a", text: "I noticed that the website settings have personalized ads enabled by default." },
            { id: "b", text: "I didn't notice anything special." },
            { id: "c", text: "Other, please specify below:", needsText: true },
          ],
        },
        {
          id: "r2",
          type: "feeling_combined",
          question: "The previous example enables personalized ads by default. How do you feel about it?",
          feelings: [
            { id: "concerned", label: "Concerned" },
            { id: "annoyed", label: "Annoyed" },
            { id: "indifferent", label: "Indifferent" },
            { id: "intrigued", label: "Intrigued" },
            { id: "cautious", label: "Cautious" },
          ],
          intensityLabel: "How strongly did you feel this?",
        },
        {
          id: "r3",
          question: "Have you encountered anything similar to the previous example in your daily life?",
          options: [
            { id: "a", text: "Always" },
            { id: "b", text: "Often" },
            { id: "c", text: "Sometimes" },
            { id: "d", text: "Seldom" },
            { id: "e", text: "Never" },
          ],
        },
      ],
    },

    learning: {
      title: "Learning",
      summary: "Interface Interference refers to obstacles, distractions, or disruptions in a user interface that hinder your ability to accomplish tasks efficiently. In the previous example, the 'Enable Personalized Ads' box was pre-checked — leaving it checked means you unknowingly agree to receive personalized ads.",
      keyPoints: [
        {
          icon: "📖",
          title: "What is Interface Interference?",
          text: "Websites use pre-selected checkboxes, confusing layouts, and hidden options to trick you into agreeing to things you didn't intend.",
          detail: "In the previous example, by overlooking the Interface Interference pattern on the website — leaving that box checked — you unknowingly agree to receive personalized ads, which can lead to additional costs or losses for you. The website deliberately makes the harmful option the default."
        },
        {
          icon: "✅",
          title: "How to Protect Yourself",
          text: "Always check for pre-selected boxes and uncheck anything you didn't explicitly choose.",
          detail: "1. You can uncheck the pre-selected boxes, e.g., the 'Enable Personalized Ads' box.\n\n2. You can exit or report the websites that use similar Interface Interference.\n\n3. Always read settings carefully before clicking 'Confirm' or 'Submit'."
        },
        {
          icon: "📱",
          title: "Real-world Example #1: Twitter",
          text: "Twitter used a pre-checked option to auto-follow their promotional account.",
          interactive: {
            icon: "📱",
            title: "Real-world Example #1: Twitter",
            images: [
              "/interference-twitter-1.png"
            ],
            steps: [
              {
                text: "Click 'Next' to see how Twitter used interface interference to trick users into following a promotional account.",
                imageIndex: 0,
                highlights: [],
                arrows: [],
                labels: []
              },
              {
                text: "Twitter shows a popup asking users to connect their account. Look carefully — the option to follow @Links_com is already pre-checked!",
                imageIndex: 0,
                highlights: [
                  { top: '63%', left: '15%', width: '60%', height: '8%' }
                ],
                arrows: [],
                labels: [
                  { text: 'Pre-checked by default!', top: '55%', left: '15%' }
                ]
              },
              {
                text: "If users click 'Connect Twitter account' without noticing the pre-checked box, promotional posts from @Links_com would automatically appear in their feed.",
                imageIndex: 0,
                highlights: [
                  { top: '63%', left: '15%', width: '60%', height: '8%' },
                  { top: '50%', left: '23%', width: '50%', height: '10%' }
                ],
                arrows: [],
                labels: [
                  { text: 'Hidden checkbox', top: '55%', left: '15%' },
                  { text: 'Easy to miss!', top: '42%', left: '25%' }
                ]
              }
            ]
          }
        },
        {
          icon: "📲",
          title: "Real-world Example #2: Next.co.uk",
          text: "Next.co.uk pre-selected a 'free directory' that actually led to credit checks.",
          interactive: {
            icon: "📲",
            title: "Real-world Example #2: Next.co.uk",
            images: [
              "/interference-next-1.png"
            ],
            steps: [
              {
                text: "Click 'Next' to see how Next.co.uk used a pre-selected option to trick users into a credit account.",
                imageIndex: 0,
                highlights: [],
                arrows: [],
                labels: []
              },
              {
                text: "On Next.co.uk, the radio button for a 'free first Next directory' was already pre-selected. It looks like a harmless freebie...",
                imageIndex: 0,
                highlights: [
                  { top: '20%', left: '6%', width: '70%', height: '7%' }
                ],
                arrows: [],
                labels: [
                  { text: 'Pre-selected for you!', top: '13%', left: '10%' }
                ]
              },
              {
                text: "But the fine print reveals: accepting this 'free directory' means consenting to a credit check and opening a credit account that sends brochures 4 times a year — each costing £3.75!",
                imageIndex: 0,
                highlights: [
                  { top: '20%', left: '6%', width: '70%', height: '7%' },
                  { top: '50%', left: '6%', width: '60%', height: '15%' }
                ],
                arrows: [],
                labels: [
                  { text: 'Looks free...', top: '13%', left: '10%' },
                  { text: 'Hidden cost: £3.75 x 4/year!', top: '67%', left: '8%' }
                ]
              }
            ]
          }
        },
      ],
    },

    experiment: {
      title: "Experiment",
      instruction: "You're ordering food online. Look carefully at the order summary before confirming. Can you spot the pre-selected option?",
      iframeSrc: "/modules/interference/experiment.html",
      simulationLabel: "FoodDash Delivery",
      experimentReminder: "In the previous example, the 'Enable Personalized Ads' checkbox was pre-checked by default. You need to uncheck it before confirming.",
      experimentTip: "Look carefully at every checkbox and pre-selected option before clicking any confirm button!",
    },

    test: {
      title: "Test",
      instruction: "Find and uncheck the pre-selected options on each website. You need to get both correct to pass.",
      iframeSrc: "/modules/interference/test.html",
      isSimulation: true,
    },
  },
};

export default interferenceConfig;