export const naggingConfig = {
  id: 2,
  title: "Nagging",
  subtitle: "When websites won't take no for an answer",
  color: "orange",

  phases: {
    experience: {
      title: "Experience",
      instruction: "Browse this shopping website and notice what happens when you try to dismiss notifications.",
      iframeSrc: "/modules/nagging/experience.html",
      simulationLabel: "ABC Shopping Store",
    },

    reflection: {
      title: "Reflection",
      questions: [
        {
          id: "r1",
          question: "What observation do you have from the previous example?",
          options: [
            { id: "a", text: "I chose 'Not now', the website displays multiple prompts to register for the notification again and again." },
            { id: "b", text: "I chose 'Ok', the website displays multiple promotional notifications at the same time." },
            { id: "c", text: "I didn't notice anything special." },
            { id: "d", text: "Other, please specify below:", needsText: true },
          ],
        },
        {
          id: "r2",
          type: "feeling_combined",
          question: "How do you feel about the website repeatedly asking you the same question after you already said no?",
          feelings: [
            { id: "frustrated", label: "Frustrated" },
            { id: "annoyed", label: "Annoyed" },
            { id: "indifferent", label: "Indifferent" },
            { id: "pressured", label: "Pressured" },
            { id: "confused", label: "Confused" },
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
      summary: "Nagging refers to a manipulative pattern where websites use repeated requests or interruptions to pressure you into doing something that may not be in your best interest. When you're persistently interrupted, you're more likely to give in just to make it stop.",
      keyPoints: [
        {
          icon: "📖",
          title: "What is Nagging?",
          text: "Nagging is when a website repeatedly asks you the same thing even after you said no.",
          detail: "In the previous example, the website kept asking you to allow notifications even after you said 'Not Now'. This is nagging — the website hopes that by asking over and over, you'll eventually give in out of frustration. If you click 'Allow' just to make it stop, you'll be bombarded with promotional alerts and ads constantly."
        },
        {
          icon: "✅",
          title: "How to Protect Yourself",
          text: "There are simple steps you can take to avoid falling for nagging patterns.",
          detail: "1. Look for ways to exit or report the website if the nagging becomes too persistent.\n\n2. Remember: websites that respect users will accept 'No' the first time.\n\n3. Don't give in to pressure — clicking 'Allow' just to stop the popups gives the website exactly what it wants."
        },
        {
          icon: "📱",
          title: "Real-world Example #1: Instagram",
          text: "Instagram used nagging to pressure users into turning on notifications.",
          detail: "In 2018, Instagram aggressively nagged users to turn on notifications, pestering them regularly over a period of months. Users were not able to say NO — the only option to make the nagging stop was to turn on notifications. This is a classic example of nagging in action."
        },
        {
          icon: "📲",
          title: "Real-world Example #2: Google Location",
          text: "Google repeatedly asks for location permission with no permanent 'No' option.",
          detail: "Google repeatedly asks for permission to use location data, only allowing 'Not now' to be selected — pestering the user until they give permission. There is no permanent 'No' option, so the request keeps coming back no matter how many times you dismiss it."
        },
      ],
    },

    experiment: {
      title: "Experiment",
      instruction: "You're shopping for a backpack. The website asks you to subscribe. Apply what you've learned and try to resist the nagging!",
      iframeSrc: "/modules/nagging/experiment.html",
      simulationLabel: "School Gear Shop",
      experimentReminder: "In the previous example, the shopping website kept showing you the same notification popup over and over, even after you said 'Not Now'.",
      experimentTip: "Stay firm and keep dismissing. Use the ✕ button or click 'No Thanks' every time.",
    },

    test: {
      title: "Test",
      instruction: "Complete these scenarios to test what you've learned about nagging patterns.",
      iframeSrc: "/modules/nagging/test.html",
      isSimulation: true,
    },
  },
};

export default naggingConfig;