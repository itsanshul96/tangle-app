export const onboardingFlow = [
    {
      key: "welcome",
      type: "bot",
      message: "Hey 👋 Welcome to Tangle."
    },
    {
      key: "intro",
      type: "bot",
      message: "Before we connect you with someone, tell me something real."
    },
    {
      key: "story",
      type: "input",
      message: "What has love or connection felt like for you lately?"
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
      message: "How do you identify?"
    },
    {
      key: "email",
      type: "input",
      message: "What’s your email so we can keep your place in the Tangle community?"
    }
  ];