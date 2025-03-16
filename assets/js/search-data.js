// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-philosophy",
          title: "philosophy",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/philosophy/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "These are some of my projects.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "dropdown-repositories",
              title: "repositories",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "";
              },
            },{id: "dropdown-publications",
              title: "publications",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "";
              },
            },{id: "post-more-fun-with-loop-unrolling-c",
      
        title: "More fun with loop unrolling - C++",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2024/more-fun-with-loop-unrolling-cpp/";
        
      },
    },{id: "post-learning-loop-unrolling",
      
        title: "Learning loop unrolling",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2024/learning-loop-unrolling/";
        
      },
    },{id: "post-constraints-are-liberating",
      
        title: "Constraints are liberating",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2023/constraints-are-liberating/";
        
      },
    },{id: "post-span-making-c-arrays-fun-since-2020",
      
        title: "Span - making C arrays fun since 2020",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2022/span-making-c-arrays-fun-since-2020/";
        
      },
    },{id: "post-game-theory-fun-in-the-nfl",
      
        title: "Game theory fun in the NFL",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2022/game-theory-fun-in-the-nfl/";
        
      },
    },{id: "post-docker-for-c-builds",
      
        title: "Docker for C++ builds",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2020/docker-for-c-plus-plus-builds/";
        
      },
    },{id: "post-a-zero-cost-abstraction",
      
        title: "A zero cost abstraction?",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2018/a-zero-cost-abstraction/";
        
      },
    },{id: "post-a-c-template-project",
      
        title: "A C++ Template Project",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2018/a-cpp-template-project/";
        
      },
    },{id: "post-hobby-development-on-azure",
      
        title: "Hobby Development on Azure",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2018/hobby-development-on-azure/";
        
      },
    },{id: "post-introducing-struct-layout",
      
        title: "Introducing Struct Layout",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2018/introducing-struct-layout/";
        
      },
    },{id: "post-minimum-implementations",
      
        title: "Minimum implementations",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2017/minimum_implementations/";
        
      },
    },{id: "post-using-gsl-with-argv",
      
        title: "Using gsl with argv",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2017/using-span-with-argv/";
        
      },
    },{id: "post-defining-define",
      
        title: "Defining define",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2017/defining-define/";
        
      },
    },{id: "post-identifying-a-forward-declaration-with-libclang",
      
        title: "Identifying a forward declaration with libclang",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2017/identifying-a-forward-declaration-with-libclang/";
        
      },
    },{id: "post-the-curious-case-of-cltq",
      
        title: "The curious case of cltq",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2016/the-curious-case-of-cltq/";
        
      },
    },{id: "post-c-development-on-a-raspberry-pi",
      
        title: "C# development on a Raspberry Pi",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2015/csharp-development-raspberry-pi/";
        
      },
    },{id: "post-introducing-summa-explorer",
      
        title: "Introducing Summa Explorer",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2015/introducing-summa-explorer/";
        
      },
    },{id: "post-all-your-state-are-belong-to-us",
      
        title: "All your state are belong to us",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2015/all-your-state-are-belong-to-us/";
        
      },
    },{id: "post-component-design-lessons-from-plumbing",
      
        title: "Component design - lessons from plumbing",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2015/component-design-lessons-from-plumbing/";
        
      },
    },{id: "post-literal-suffixes-matter-in-c",
      
        title: "Literal suffixes matter in C++",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2014/literal-suffixes-matter-in-c-plus-plus/";
        
      },
    },{id: "post-getting-started-with-pepper-js-on-windows",
      
        title: "Getting started with pepper.js on Windows",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2014/getting-started-with-pepper-js-on-windows/";
        
      },
    },{id: "post-visual-studio-is-busy",
      
        title: "Visual Studio is busy",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2014/visual-studio-is-busy/";
        
      },
    },{id: "post-garbage-collection-in-libgc",
      
        title: "Garbage collection in libgc",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2014/garbage-collection-in-libgc/";
        
      },
    },{id: "post-reading-the-libgc-code",
      
        title: "Reading the libgc code",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2014/reading-the-libgc-code/";
        
      },
    },{id: "post-performance-of-nacl-vs-pnacl",
      
        title: "Performance of NaCL vs. PNaCL",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2014/performance-of-nacl-vs-pnacl/";
        
      },
    },{id: "post-the-cost-of-set-jump-long-jump-exceptions",
      
        title: "The cost of set-jump long-jump exceptions",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2014/the-cost-of-setjump-longjump-exceptions/";
        
      },
    },{id: "post-subtle-bug-with-64-bit-native-client",
      
        title: "Subtle Bug With 64-bit Native Client",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2014/subtle-bug-with-64-bit-native-client/";
        
      },
    },{id: "post-unit-testing-locking",
      
        title: "Unit Testing Locking",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2014/unit-testing-locking/";
        
      },
    },{id: "post-behavioral-interviewing-and-bdd",
      
        title: "Behavioral Interviewing and BDD",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2014/behavioral-interviewing-and-bdd/";
        
      },
    },{id: "post-announcing-math-facts",
      
        title: "Announcing Math Facts",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2014/announcing-math-facts/";
        
      },
    },{id: "post-more-fun-with-coin-flipping",
      
        title: "More fun with coin flipping",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2014/more-fun-with-coin-flipping/";
        
      },
    },{id: "post-fun-with-coin-flipping",
      
        title: "Fun with coin flipping",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2013/fun-with-coin-flipping/";
        
      },
    },{id: "post-use-move-semantics-to-avoid-naming",
      
        title: "Use move semantics to avoid naming",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2013/use-move-semantics-to-avoid-naming/";
        
      },
    },{id: "post-constraints-and-greenfield-projects",
      
        title: "Constraints and greenfield projects",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2013/constraints-and-greenfield-projects/";
        
      },
    },{id: "post-when-should-we-not-use-test-driven-design",
      
        title: "When should we not use Test Driven Design?",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2013/when-should-we-not-use-tdd/";
        
      },
    },{id: "post-you-are-probably-already-doing-tdd",
      
        title: "You are (probably) already doing TDD",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2013/you-are-probably-already-doing-tdd/";
        
      },
    },{id: "post-the-importance-of-being-your-first-client",
      
        title: "The importance of being your first client",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2013/the-importance-of-being-your-first-client/";
        
      },
    },{id: "post-the-scientific-method-and-programming",
      
        title: "The scientific method and programming",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2013/the-scientific-method-and-programming/";
        
      },
    },{id: "post-the-best-way-to-develop-software",
      
        title: "The best way to develop software",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2013/the-best-way-develop-software/";
        
      },
    },{id: "post-a-brief-introduction-to-syllogisms",
      
        title: "A brief introduction to syllogisms",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2013/a-brief-introduction-to-syllogisms/";
        
      },
    },{id: "post-a-trade-off-between-generalization-and-performance",
      
        title: "A trade-off between generalization and performance",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2013/a-tradeoff-between-generalization-and-performance/";
        
      },
    },{id: "post-the-not-so-surprising-behavior-of-std-bind",
      
        title: "The (not so) surprising behavior of std::bind",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2013/the-not-so-surprising-behavior-of-std-bind/";
        
      },
    },{id: "post-improving-scalability-in-clojure",
      
        title: "Improving Scalability in Clojure",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2013/improving-scalability-in-clojure/";
        
      },
    },{id: "post-scalability-in-a-functional-language",
      
        title: "Scalability in a Functional Language",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2013/scalability-in-a-functional-language/";
        
      },
    },{id: "post-a-brief-introduction-to-nash-games",
      
        title: "A brief introduction to Nash games",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2013/a-brief-introduction-to-nash-games/";
        
      },
    },{id: "philosophy-a-map-of-good-and-evil",
          title: 'A Map of Good and Evil',
          description: "",
          section: "Philosophy",handler: () => {
              window.location.href = "/philosophy/a-map-of-good-and-evil/";
            },},{id: "philosophy-eternity",
          title: 'Eternity',
          description: "",
          section: "Philosophy",handler: () => {
              window.location.href = "/philosophy/eternity/";
            },},{id: "philosophy-the-four-causes",
          title: 'The Four Causes',
          description: "",
          section: "Philosophy",handler: () => {
              window.location.href = "/philosophy/four-causes/";
            },},{id: "projects-bible-shorts",
          title: 'Bible Shorts',
          description: "Engaging stories of discovery and faith for the short attention span.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/bible_shorts/";
            },},{id: "projects-math-facts",
          title: 'Math Facts',
          description: "Generate one-page sets of practice problems",
          section: "Projects",handler: () => {
              window.location.href = "/projects/math_facts/";
            },},{
        id: 'social-discord',
        title: 'Discord',
        section: 'Socials',
        handler: () => {
          window.open("https://discord.com/users/joshuampeterson", "_blank");
        },
      },{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%6A%6F%73%68.%70%65%74%65%72%73%6F%6E@%68%65%79.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/joshpeterson", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
        id: 'social-x',
        title: 'X',
        section: 'Socials',
        handler: () => {
          window.open("https://twitter.com/petersonjm1", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
