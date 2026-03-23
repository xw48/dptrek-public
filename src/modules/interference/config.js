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
          detail: "Twitter showed a popup asking users to connect their account, but the option to follow @Links_com for news and tips was already checked. If users clicked 'Connect Twitter account' without noticing, promotional posts would appear in their feed automatically."
        },
        {
          icon: "📲",
          title: "Real-world Example #2: Next.co.uk",
          text: "Next.co.uk pre-selected a 'free directory' that actually led to credit checks.",
          detail: "On Next.co.uk, the radio button for a 'free first Next directory' was pre-selected. However, if users didn't read the fine print, they may unknowingly consent to a credit check and the opening of a credit account that sends brochures four times a year, each costing £3.75."
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