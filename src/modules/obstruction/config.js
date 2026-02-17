const obstructionConfig = {
  id: 1,
  title: "Obstruction",
  subtitle: "When websites make things unnecessarily difficult",
  color: "red",

  phases: {
    experience: {
      title: "Experience",
      instruction: "Imagine you're signing up for a shopping website. Try to manage your cookie settings.",
      iframeSrc: "/modules/obstruction/experience.html",
    },

    reflection: {
      title: "Reflection",
      questions: [
        {
          id: "r1",
          question: "What did you notice about the cookie settings page?",
          options: [
            { id: "a", text: "It was easy to find and use the reject option" },
            { id: "b", text: "The 'Accept All' button was much more visible than 'Reject'" },
            { id: "c", text: "Both options looked equally easy to use" },
            { id: "d", text: "There were no options at all" },
          ],
          correct: "b",
          explanation: "The 'Accept All' button was large and prominently placed, while the 'Reject' option was hidden or hard to find. This is a classic obstruction dark pattern."
        },
        {
          id: "r2",
          question: "How did the website make it hard to say no?",
          options: [
            { id: "a", text: "By not having a reject button at all" },
            { id: "b", text: "By using confusing language and hiding the reject option" },
            { id: "c", text: "By asking you to verify your email first" },
            { id: "d", text: "By requiring a phone number" },
          ],
          correct: "b",
          explanation: "Websites often use confusing language like 'Manage Preferences' instead of 'Reject', or bury the reject option deep in settings menus."
        },
      ],
    },

    learning: {
      title: "Learning",
      summary: "Obstruction is when websites deliberately make certain actions difficult to complete — usually actions that benefit you but not them.",
      keyPoints: [
        {
          icon: "🔍",
          title: "What is Obstruction?",
          text: "Websites intentionally make it hard to cancel subscriptions, delete accounts, or reject cookies by hiding buttons, adding extra steps, or using confusing language."
        },
        {
          icon: "⚠️",
          title: "Why do they do it?",
          text: "Because every user who gives up trying to cancel = continued revenue. Every user who accepts all cookies = more data collected about them."
        },
        {
          icon: "🛡️",
          title: "How to protect yourself",
          text: "Look for small grey text links labeled 'Manage Preferences', 'Necessary Only', or 'Reject All'. They're usually hidden but legally required to be there."
        },
        {
          icon: "📋",
          title: "Real world examples",
          text: "Amazon requires many steps to cancel Prime. Many news sites bury their cookie reject option under multiple menus. Apps hide the 'delete account' option deep in settings."
        },
      ],
    },

    experiment: {
      title: "Experiment",
      instruction: "Now that you know what to look for, try again. Can you find and click the 'Reject' option this time?",
      iframeSrc: "/modules/obstruction/experiment.html",
    },

    test: {
      title: "Test",
      questions: [
        {
          id: "t1",
          question: "What is the main goal of the 'Obstruction' dark pattern?",
          options: [
            { id: "a", text: "To improve the user experience" },
            { id: "b", text: "To make beneficial actions for users unnecessarily difficult" },
            { id: "c", text: "To speed up website loading times" },
            { id: "d", text: "To help users find what they need faster" },
          ],
          correct: "b",
        },
        {
          id: "t2",
          question: "You want to cancel a subscription but the website asks you to call a phone number during business hours only. This is an example of:",
          options: [
            { id: "a", text: "Good customer service" },
            { id: "b", text: "A security measure" },
            { id: "c", text: "Obstruction dark pattern" },
            { id: "d", text: "A legal requirement" },
          ],
          correct: "c",
        },
        {
          id: "t3",
          question: "On a cookie popup, where is the 'Reject All' option usually hidden?",
          options: [
            { id: "a", text: "In large bold text at the top" },
            { id: "b", text: "As a bright colourful button" },
            { id: "c", text: "Under 'Manage Preferences' or in small grey text" },
            { id: "d", text: "It is always the same size as 'Accept All'" },
          ],
          correct: "c",
        },
        {
          id: "t4",
          question: "Which of these is NOT an example of obstruction?",
          options: [
            { id: "a", text: "Requiring 10 steps to delete your account" },
            { id: "b", text: "Hiding the unsubscribe button in tiny text" },
            { id: "c", text: "Showing a clear 'Cancel Subscription' button on your account page" },
            { id: "d", text: "Making you call to cancel instead of doing it online" },
          ],
          correct: "c",
        },
      ],
    },
  },
};

export default obstructionConfig;