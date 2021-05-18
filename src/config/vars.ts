/** @class App */
class App {
  static readonly title = 'Minima'
  static readonly subTitle = 'The evolution will not be centralised'
  static readonly appName = 'Power Console'
  static readonly catchLine = `Powered by ${App.title}`
  static readonly tagline = ''
  static readonly website = 'http://www.minima.global'
  static readonly copyright = '© Copyright 2021 Minima GmbH'
  static readonly author = 'Dr Steve Huckle'
  static readonly enquiries = `${App.author}`
  static readonly email = 'steve.huckle@gmail.com'
  static readonly bugEmail = 'minima-global@fire.fundersclub.com'
  static readonly version = '1.1.2'
  static readonly release = 'Testnet'
}

/** @class Paths */
class Paths {
  static readonly home = 'Home'
  static readonly about = 'About'
  static readonly help = 'Help'
  static readonly contact = 'Contact'
  static readonly welcome = 'Welcome'
  static readonly cmd = 'console'
}

/** @class GeneralError */
class GeneralError {
  static readonly required = 'Required'
}

/** @class Home */
class Home {
  static readonly heading = `${App.appName}`
}

/** @class Welcome */
class Welcome {
  static readonly heading = 'Welcome'
}

/** @class About */
class About {
  static readonly heading = 'About'
  static readonly info = [`Version ${App.version}.`,
    `${App.catchLine}.`,
    `${App.release}.`,
    `Created by ${App.author}.`,
    `${App.copyright}.`,
  ]
}

/** @class Help */
class Help {
  static readonly heading = 'Help'

  static readonly info = [`Coming soon.`]

  static readonly homeTip = 'Home'
  static readonly helpTip = 'Help'
  static readonly contactTip = 'Contact'
  static readonly aboutTip = 'About'
}

/** @class Contact */
class Contact {
  static readonly heading = 'Contact'

  static readonly info = [
    'To report a technical problem,' +
    'please email a brief description of the issue to' +
    `${App.bugEmail}.`,
    `For all other enquires, please email ${App.enquiries} at ${App.email}.`,
  ]
}

/** @class Cmd */
class Cmd {
  static readonly heading = 'Console'

  static readonly cmd = 'Command'
  static readonly iterate = 'Iterate?'
  static readonly forever = 'Forever?'
  static readonly interval = 'Interval (ms)'
  static readonly iterations = 'Iterate Amount'

  static readonly minInterval = 1000
  static readonly minIntervalError =
    `The minimum interval is ${Cmd.minInterval}`
  static readonly minIterationError = 'Value must be greater than zero'

  static readonly cmdButton = 'Run'
  static readonly stopButton = 'Stop'
  static readonly clearButton = 'Clear'
}

/** @class Post */
class Post {
  static readonly postSuccess = 'Post Success'
  static readonly postFailure = 'Post Failure'

  static readonly getSuccess = 'Get Success'
  static readonly getFailure = 'Get Failure'
}

export {
  App,
  Paths,
  GeneralError,
  Home,
  Welcome,
  About,
  Help,
  Contact,
  Cmd,
  Post,
};
