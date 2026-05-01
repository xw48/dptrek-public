const forcedActionConfig = {
  id: 5,
  title: "Forced Action",
  subtitle: "When websites force you to do something unrelated just to continue",
  color: "rose",

  phases: {
    experience: {
      title: "Experience",
      instruction: "Imagine you're signing up for a shopping website. Please pay attention to the account registration window!",
      iframeSrc: "/modules/forced-action/experience.html",
      simulationLabel: "ABC Shopping Store",
    },

    reflection: {
      title: "Reflection",
      questions: [
        {
          id: "r1",
          question: "What observations do you have from the previous example?",
          options: [
            { id: "a", text: "I was forced to subscribe to SMS updates in order to register." },
            { id: "b", text: "I didn't notice anything special." },
            { id: "c", text: "Other, please specify below:", needsText: true },
          ],
        },
        {
          id: "r2",
          type: "feeling_combined",
          question: "The previous example requires users to subscribe to SMS updates before they can register an account. What's your feeling about it?",
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
      summary: "Forced Action refers to a manipulative pattern where the user wants to do something, but they are required to do something else undesirable in return. In the previous example, you were forced to subscribe to SMS updates just to create an account \u2014 you\u2019ll start receiving promotional messages tempting you to spend more.",
      keyPoints: [
        {
          icon: "\uD83D\uDCD6",
          title: "What is Forced Action?",
          text: "Forced Action is when a website makes you do something unrelated \u2014 like subscribing to emails or sharing personal data \u2014 just to use a basic feature.",
          detail: "In the previous example, the shopping website required you to subscribe to SMS updates before you could register an account. This means you\u2019ll receive a ton of promotional messages via SMS, tempting you to spend more. The subscription was mandatory \u2014 you couldn\u2019t uncheck it."
        },
        {
          icon: "\u2705",
          title: "How to Protect Yourself",
          text: "There are simple steps you can take to avoid falling for forced action patterns.",
          detail: "1. If you don\u2019t want the promotional messages, consider leaving or reporting the website.\n\n2. Look for hidden checkboxes or pre-checked options before submitting forms.\n\n3. Read the fine print near \u201CSign Up\u201D buttons \u2014 sometimes agreeing to marketing is buried in small text.\n\n4. Remember: a legitimate website should let you create an account without forcing unrelated subscriptions."
        },
        {
          icon: "\uD83C\uDFAE",
          title: "Real-world Example #1: Dawn of War III",
          text: "In the sign-up page of Dawn of War III, users were required to subscribe to the newsletter to create an account.",
          interactive: {
            icon: "\uD83C\uDFAE",
            title: "Real-world Example #1: Dawn of War III",
            images: [
              "/forced-action-dow3-1.png"
            ],
            steps: [
              {
                text: "Click 'Next' to see how Dawn of War III forced users into a newsletter subscription just to play the game.",
                imageIndex: 0,
                highlights: [],
                arrows: [],
                labels: []
              },
              {
                text: "The game's registration page has a mandatory newsletter subscription checkbox. Notice \u2014 it cannot be unchecked!",
                imageIndex: 0,
                highlights: [
                  { top: '73%', left: '20%', width: '60%', height: '10%' }
                ],
                arrows: [],
                labels: [
                  { text: 'Cannot be unchecked!', top: '65%', left: '18%' }
                ]
              },
              {
                text: "If you want to play the game, you MUST agree to receive marketing emails. There is no way to opt out \u2014 this is a classic forced action pattern.",
                imageIndex: 0,
                highlights: [
                  { top: '73%', left: '20%', width: '60%', height: '10%' },
                  { top: '85%', left: '30%', width: '40%', height: '7%' }
                ],
                arrows: [],
                labels: [
                  { text: 'Forced subscription!', top: '65%', left: '18%' },
                  { text: 'No choice but to agree', top: '93%', left: '30%' }
                ]
              }
            ]
          }
        },
        {
          icon: "\uD83C\uDF10",
          title: "Real-world Example #2: Better Working World (EY)",
          text: "Better Working World forced users to accept the use of cookies on the site or they cannot continue.",
          interactive: {
            icon: "\uD83C\uDF10",
            title: "Real-world Example #2: Better Working World (EY)",
            images: [
              "/forced-action-ey-1.png"
            ],
            steps: [
              {
                text: "Click 'Next' to see how Better Working World (EY) forced users to accept cookies with no alternative.",
                imageIndex: 0,
                highlights: [],
                arrows: [],
                labels: []
              },
              {
                text: "The website displays a cookie consent popup. Notice there's only one option: 'Yes, I accept'. There is no 'Decline' or 'No' button.",
                imageIndex: 0,
                highlights: [
                  { top: '38%', left: '13%', width: '74%', height: '20%' }
                ],
                arrows: [],
                labels: [
                  { text: 'Only option: Accept!', top: '30%', left: '15%' }
                ]
              },
              {
                text: "Users who disagree have no way to decline and still use the site. The only alternative is to leave entirely \u2014 making cookie acceptance a forced action.",
                imageIndex: 0,
                highlights: [
                  { top: '38%', left: '13%', width: '74%', height: '20%' }
                ],
                arrows: [],
                labels: [
                  { text: 'Accept or leave!', top: '30%', left: '15%' },
                  { text: 'No decline option exists', top: '60%', left: '15%' }
                ]
              }
            ]
          }
        },
      ],
    },

    experiment: {
      title: "Experiment",
      instruction: "You're signing up for a new website. Apply what you've learned about forced action \u2014 pay close attention to checkboxes and fine print!",
      iframeSrc: "/modules/forced-action/experiment.html",
      simulationLabel: "Tech Gadgets Store",
      experimentReminder: "In the previous example, the shopping website forced you to subscribe to SMS updates just to register an account.",
      experimentTip: "Look carefully at checkboxes and small text before clicking Sign Up. Don't check anything you don't need!",
    },

    test: {
      title: "Test",
      instruction: "Complete these scenarios to test what you've learned about forced action patterns.",
      iframeSrc: "/modules/forced-action/test.html",
      isSimulation: true,
    },
  },
};

export default forcedActionConfig;
