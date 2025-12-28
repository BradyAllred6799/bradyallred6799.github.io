/**************************************
 * app.js
 * Handles:
 * 1) Storing your problem-solution data
 * 2) Initializing Fuse.js for fuzzy search
 * 3) Performing the search
 * 4) Rendering the matching results
 **************************************/

// =============================
// 1) YOUR COMPLETE PROBLEM LIST
// =============================
// This array includes every page, problem statement, and solution
// from your provided data (~110 statements).
const problems = [
  // ----- PAGE 1: GETTING STARTED WITH ONLINE LEARNING -----
  {
    pageName: "Page 1: Getting Started with Online Learning",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-new-getting-started-with-online-learning",
    problem: "I’m not sure how to create an effective study plan for my online classes.",
    solution: `The "Getting Started with Online Learning" page provides tools to develop a personal learning plan. By using the prompts and resources available, you can outline your academic and personal goals, choose the best times and places for studying, and implement smart strategies to organize your schedule effectively.`
  },
  {
    pageName: "Page 1: Getting Started with Online Learning",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-new-getting-started-with-online-learning",
    problem: "I find it difficult to navigate the Canvas learning management system.",
    solution: `The page offers a section on navigating Canvas, including tips and a Canvas Help Guide. These resources will help you become familiar with the platform, locate your classes, access modules, and utilize other Canvas features confidently.`
  },
  {
    pageName: "Page 1: Getting Started with Online Learning",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-new-getting-started-with-online-learning",
    problem: "I’m struggling to organize my weekly schedule around my online courses.",
    solution: `With the scheduling tools and guidance provided on the page, you can create a realistic weekly timetable. The resources help you allocate specific times for each course, ensuring you dedicate enough hours to meet the expected workload.`
  },
  {
    pageName: "Page 1: Getting Started with Online Learning",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-new-getting-started-with-online-learning",
    problem: "I don’t know what student support services are available to me.",
    solution: `The "Support and the Student Success Center" section details various support services, including Customer Support, Technical Support, and additional resources. You can learn how to access these services and find the help you need for academic and technical issues.`
  },
  {
    pageName: "Page 1: Getting Started with Online Learning",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-new-getting-started-with-online-learning",
    problem: "I’m hesitant to ask for help when I need it in my online classes.",
    solution: `The "Seeking Help" section walks you through steps to identify your needs, find the right resources, and plan how to ask for assistance. This structured approach can make reaching out for help feel less intimidating and more manageable.`
  },
  {
    pageName: "Page 1: Getting Started with Online Learning",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-new-getting-started-with-online-learning",
    problem: "I feel overwhelmed by the differences between online and in-person classes.",
    solution: `By exploring the "Getting Started with Online Learning" tools, you can better understand the unique aspects of online education. Creating a learning plan and organizing your schedule can help you adapt to the online environment and reduce feelings of overwhelm.`
  },
  {
    pageName: "Page 1: Getting Started with Online Learning",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-new-getting-started-with-online-learning",
    problem: "I’m not proactive enough in seeking support for my online learning needs.",
    solution: `The page encourages proactive behavior by providing strategies to seek support effectively. Learning to ask for help and knowing where to find resources empowers you to take control of your online learning journey.`
  },
  {
    pageName: "Page 1: Getting Started with Online Learning",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-new-getting-started-with-online-learning",
    problem: "I have trouble staying engaged with the coursework in an online setting.",
    solution: `The tools on this page, such as creating a personal learning plan and organizing your schedule, help you stay involved with your coursework. Additionally, connecting with instructors and peers can increase your engagement and sense of community.`
  },
  {
    pageName: "Page 1: Getting Started with Online Learning",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-new-getting-started-with-online-learning",
    problem: "I don’t know how to effectively use online resources to support my studies.",
    solution: `The page introduces various online resources and guides you on how to navigate and utilize them. Learning to use these tools effectively can enhance your study habits and academic performance.`
  },
  {
    pageName: "Page 1: Getting Started with Online Learning",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-new-getting-started-with-online-learning",
    problem: "I’m uncertain about how to balance academic responsibilities with my personal life in an online environment.",
    solution: `By using the scheduling and planning tools provided, you can create a balanced schedule that accommodates both your academic and personal commitments. This helps ensure you maintain a healthy balance and avoid burnout.`
  },
  {
    pageName: "Page 1: Getting Started with Online Learning",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-new-getting-started-with-online-learning",
    problem: "I need guidance on setting realistic academic and personal growth goals.",
    solution: `The "First Things First: Plan for Your Success" section helps you explore and set achievable goals. Utilizing the personal learning plan tool ensures your goals are realistic and aligned with your capabilities and schedule.`
  },
  {
    pageName: "Page 1: Getting Started with Online Learning",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-new-getting-started-with-online-learning",
    problem: "I feel disconnected from my teachers and classmates in online classes.",
    solution: `The resources on connecting with instructors and peers, such as discussion forums and virtual study groups, help build a sense of community. Engaging with these tools can foster stronger relationships and reduce feelings of isolation.`
  },
  {
    pageName: "Page 1: Getting Started with Online Learning",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-new-getting-started-with-online-learning",
    problem: "I’m unsure how to seek help that meets my specific academic needs.",
    solution: `The "Seeking Help" section provides a step-by-step plan to identify your needs and find appropriate resources. This tailored approach ensures you get the specific support required for your academic challenges.`
  },
  {
    pageName: "Page 1: Getting Started with Online Learning",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-new-getting-started-with-online-learning",
    problem: "I struggle with staying motivated and disciplined in a self-paced online setting.",
    solution: `Creating a structured learning plan and organizing your schedule with the provided tools can enhance your discipline and motivation. Additionally, connecting with mentors and peers offers encouragement and accountability.`
  },
  {
    pageName: "Page 1: Getting Started with Online Learning",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-new-getting-started-with-online-learning",
    problem: "I don’t know where to start when planning my online learning journey.",
    solution: `The introduction and initial sections guide you through the basics of online learning. Starting with creating a personal learning plan and familiarizing yourself with Canvas sets a solid foundation for your online education journey.`
  },

  // ----- PAGE 2: LEARNER WELLNESS SKILLS -----
  {
    pageName: "Page 2: Learner Wellness Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-mental-and-physical-wellness",
    problem: "I’m having trouble managing stress from my online studies.",
    solution: `The "Learner Wellness Skills" page offers strategies to identify and manage stressors. Tools such as stress management plans and relaxation techniques can help you reduce stress and maintain a healthier balance between school and personal life.`
  },
  {
    pageName: "Page 2: Learner Wellness Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-mental-and-physical-wellness",
    problem: "I don’t know how to create a self-care plan that fits my schedule.",
    solution: `Using the self-care plan tool provided, you can develop a personalized plan that addresses your physical, emotional, social, and spiritual well-being. This structured approach ensures you incorporate regular self-care activities into your daily routine.`
  },
  {
    pageName: "Page 2: Learner Wellness Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-mental-and-physical-wellness",
    problem: "I’m struggling to incorporate physical activity into my daily routine.",
    solution: `The page includes resources like a simple 10-minute workout routine and tips on integrating physical activity into your day. These tools make it easier to stay active, which can improve your overall wellness and academic performance.`
  },
  {
    pageName: "Page 2: Learner Wellness Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-mental-and-physical-wellness",
    problem: "I feel emotionally overwhelmed balancing online classes and personal life.",
    solution: `The wellness strategies on this page help you create a balanced self-care plan and manage your emotions effectively. By addressing both academic and personal aspects, you can achieve a more harmonious balance.`
  },
  {
    pageName: "Page 2: Learner Wellness Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-mental-and-physical-wellness",
    problem: "I’m not sure how to take care of my mental health while studying online.",
    solution: `The "Caring for Your Mental Health" section provides tools to identify common stressors and learn strategies to manage them. Additionally, it offers guidance on seeking professional help, ensuring you maintain your mental well-being.`
  },
  {
    pageName: "Page 2: Learner Wellness Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-mental-and-physical-wellness",
    problem: "I need strategies to improve my wellness for better academic performance.",
    solution: `The page offers comprehensive wellness strategies, including stress management, physical activity, and self-care planning. Implementing these strategies can enhance your overall well-being, leading to improved focus and academic success.`
  },
  {
    pageName: "Page 2: Learner Wellness Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-mental-and-physical-wellness",
    problem: "I experience physical fatigue from long hours of online studying.",
    solution: `The "Caring for Your Physical Health" section provides simple workout routines and tips to boost your energy levels. Regular physical activity can help reduce fatigue and increase your productivity.`
  },
  {
    pageName: "Page 2: Learner Wellness Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-mental-and-physical-wellness",
    problem: "I find it hard to maintain a healthy work-life balance with online classes.",
    solution: `By utilizing the scheduling tools and self-care planning resources, you can create a balanced routine that accommodates both your academic responsibilities and personal life, preventing burnout.`
  },
  {
    pageName: "Page 2: Learner Wellness Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-mental-and-physical-wellness",
    problem: "I’m dealing with anxiety related to academic pressures.",
    solution: `The page offers anxiety management techniques and encourages seeking support through counseling services. These tools help you address anxiety, allowing you to perform better academically.`
  },
  {
    pageName: "Page 2: Learner Wellness Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-mental-and-physical-wellness",
    problem: "I lack motivation to engage in regular self-care activities.",
    solution: `The self-care plan tool helps you set achievable self-care goals and incorporate them into your daily routine. Additionally, understanding the benefits of self-care can boost your motivation to prioritize your well-being.`
  },
  {
    pageName: "Page 2: Learner Wellness Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-mental-and-physical-wellness",
    problem: "I find it difficult to identify the main sources of my stress.",
    solution: `The stress management tool guides you in pinpointing specific stressors and developing strategies to address them. This clarity allows you to tackle stress more effectively.`
  },
  {
    pageName: "Page 2: Learner Wellness Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-mental-and-physical-wellness",
    problem: "I’m unsure how to seek professional help for my mental well-being.",
    solution: `The page provides information on accessing counseling services and reaching out for professional support. Step-by-step guidance ensures you know how to get the help you need.`
  },
  {
    pageName: "Page 2: Learner Wellness Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-mental-and-physical-wellness",
    problem: "I struggle with maintaining a consistent sleep schedule due to online learning demands.",
    solution: `The wellness resources include tips on creating a consistent sleep routine and managing your study schedule to ensure you get adequate rest, which is crucial for your overall health and academic performance.`
  },
  {
    pageName: "Page 2: Learner Wellness Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-mental-and-physical-wellness",
    problem: "I need tips on how to stay active physically without a structured gym schedule.",
    solution: `The "Caring for Your Physical Health" section offers simple, time-efficient workout routines that you can do at home, making it easier to stay active without needing a gym.`
  },
  {
    pageName: "Page 2: Learner Wellness Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-mental-and-physical-wellness",
    problem: "I find it challenging to stay emotionally resilient in a virtual learning environment.",
    solution: `The wellness tools on this page help you build emotional resilience through stress management, self-care planning, and seeking support. These resources equip you to handle the unique challenges of online learning.`
  },

  // ----- PAGE 3: HOMEWORK AND NOTE TAKING SKILLS -----
  {
    pageName: "Page 3: Homework and Note Taking Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-study-and-note-taking-skills",
    problem: "I have difficulty taking effective notes during online lectures.",
    solution: `The "Homework and Note Taking Skills" page introduces the outline note-taking method, which helps you focus on main ideas and organize your notes systematically. This structured approach enhances your ability to capture and retain important information.`
  },
  {
    pageName: "Page 3: Homework and Note Taking Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-study-and-note-taking-skills",
    problem: "I don’t know how to review my notes in a way that helps me remember better.",
    solution: `The page provides active learning strategies for reviewing notes, such as transforming raw notes into outlines, charts, or mind maps. These techniques improve comprehension and memory retention, making your study sessions more effective.`
  },
  {
    pageName: "Page 3: Homework and Note Taking Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-study-and-note-taking-skills",
    problem: "I find it hard to break down my homework assignments into manageable tasks.",
    solution: `Using the provided tools, you can divide large assignments into smaller, time-bound chunks. This method reduces overwhelm and makes it easier to tackle homework step by step, improving your productivity and confidence.`
  },
  {
    pageName: "Page 3: Homework and Note Taking Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-study-and-note-taking-skills",
    problem: "I struggle with organizing my study materials and notes.",
    solution: `The outline method and organizational tools on this page help you create clear and structured notes. By organizing your study materials systematically, you can easily access and review them for exams and assignments.`
  },
  {
    pageName: "Page 3: Homework and Note Taking Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-study-and-note-taking-skills",
    problem: "I need strategies to engage more actively with my course content.",
    solution: `The active learning strategies introduced on this page encourage deeper engagement with the material. By transforming your notes and using interactive tools, you enhance your understanding and retention of course content.`
  },
  {
    pageName: "Page 3: Homework and Note Taking Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-study-and-note-taking-skills",
    problem: "I’m not sure how to develop a growth mindset towards my academic challenges.",
    solution: `The page emphasizes the importance of a growth mindset and provides tools to help you view challenges as opportunities to learn and grow. This perspective shift can increase your resilience and motivation to overcome academic obstacles.`
  },
  {
    pageName: "Page 3: Homework and Note Taking Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-study-and-note-taking-skills",
    problem: "I find it overwhelming to keep track of multiple assignments and deadlines.",
    solution: `The scheduling and task management tools help you organize your assignments and deadlines effectively. By breaking down tasks and setting priorities, you can manage your workload more efficiently and reduce stress.`
  },
  {
    pageName: "Page 3: Homework and Note Taking Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-study-and-note-taking-skills",
    problem: "I lack effective methods for outlining and structuring my notes.",
    solution: `The outline note-taking method provided on this page offers a clear and organized way to structure your notes. This method makes it easier to review and study your notes, enhancing your academic performance.`
  },
  {
    pageName: "Page 3: Homework and Note Taking Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-study-and-note-taking-skills",
    problem: "I have trouble identifying the main ideas and key details in my readings.",
    solution: `The note-taking strategies and active learning tools help you focus on extracting main ideas and key details from your readings. This targeted approach improves your comprehension and retention of important information.`
  },
  {
    pageName: "Page 3: Homework and Note Taking Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-study-and-note-taking-skills",
    problem: "I struggle with staying focused while completing homework assignments online.",
    solution: `The page offers tips and tools to create a distraction-free study environment and develop a consistent homework routine. These strategies help you maintain focus and complete your assignments efficiently.`
  },
  {
    pageName: "Page 3: Homework and Note Taking Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-study-and-note-taking-skills",
    problem: "I need help creating a consistent homework routine.",
    solution: `The scheduling tools and task management resources assist you in establishing a regular homework routine. Consistency in your study habits leads to better time management and academic success.`
  },
  {
    pageName: "Page 3: Homework and Note Taking Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-study-and-note-taking-skills",
    problem: "I find it difficult to prioritize my assignments based on importance and deadlines.",
    solution: `The prioritization tools on this page guide you in evaluating the importance and urgency of each assignment. By setting priorities, you can allocate your time and effort more effectively, ensuring timely completion of tasks.`
  },
  {
    pageName: "Page 3: Homework and Note Taking Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-study-and-note-taking-skills",
    problem: "I’m unsure how to use my notes effectively for studying and exam preparation.",
    solution: `The active learning strategies provided help you transform your notes into effective study aids. Techniques like outlining and creating mind maps make it easier to review and prepare for exams.`
  },
  {
    pageName: "Page 3: Homework and Note Taking Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-study-and-note-taking-skills",
    problem: "I have trouble staying motivated to complete my homework on time.",
    solution: `The page offers strategies to boost your motivation, such as breaking tasks into smaller steps and setting achievable goals. These approaches help you stay motivated and ensure you complete your homework on schedule.`
  },
  {
    pageName: "Page 3: Homework and Note Taking Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-study-and-note-taking-skills",
    problem: "I need techniques to improve my active learning and retention of information.",
    solution: `The active learning tools and note-taking strategies enhance your ability to engage with the material and retain information. By actively processing and organizing your notes, you improve your understanding and memory retention.`
  },

  // ----- PAGE 4: TEST TAKING SKILLS -----
  {
    pageName: "Page 4: Test Taking Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-test-taking",
    problem: "I feel anxious before and during exams.",
    solution: `The "Test Taking Skills" page provides strategies to manage test anxiety, such as reframing negative thoughts and practicing relaxation techniques. These tools help you stay calm and focused, improving your exam performance.`
  },
  {
    pageName: "Page 4: Test Taking Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-test-taking",
    problem: "I don’t have an effective plan to prepare for tests.",
    solution: `Using the Test Prep Planner tool, you can create a structured plan to prepare for exams. Breaking down your study material into smaller sections and scheduling review sessions ensures thorough preparation and reduces last-minute stress.`
  },
  {
    pageName: "Page 4: Test Taking Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-test-taking",
    problem: "I’m unsure of strategies to handle different types of exam questions.",
    solution: `The page offers specific strategies for various question types, including multiple-choice, true/false, matching, short answer, and essay questions. Understanding these strategies allows you to approach each question type confidently and effectively.`
  },
  {
    pageName: "Page 4: Test Taking Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-test-taking",
    problem: "I struggle to analyze my past test performance to improve.",
    solution: `The "After the Test: Preparation by Review" section introduces the Test Autopsy tool. By reviewing your past exams, you can identify strengths and weaknesses, learn from your mistakes, and adjust your study habits for future success.`
  },
  {
    pageName: "Page 4: Test Taking Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-test-taking",
    problem: "I find it hard to manage my time effectively during exams.",
    solution: `The page includes time management strategies for exam settings, such as allocating specific amounts of time to each section and practicing timed quizzes. These techniques help you use your exam time efficiently and reduce time-related stress.`
  },
  {
    pageName: "Page 4: Test Taking Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-test-taking",
    problem: "I have negative thoughts that affect my test performance.",
    solution: `The "Overcoming Test Anxiety" section teaches you how to reframe negative thoughts into positive ones. By adopting a positive mindset, you can enhance your confidence and reduce anxiety, leading to better test performance.`
  },
  {
    pageName: "Page 4: Test Taking Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-test-taking",
    problem: "I don’t know how to create a study schedule that maximizes my test preparation.",
    solution: `The Test Prep Planner tool guides you in developing a comprehensive study schedule. By setting specific goals and allocating time for each subject, you can ensure balanced and effective preparation for your tests.`
  },
  {
    pageName: "Page 4: Test Taking Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-test-taking",
    problem: "I find it challenging to stay calm and focused during timed tests.",
    solution: `The anxiety management techniques and focus strategies provided help you maintain calmness and concentration during timed exams. Practices like deep breathing and mindfulness can enhance your focus under pressure.`
  },
  {
    pageName: "Page 4: Test Taking Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-test-taking",
    problem: "I struggle with memorizing and recalling information under test conditions.",
    solution: `The active learning strategies, such as creating outlines and using flashcards, improve your ability to memorize and recall information. Regular review and practice enhance your retention and retrieval skills during tests.`
  },
  {
    pageName: "Page 4: Test Taking Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-test-taking",
    problem: "I’m unsure how to approach multiple-choice, essay, and short-answer questions differently.",
    solution: `The page offers tailored strategies for each question type, helping you understand the best approaches to answer them effectively. This specialized guidance ensures you maximize your performance across all question formats.`
  },
  {
    pageName: "Page 4: Test Taking Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-test-taking",
    problem: "I need strategies to review and learn from my mistakes after a test.",
    solution: `The Test Autopsy tool allows you to conduct a thorough review of your past exams. By analyzing your errors and understanding their causes, you can implement corrective measures and improve your future test performance.`
  },
  {
    pageName: "Page 4: Test Taking Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-test-taking",
    problem: "I find it difficult to prioritize which material to study for comprehensive exams.",
    solution: `The Test Prep Planner helps you identify and prioritize key topics based on their importance and relevance to the exam. This focused approach ensures you cover the most critical material efficiently.`
  },
  {
    pageName: "Page 4: Test Taking Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-test-taking",
    problem: "I have trouble staying motivated to study consistently for tests.",
    solution: `The goal-setting and time management tools on this page help you stay organized and motivated. By setting clear study goals and tracking your progress, you can maintain consistent study habits.`
  },
  {
    pageName: "Page 4: Test Taking Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-test-taking",
    problem: "I lack confidence in my ability to perform well on exams.",
    solution: `The anxiety management techniques and positive mindset strategies boost your self-confidence. Building confidence through preparation and mental strategies enhances your belief in your ability to succeed.`
  },
  {
    pageName: "Page 4: Test Taking Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-test-taking",
    problem: "I need techniques to improve my critical thinking and problem-solving skills during tests.",
    solution: `The Test Taking Skills page provides critical thinking and problem-solving strategies tailored to exam settings. Practicing these techniques helps you approach complex questions with greater ease and effectiveness.`
  },

  // ----- PAGE 5: WRITING AND RESEARCH SKILLS -----
  {
    pageName: "Page 5: Writing and Research Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-writing-and-research-skills",
    problem: "I need help choosing engaging writing topics for my assignments.",
    solution: `The "Writing and Research Skills" page offers tools to ask the right questions and brainstorm ideas, helping you select topics that are both interesting and relevant. This ensures your writing is engaging and meaningful.`
  },
  {
    pageName: "Page 5: Writing and Research Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-writing-and-research-skills",
    problem: "I’m unsure of the purpose behind my writing projects.",
    solution: `Understanding the purpose of your writing is crucial. The page guides you through identifying your writing goals, whether it's to inform, persuade, entertain, or analyze, ensuring your work is focused and effective.`
  },
  {
    pageName: "Page 5: Writing and Research Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-writing-and-research-skills",
    problem: "I struggle to organize my ideas into a clear outline.",
    solution: `The prewriting and outlining tools provided help you structure your ideas logically. Creating a clear outline ensures your writing has a strong foundation, making it easier to develop and present your arguments coherently.`
  },
  {
    pageName: "Page 5: Writing and Research Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-writing-and-research-skills",
    problem: "I don’t know how to conduct effective research for my papers.",
    solution: `The researching tools guide you through the research process, teaching you how to find credible sources, evaluate information, and organize your findings. This ensures your research is thorough and supports your writing effectively.`
  },
  {
    pageName: "Page 5: Writing and Research Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-writing-and-research-skills",

    problem: "I find it difficult to draft and revise my writing assignments.",
    solution: `The drafting and revising tools offer step-by-step guidance on creating and refining your drafts. By following these processes, you can produce polished and well-crafted papers that meet academic standards.`
  },
  {
    pageName: "Page 5: Writing and Research Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-writing-and-research-skills",
    problem: "I need assistance in scheduling writing lab appointments for feedback.",
    solution: `The page provides information on how to schedule writing lab appointments, ensuring you receive timely feedback. These sessions help you improve your writing skills through personalized guidance and constructive critique.`
  },
  {
    pageName: "Page 5: Writing and Research Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-writing-and-research-skills",
    problem: "I lack confidence in my ability to write polished, well-crafted papers.",
    solution: `The comprehensive writing process tools, including brainstorming, outlining, drafting, and revising, build your writing skills step by step. As you become more proficient in each stage, your confidence in producing high-quality work increases.`
  },
  {
    pageName: "Page 5: Writing and Research Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-writing-and-research-skills",
    problem: "I have trouble understanding assignment instructions and requirements.",
    solution: `The writing support resources help you interpret and clarify assignment instructions. By breaking down requirements and seeking feedback, you can ensure your work aligns with the expectations and standards.`
  },
  {
    pageName: "Page 5: Writing and Research Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-writing-and-research-skills",
    problem: "I struggle with integrating sources and avoiding plagiarism in my writing.",
    solution: `The research and writing tools teach you how to properly cite sources and integrate them seamlessly into your work. Understanding citation standards and plagiarism prevention ensures your writing is ethical and credible.`
  },
  {
    pageName: "Page 5: Writing and Research Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-writing-and-research-skills",
    problem: "I’m unsure how to develop a strong thesis statement for my essays.",
    solution: `The thesis statement tools guide you in crafting clear and concise thesis statements. A strong thesis provides a solid foundation for your essay, ensuring your arguments are focused and well-supported.`
  },
  {
    pageName: "Page 5: Writing and Research Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-writing-and-research-skills",
    problem: "I find it challenging to maintain a consistent writing style and tone.",
    solution: `The writing tools help you develop a consistent style and tone by providing guidelines and examples. Maintaining consistency enhances the readability and professionalism of your work.`
  },
  {
    pageName: "Page 5: Writing and Research Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-writing-and-research-skills",
    problem: "I need strategies to manage my time effectively during the writing process.",
    solution: `The scheduling and time management tools assist you in planning your writing tasks. By allocating specific time slots for brainstorming, drafting, and revising, you can manage your time efficiently and meet deadlines.`
  },
  {
    pageName: "Page 5: Writing and Research Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-writing-and-research-skills",
    problem: "I have difficulty receiving and implementing feedback on my writing.",
    solution: `The writing lab appointments and feedback tools help you understand and apply constructive criticism. Learning to incorporate feedback improves the quality of your writing and helps you grow as a writer.`
  },
  {
    pageName: "Page 5: Writing and Research Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-writing-and-research-skills",
    problem: "I’m unsure how to format citations and references correctly.",
    solution: `The research tools provide detailed guidelines on citation styles and reference formatting. Properly formatting citations ensures your work adheres to academic standards and avoids plagiarism.`
  },
  {
    pageName: "Page 5: Writing and Research Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-writing-and-research-skills",
    problem: "I struggle with expressing my ideas clearly and coherently in writing.",
    solution: `The writing process tools, including outlining and revising, help you articulate your ideas clearly. By organizing your thoughts and refining your drafts, you enhance the clarity and coherence of your writing.`
  },

  // ----- PAGE 6: READING SKILLS -----
  {
    pageName: "Page 6: Reading Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-reading-skills",
    problem: "I have difficulty comprehending complex reading materials.",
    solution: `The "Reading Skills" page introduces the SQ4R method, a structured approach to enhance comprehension. By surveying, questioning, reading, reciting, relating, and reviewing, you can better understand and retain complex information.`
  },
  {
    pageName: "Page 6: Reading Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-reading-skills",
    problem: "I don’t know how to evaluate my reading environment for better focus.",
    solution: `The page provides tools to assess and improve your reading environment. By identifying distractions and optimizing your study space, you create a conducive setting for effective reading and comprehension.`
  },
  {
    pageName: "Page 6: Reading Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-reading-skills",
    problem: "I struggle with managing my reading time effectively.",
    solution: `Time management strategies on this page help you allocate appropriate time for each reading session. Setting specific reading goals and breaking down reading tasks into manageable segments ensures efficient use of your time.`
  },
  {
    pageName: "Page 6: Reading Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-reading-skills",
    problem: "I find it hard to apply the SQ4R method to improve my reading comprehension.",
    solution: `The detailed instructions and interactive tools on the page guide you through each step of the SQ4R method. Practicing this method enhances your ability to comprehend and remember the material you read.`
  },
  {
    pageName: "Page 6: Reading Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-reading-skills",
    problem: "I’m unsure of how to retain and recall information from my readings.",
    solution: `The active reading strategies, such as taking structured notes and creating summaries, improve your retention and recall abilities. Regularly reviewing your notes using the SQ4R method reinforces your memory of the material.`
  },
  {
    pageName: "Page 6: Reading Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-reading-skills",
    problem: "I need strategies to engage more deeply with the course texts.",
    solution: `The page offers techniques like annotating, questioning, and relating readings to your own experiences. These strategies encourage deeper engagement and a more meaningful connection with the course material.`
  },
  {
    pageName: "Page 6: Reading Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-reading-skills",
    problem: "I have trouble identifying main ideas and supporting details in academic readings.",
    solution: `The reading strategies provided help you focus on extracting main ideas and key details. Tools like outlining and summarizing ensure you can effectively identify and organize important information.`
  },
  {
    pageName: "Page 6: Reading Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-reading-skills",
    problem: "I find it challenging to take effective notes while reading.",
    solution: `The note-taking tools on this page teach you how to organize your notes using methods like outlining and mind mapping. Effective note-taking enhances your ability to review and study the material later.`
  },
  {
    pageName: "Page 6: Reading Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-reading-skills",
    problem: "I struggle with staying focused during long reading sessions.",
    solution: `The page offers tips to maintain focus, such as breaking reading into shorter intervals, taking regular breaks, and minimizing distractions. These strategies help you stay attentive and engaged throughout your reading sessions.`
  },
  {
    pageName: "Page 6: Reading Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-reading-skills",
    problem: "I don’t know how to critically analyze and evaluate the information I read.",
    solution: `Critical thinking tools and question prompts on this page guide you in evaluating the credibility and relevance of the information. Developing these skills allows you to assess and interpret readings more effectively.`
  },
  {
    pageName: "Page 6: Reading Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-reading-skills",
    problem: "I find it difficult to summarize and paraphrase what I’ve read.",
    solution: `The reading tools provide techniques for summarizing and paraphrasing, helping you condense and rephrase information in your own words. These skills improve your understanding and ability to communicate the material clearly.`
  },
  {
    pageName: "Page 6: Reading Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-reading-skills",
    problem: "I need techniques to improve my active reading and interaction with texts.",
    solution: `The active reading strategies, such as annotating, questioning, and discussing with peers, enhance your engagement with the texts. These techniques make your reading more interactive and effective.`
  },
  {
    pageName: "Page 6: Reading Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-reading-skills",
    problem: "I have trouble connecting reading materials to my existing knowledge and experiences.",
    solution: `The page encourages relating new information to what you already know, fostering better understanding and retention. Making these connections helps you integrate and apply the knowledge more effectively.`
  },
  {
    pageName: "Page 6: Reading Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-reading-skills",
    problem: "I’m unsure how to use reading strategies to prepare for exams and assignments.",
    solution: `The SQ4R method and active reading tools on this page prepare you for exams and assignments by enhancing comprehension and retention. These strategies ensure you are well-prepared and confident in your understanding of the material.`
  },
  {
    pageName: "Page 6: Reading Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-reading-skills",
    problem: "I struggle with maintaining a consistent reading schedule alongside my coursework.",
    solution: `Time management and scheduling tools help you establish a regular reading routine. Consistency in your reading habits ensures you stay on top of your coursework and avoid last-minute cramming.`
  },

  // ----- PAGE 7: MOTIVATION SKILLS -----
  {
    pageName: "Page 7: Motivation Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-motivation-skills",
    problem: "I lack motivation to start and complete my assignments.",
    solution: `The "Motivational Skills" page offers goal-setting tools like the GROW and SMART models. By setting clear, achievable goals, you can find direction and purpose, making it easier to start and complete your assignments.`
  },
  {
    pageName: "Page 7: Motivation Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-motivation-skills",
    problem: "I struggle with setting and achieving academic goals.",
    solution: `Using the GROW and SMART models provided, you can create specific and measurable goals. These frameworks guide you in defining your objectives and developing actionable plans to achieve them.`
  },
  {
    pageName: "Page 7: Motivation Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-motivation-skills",
    problem: "I find it hard to break down large tasks into smaller steps.",
    solution: `The page provides tools to divide big tasks into manageable steps. Breaking down assignments makes them less overwhelming and helps you make steady progress, enhancing your productivity and confidence.`
  },
  {
    pageName: "Page 7: Motivation Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-motivation-skills",
    problem: "I tend to procrastinate and have difficulty taking action.",
    solution: `The motivational strategies include techniques to combat procrastination, such as setting immediate goals and taking small, actionable steps. These methods help you overcome delays and start working on your tasks promptly.`
  },
  {
    pageName: "Page 7: Motivation Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-motivation-skills",
    problem: "I’m not confident in my ability to stay on track with my studies.",
    solution: `The page encourages building confidence through goal setting and task management. By tracking your progress and celebrating small achievements, you can boost your self-assurance in maintaining your study routine.`
  },
  {
    pageName: "Page 7: Motivation Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-motivation-skills",
    problem: "I need help creating specific and measurable goals for my education.",
    solution: `The GROW and SMART goal-setting tools guide you in defining clear and achievable goals. These tools ensure your objectives are specific, measurable, attainable, relevant, and time-bound, providing a solid foundation for your academic success.`
  },
  {
    pageName: "Page 7: Motivation Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-motivation-skills",
    problem: "I feel overwhelmed by the amount of work I need to complete.",
    solution: `The page offers strategies to manage overwhelming workloads by breaking tasks into smaller steps and prioritizing assignments. This approach makes large projects more manageable and reduces feelings of overwhelm.`
  },
  {
    pageName: "Page 7: Motivation Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-motivation-skills",
    problem: "I have difficulty maintaining focus and motivation over long study periods.",
    solution: `Motivational tools such as setting short-term goals and incorporating rewards help you stay focused and motivated during extended study sessions. These techniques keep your energy levels up and sustain your motivation over time.`
  },
  {
    pageName: "Page 7: Motivation Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-motivation-skills",
    problem: "I find it challenging to stay positive and overcome setbacks in my studies.",
    solution: `The page provides strategies to cultivate a positive mindset and resilience. By reframing negative thoughts and learning from setbacks, you can maintain a positive attitude and continue progressing despite challenges.`
  },
  {
    pageName: "Page 7: Motivation Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-motivation-skills",
    problem: "I struggle with maintaining a consistent study routine.",
    solution: `The scheduling and goal-setting tools help you establish a regular study routine. Consistency in your study habits ensures steady progress and reduces the likelihood of falling behind.`
  },
  {
    pageName: "Page 7: Motivation Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-motivation-skills",
    problem: "I lack effective strategies to combat procrastination.",
    solution: `The page offers practical techniques to overcome procrastination, such as the Pomodoro Technique and setting immediate, achievable goals. These strategies help you take action and stay on task.`
  },
  {
    pageName: "Page 7: Motivation Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-motivation-skills",
    problem: "I have trouble staying motivated without immediate rewards.",
    solution: `The motivational tools encourage you to set long-term goals and recognize the intrinsic rewards of achieving them. Understanding the bigger picture helps sustain your motivation beyond immediate gratification.`
  },
  {
    pageName: "Page 7: Motivation Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-motivation-skills",
    problem: "I struggle with staying committed to my long-term academic goals.",
    solution: `The goal-setting frameworks and progress-tracking tools help you stay committed by breaking down long-term goals into actionable steps. Regularly reviewing your progress keeps you aligned with your objectives.`
  },
  {
    pageName: "Page 7: Motivation Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-motivation-skills",
    problem: "I need techniques to boost my confidence and belief in my academic abilities.",
    solution: `The page provides tools to set and achieve small goals, which builds your confidence over time. Celebrating these small successes reinforces your belief in your ability to succeed academically.`
  },
  {
    pageName: "Page 7: Motivation Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-motivation-skills",
    problem: "I struggle with balancing motivation across multiple courses and assignments.",
    solution: `The motivational tools help you prioritize tasks and set specific goals for each course. This balanced approach ensures you stay motivated and manage your workload effectively across all your classes.`
  },
  {
    pageName: "Page 7: Motivation Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-motivation-skills",
    problem: "I find it hard to stay motivated when facing challenging or uninteresting subjects.",
    solution: `The page offers strategies to find relevance and interest in challenging subjects, such as setting personal goals and seeking connections to your interests. These techniques help you maintain motivation even with less engaging material.`
  },
  {
    pageName: "Page 7: Motivation Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-motivation-skills",
    problem: "I need assistance in tracking my progress towards my academic goals.",
    solution: `The goal-tracking tools provided help you monitor your progress and adjust your plans as needed. Keeping track of your achievements ensures you stay on course towards your academic goals.`
  },
  {
    pageName: "Page 7: Motivation Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-motivation-skills",
    problem: "I struggle with finding intrinsic motivation for my studies.",
    solution: `The motivational tools encourage you to connect your studies to personal interests and long-term aspirations. Understanding the intrinsic value of your education fosters a deeper, more sustainable motivation.`
  },
  {
    pageName: "Page 7: Motivation Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-motivation-skills",
    problem: "I have difficulty staying motivated during times of personal stress or hardship.",
    solution: `The page offers resilience-building strategies and stress management tools to help you maintain motivation even during challenging personal times. These resources support you in balancing personal and academic pressures.`
  },
  {
    pageName: "Page 7: Motivation Skills",
    pageLink: "https://byu.instructure.com/courses/27109/pages/soft-skills-motivation-skills",
    problem: "I need strategies to sustain my motivation throughout the semester.",
    solution: `The motivational tools provide ongoing support through goal setting, progress tracking, and regular self-assessment. These strategies help you maintain consistent motivation and achieve your academic objectives throughout the semester.`
  }
];

// ==============================
// 2) INITIALIZE FUSE (FUZZY SEARCH)
// ==============================
// We only fuzzy-search the 'problem' text here. If you want to include 'solution',
// add {keys: ["problem", "solution"]}, etc.

const fuse = new Fuse(problems, {
  keys: ["problem", "solution"],
  threshold: 0.4
});

// ==============================
// 3) DOM REFERENCES
// ==============================
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const searchResultsDiv = document.getElementById("searchResults");
const searchResultsList = document.getElementById("searchResultsList");

// ==============================
// 4) PERFORM FUZZY SEARCH
// ==============================
function performSearch() {
  const query = searchInput.value.trim();
  searchResultsList.innerHTML = "";

  // If empty, hide results
  if (!query) {
    searchResultsDiv.style.display = "none";
    return;
  }

  // Fuzzy search using Fuse.js
  const results = fuse.search(query);

  // No matches
  if (results.length === 0) {
    searchResultsDiv.style.display = "none";
    return;
  }

  // We have matches, show container
  searchResultsDiv.style.display = "block";

  // Render each match
  results.forEach(({ item }) => {
    const { problem, solution, pageName, pageLink } = item;

    // Container for one search result
    const resultItem = document.createElement("div");
    resultItem.className = "search-result-item";

    // The problem statement
    const title = document.createElement("h4");
    title.textContent = problem;

    // The solution div (hidden by default)
    const solutionDiv = document.createElement("div");
    solutionDiv.className = "solution";
    solutionDiv.innerHTML = `
      <p><strong>Solution:</strong> ${solution}</p>
      <p>
        <strong>See more on:</strong> 
        <a href="${pageLink}" target="_blank">${pageName}</a>
      </p>
    `;

    // Toggle solution on click
    resultItem.addEventListener("click", () => {
      solutionDiv.style.display = (solutionDiv.style.display === "block") ? "none" : "block";
    });

    // Append elements
    resultItem.appendChild(title);
    resultItem.appendChild(solutionDiv);
    searchResultsList.appendChild(resultItem);
  });
}

// ==============================
// 5) EVENT LISTENERS
// ==============================
searchButton.addEventListener("click", performSearch);
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    performSearch();
  }
});
