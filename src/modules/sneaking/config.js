const sneakingConfig = {
  id: 4,
  title: "Sneaking",
  subtitle: "When websites secretly add items or costs you didn't ask for",
  color: "teal",

  phases: {
    experience: {
      title: "Experience",
      instruction: "Imagine you are placing an order and checking out on a shopping website. Please pay attention to the items in your cart!",
      iframeSrc: "/modules/sneaking/experience.html",
      simulationLabel: "TechMart Online Store",
    },

    reflection: {
      title: "Reflection",
      questions: [
        {
          id: "r1",
          question: "What observations do you have from the previous example?",
          options: [
            { id: "a", text: "I noticed there's an extra item in the cart that I didn't add." },
            { id: "b", text: "I didn't notice anything special." },
            { id: "c", text: "Other, please specify below:", needsText: true },
          ],
        },
        {
          id: "r2",
          type: "feeling_combined",
          question: "An additional item was added to your shopping cart without your knowledge. How do you feel about it?",
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
      summary: "Sneaking occurs when websites intentionally hide or obscure important information from users, such as additional costs or unwanted consequences. This tactic is often used to manipulate users into taking actions they wouldn't normally choose.",
      keyPoints: [
        {
          icon: "📖",
          title: "What is Sneaking?",
          text: "Sneaking is when a website secretly adds items, fees, or subscriptions to your order without your clear consent.",
          detail: "In the previous example, a 'Protection Plan' was quietly added to your cart when you added the keyboard. You didn't ask for it, but the website added it anyway hoping you wouldn't notice before checkout. This means you'd pay $59.99 instead of $50 for just the keyboard."
        },
        {
          icon: "✅",
          title: "How to Protect Yourself",
          text: "There are simple steps you can take to avoid falling for sneaking patterns.",
          detail: "1. Always double-check everything in your cart before making the final purchase.\n\n2. Look for pre-checked boxes or auto-added items during checkout.\n\n3. You can leave or report the websites that use Sneaking.\n\n4. Compare the final price with what you expected to pay."
        },
        {
          icon: "🛒",
          title: "Real-world Example #1: SportsDirect",
          text: "SportsDirect.com secretly added a magazine subscription to customers' shopping baskets.",
          detail: "In 2015, UK sports retailer SportsDirect.com was found to be Sneaking an unwanted magazine subscription into users' shopping baskets during the checkout process. The magazine cost an extra \u00A31, and was added without users' explicit consent or knowledge. If users noticed it, they had to actively remove it from their basket if they did not wish to purchase it."
        },
        {
          icon: "🚗",
          title: "Real-world Example #2: RAC.co.uk",
          text: "RAC.co.uk forces users to click 'More info' to opt out of sharing information and email spam.",
          detail: "RAC.co.uk forces users to select 'More info' to be able to opt out of sharing information and email spam. If users click 'Continue' directly, they will receive mail and email about exclusive offers. The opt-out option is hidden behind an extra click that most users won't notice."
        },
      ],
    },

    experiment: {
      title: "Experiment",
      instruction: "You're shopping for a backpack. Add it to your cart and check carefully before checking out. Apply what you've learned about sneaking!",
      iframeSrc: "/modules/sneaking/experiment.html",
      simulationLabel: "School Gear Shop",
      experimentReminder: "In the previous example, the shopping website secretly added a 'Protection Plan' to your cart without asking you.",
      experimentTip: "Check your cart carefully before checkout. If you see something you didn't add, remove it!",
    },

    test: {
      title: "Test",
      instruction: "Complete these scenarios to test what you've learned about sneaking patterns.",
      iframeSrc: "/modules/sneaking/test.html",
      isSimulation: true,
    },
  },
};

export default sneakingConfig;
