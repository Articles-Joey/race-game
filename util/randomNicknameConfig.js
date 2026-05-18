
import generateRandomNickname from '@articles-media/articles-dev-box/generateRandomNickname';

const randomNicknameConfig = {
  type: 'Basic',
  parts: [
    [
      "Quacky", "Speedy", "Dashing", "Swift", "Webbed",
      "Golden", "Rapid", "Turbo", "Feathered", "Brave",
      "Zippy", "Flashy", "Mighty", "Quick", "Paddling"
    ],
    [
      "Racer", "Driver", "Paddler", "Duck", "Mallard",
      "Waddler", "Sprinter", "Zoomer", "Captain", "Pilot",
      "Wingman", "Flyer", "Scooter", "Speedster", "Drake"
    ]
  ]
};

export default () => generateRandomNickname(randomNicknameConfig);