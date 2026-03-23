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
          question: "What observations do you have from the previous example?",
          options: [
            { id: "a", text: "I noticed that accepting cookies is straightforward, so I clicked 'Accept all' and received ads." },
            { id: "b", text: "I noticed that rejecting cookies requires multiple steps." },
            { id: "c", text: "I didn't notice anything special." },
            { id: "d", text: "Other, please specify below:", needsText: true },
          ],
        },
        {
          id: "r2",
          question: "The previous example requires many steps to reject cookies, while accepting cookies only requires one step. How do you feel about this?",
          options: [
            { id: "a", text: "Concerned" },
            { id: "b", text: "Annoyed" },
            { id: "c", text: "Indifference" },
            { id: "d", text: "Intrigued" },
            { id: "e", text: "Cautious" },
            { id: "f", text: "Other, please specify below:", needsText: true },
          ],
        },
        {
          id: "r2b",
          question: "Please choose the degree of your feeling:",
          options: [
            { id: "1", text: "1 (Slightly)" },
            { id: "2", text: "2" },
            { id: "3", text: "3" },
            { id: "4", text: "4" },
            { id: "5", text: "5 (Extremely)" },
          ],
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
      summary: "Obstruction refers to a manipulative pattern that, once used, results in consequences similar to this: The user is faced with barriers or hurdles, making it hard for them to complete their task or access information.",
      keyPoints: [
        {
          icon: "📖",
          title: "What is Obstruction?",
          text: "In the previous example, accepting unessential cookies like marketing cookies means you're giving the green light for websites to track your online behavior. It's like opening the door for them to follow your digital footsteps, showing you ads tailored to your interests."
        },
        {
          icon: "✅",
          title: "Solution",
          text: "1. You can reject all unessential cookies which utilize this dark pattern.\n\n2. You can leave or report the websites using similar Obstruction."
        },
        {
          icon: "📱",
          title: "Real-world example #1: Facebook",
          interactive: {
            icon: "📱",
            title: "Real-world example #1: Facebook",
            images: [
              "/facebook-screen1.png",
              "/facebook-screen2.png",
              "/facebook-screen3.png"
            ],
            steps: [
              {
                text: "Click 'Next' to see how Facebook makes privacy protection confusing",
                imageIndex: 0,
                highlights: [],
                arrows: [],
                labels: []
              },
              {
                text: "First, you see a simple 'GET STARTED' button. It looks harmless...",
                imageIndex: 0,
                highlights: [],
                arrows: [],
                labels: []
              },
              {
                text: "Then you see TWO choices: The unclear 'MANAGE DATA SETTINGS' button (small, gray) vs the big blue 'ACCEPT AND CONTINUE' button",
                imageIndex: 1,
                highlights: [
                  { top: '87.5%', left: '7%', width: '86%', height: '4.5%' },
                  { top: '92.5%', left: '7%', width: '86%', height: '4.5%' }
                ],
                arrows: [],
                labels: [
                  { text: 'Unclear & Hidden', top: '84%', left: '10%' },
                  { text: 'Big, Blue, Easy!', top: '90%', left: '10%' }
                ]
              },
              {
                text: "Notice how easy it is to ACCEPT (one big blue button) vs how unclear it is to REJECT (what does 'Manage' mean?)",
                imageIndex: 1,
                highlights: [
                  { top: '87.5%', left: '7%', width: '86%', height: '4.5%' },
                  { top: '92.5%', left: '7%', width: '86%', height: '4.5%' }
                ],
                arrows: [
                  { top: '82%', left: '47%', color: '#3b82f6' }
                ],
                labels: [
                  { text: 'Big, Blue, Easy!', top: '90%', left: '10%' }
                ]
              },
              {
                text: "If you click 'MANAGE', you must toggle this switch to the LEFT. The wording 'Allowed' ON means ads are ALLOWED. Very confusing! Users can't tell if they've protected their privacy.",
                imageIndex: 2,
                highlights: [
                  { top: '71%', left: '7%', width: '86%', height: '7%' }
                ],
                arrows: [
                  { top: '62%', left: '75%', color: '#ef4444' }
                ],
                labels: []
              }
            ]
          }
        },
        {
          icon: "📲",
          title: "Real-world example #2: iOS 6",
          text: "iOS 6 hides the option to disable ad tracking in an irrelevant location and uses trick wording (double negative) to confuse the user. The setting is buried deep in the Settings app under General → About → Advertising, making it very hard to find. The wording 'Limit Ad Tracking' with an ON/OFF toggle is confusing - users need to turn it ON to limit tracking, which is counterintuitive."
        },
        {
          icon: "🔄",
          title: "Real-world example #3: Your Experience",
          interactive: {
            icon: "🔄",
            title: "Real-world example #3: Your Experience",
            images: [
              "/experience-cookie-1.png",
              "/experience-cookie-2.png"
            ],
            steps: [
              {
                text: "Remember the cookie popup you saw at the beginning? Let's break down what YOU experienced!",
                imageIndex: 0,
                highlights: [],
                arrows: [],
                labels: []
              },
              {
                text: "First, you saw TWO options: The big blue 'Allow all' button vs the gray 'Reject' button. Notice how 'Allow all' is more prominent and inviting?",
                imageIndex: 0,
                highlights: [
                  { top: '59%', left: '7%', width: '43%', height: '11%' },
                  { top: '59%', left: '52%', width: '41%', height: '11%' }
                ],
                arrows: [],
                labels: [
                  { text: 'Easy & Prominent!', top: '55%', left: '10%' },
                  { text: 'Hidden in Gray', top: '55%', left: '60%' }
                ]
              },
              {
                text: "If you clicked 'Reject', suddenly THREE checkboxes appeared - all PRE-CHECKED! You had to manually uncheck each one. That's the obstruction!",
                imageIndex: 1,
                highlights: [
                  { top: '42%', left: '7%', width: '86%', height: '8%' },
                  { top: '51%', left: '7%', width: '86%', height: '8%' },
                  { top: '60%', left: '7%', width: '86%', height: '8%' }
                ],
                arrows: [],
                labels: []
              },
              {
                text: "Then you had to click 'Confirm my choices' - and the website gave you NO confirmation! Accept = 1 click. Reject = 4 actions with no feedback. This is classic obstruction!",
                imageIndex: 1,
                highlights: [
                  { top: '78%', left: '7%', width: '86%', height: '9%' }
                ],
                arrows: [
                  { top: '70%', left: '50%', color: '#10b981' }
                ],
                labels: []
              }
            ]
          }
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
      instruction: "Find the hidden reject option on each website. You need to get 2 out of 3 correct to pass.",
      iframeSrc: "/modules/obstruction/test.html",
      isSimulation: true,
    },
  },
};

export default obstructionConfig;