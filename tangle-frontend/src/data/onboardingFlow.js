export const onboardingFlow = [
  {
    key: "welcome",
    type: "bot",
    message: "Hey 👋 Welcome to Tangle."
  },
  {
    key: "intro",
    type: "bot",
    message: "We're building something different — connection through stories, not swipes. Before we match you, we'd love to hear a little about you."
  },
  {
    key: "story",
    type: "input",
    message: "What has love or connection felt like for you lately? Take your time — there's no right answer."
  },
  {
    key: "intent",
    type: "options",
    message: "What are you looking for right now?",
    options: ["Serious", "Casual", "Exploring", "Healing"]
  },
  {
    key: "name",
    type: "input",
    message: "What should we call you?"
  },
  {
    key: "age",
    type: "input",
    message: "How old are you?"
  },
  {
    key: "gender",
    type: "input",
    message: "How do you identify? (Feel free to use your own words)"
  },
  {
    key: "email",
    type: "input",
    message: "Last one 💜 What's your email? We'll only use it to let you know when you're invited in."
  }
];
