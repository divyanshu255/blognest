const mongoose = require('mongoose');
const Post = require('../models/Post');
const User = require('../models/User');
const Category = require('../models/Category');

const dummyUsers = [
  {
    _id: new mongoose.Types.ObjectId(),
    clerkId: 'user_2abc123def456',
    email: 'john.doe@example.com',
    username: 'johndoe',
    firstName: 'John',
    lastName: 'Doe',
    profileImage: '',
    bio: 'Full-stack developer passionate about modern web technologies',
    isVerified: true,
    fullName: 'John Doe',
    followerCount: 150,
    followingCount: 75,
    followers: [],
    following: [],
    createdAt: new Date('2024-01-01T10:00:00.000Z'),
    isFollowing: false
  },
  {
    _id: new mongoose.Types.ObjectId(),
    clerkId: 'user_2def456ghi789',
    email: 'sarah.wilson@example.com',
    username: 'sarahwilson',
    firstName: 'Sarah',
    lastName: 'Wilson',
    profileImage: '',
    bio: 'UX/UI designer creating beautiful digital experiences',
    isVerified: true,
    fullName: 'Sarah Wilson',
    followerCount: 320,
    followingCount: 120,
    followers: [],
    following: [],
    createdAt: new Date('2024-01-02T11:00:00.000Z'),
    isFollowing: false
  },
  {
    _id: new mongoose.Types.ObjectId(),
    clerkId: 'user_2ghi789jkl012',
    email: 'mike.chen@example.com',
    username: 'mikechen',
    firstName: 'Mike',
    lastName: 'Chen',
    profileImage: '',
    bio: 'Backend engineer specializing in scalable systems',
    isVerified: true,
    fullName: 'Mike Chen',
    followerCount: 89,
    followingCount: 45,
    followers: [],
    following: [],
    createdAt: new Date('2024-01-03T12:00:00.000Z'),
    isFollowing: false
  },
  {
    _id: new mongoose.Types.ObjectId(),
    clerkId: 'user_2jkl012mno345',
    email: 'emma.rodriguez@example.com',
    username: 'emmarodriguez',
    firstName: 'Emma',
    lastName: 'Rodriguez',
    profileImage: '',
    bio: 'Frontend developer and accessibility advocate',
    isVerified: true,
    fullName: 'Emma Rodriguez',
    followerCount: 210,
    followingCount: 95,
    followers: [],
    following: [],
    createdAt: new Date('2024-01-04T13:00:00.000Z'),
    isFollowing: false
  },
  {
    _id: new mongoose.Types.ObjectId(),
    clerkId: 'user_2mno345pqr678',
    email: 'alex.kumar@example.com',
    username: 'alexkumar',
    firstName: 'Alex',
    lastName: 'Kumar',
    profileImage: '',
    bio: 'DevOps engineer and cloud architecture expert',
    isVerified: true,
    fullName: 'Alex Kumar',
    followerCount: 175,
    followingCount: 60,
    followers: [],
    following: [],
    createdAt: new Date('2024-01-05T14:00:00.000Z'),
    isFollowing: false
  }
];

const dummyCategories = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Technology',
    slug: 'technology',
    color: '#3B82F6',
    description: 'Latest technology trends and insights'
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Programming',
    slug: 'programming',
    color: '#10B981',
    description: 'Programming tutorials and best practices'
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Web Development',
    slug: 'web-development',
    color: '#F59E0B',
    description: 'Web development tips and tutorials'
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Design',
    slug: 'design',
    color: '#EF4444',
    description: 'UI/UX design principles and trends'
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Business',
    slug: 'business',
    color: '#8B5CF6',
    description: 'Business insights and strategies'
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Lifestyle',
    slug: 'lifestyle',
    color: '#EC4899',
    description: 'Lifestyle and personal development'
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Travel',
    slug: 'travel',
    color: '#06B6D4',
    description: 'Travel experiences and tips'
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Food',
    slug: 'food',
    color: '#84CC16',
    description: 'Food recipes and culinary adventures'
  }
];

const dummyPosts = [
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'The Future of Web Development in 2024',
    slug: 'future-web-development-2024',
    content: `<p>Web development is evolving rapidly with new technologies and frameworks emerging every year. In 2024, we're seeing a significant shift towards more efficient, performant, and user-friendly web applications.</p>
    
    <h2>Key Trends in 2024</h2>
    <p>One of the most exciting developments is the rise of WebAssembly (WASM), which allows developers to run high-performance code in the browser. This technology is revolutionizing how we think about web applications, enabling complex applications that were previously only possible as desktop software.</p>
    
    <p>Another major trend is the continued adoption of serverless architectures. Platforms like Vercel, Netlify, and AWS Lambda are making it easier than ever to deploy and scale web applications without managing servers.</p>
    
    <h2>Framework Evolution</h2>
    <p>React 19 brings significant improvements in performance and developer experience. The new concurrent features and improved server-side rendering capabilities are game-changers for modern web applications.</p>
    
    <p>Vue.js 4 and Angular 17 also bring exciting new features, making the choice of framework more about project requirements than personal preference.</p>`,
    excerpt: 'Explore the latest trends and technologies shaping the future of web development in 2024, from WebAssembly to serverless architectures.',
    featuredImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
    author: dummyUsers[0]._id,
    categories: [dummyCategories[0]._id, dummyCategories[2]._id],
    status: 'published',
    isPublished: true,
    publishedAt: new Date('2024-01-15T10:30:00.000Z'),
    createdAt: new Date('2024-01-15T10:30:00.000Z'),
    updatedAt: new Date('2024-01-15T10:30:00.000Z'),
    likes: [],
    viewCount: 1250
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'Mastering TypeScript: A Complete Guide',
    slug: 'mastering-typescript-complete-guide',
    content: `<p>TypeScript has become the de facto standard for large-scale JavaScript applications. Its static typing system and advanced features make it an essential tool for modern web development.</p>
    
    <h2>Why TypeScript?</h2>
    <p>TypeScript provides compile-time error checking, which helps catch bugs before they reach production. This is especially valuable in large codebases where manual testing becomes impractical.</p>
    
    <p>The language also offers excellent IDE support with features like intelligent code completion, refactoring tools, and inline documentation.</p>
    
    <h2>Advanced Features</h2>
    <p>Generics, decorators, and advanced type manipulation are some of TypeScript's most powerful features. Understanding these concepts can significantly improve your code quality and maintainability.</p>
    
    <p>Union types, intersection types, and conditional types provide flexible ways to model complex data structures and business logic.</p>`,
    excerpt: 'Learn how to leverage TypeScript\'s powerful type system to build more robust and maintainable web applications.',
    featuredImage: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=600&fit=crop',
    author: dummyUsers[1]._id,
    categories: [dummyCategories[1]._id],
    status: 'published',
    isPublished: true,
    publishedAt: new Date('2024-01-16T14:20:00.000Z'),
    createdAt: new Date('2024-01-16T14:20:00.000Z'),
    updatedAt: new Date('2024-01-16T14:20:00.000Z'),
    likes: [],
    viewCount: 890
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'Designing for Accessibility: Best Practices',
    slug: 'designing-accessibility-best-practices',
    content: `<p>Accessibility should be a fundamental consideration in every design decision, not an afterthought. Creating inclusive digital experiences benefits all users, not just those with disabilities.</p>
    
    <h2>Core Principles</h2>
    <p>The Web Content Accessibility Guidelines (WCAG) provide a comprehensive framework for creating accessible web content. Understanding these guidelines is essential for any designer or developer.</p>
    
    <p>Color contrast, keyboard navigation, and screen reader compatibility are just a few of the many aspects that need attention when designing for accessibility.</p>
    
    <h2>Implementation Strategies</h2>
    <p>Semantic HTML is the foundation of accessible web design. Using proper heading structures, form labels, and ARIA attributes ensures that assistive technologies can properly interpret your content.</p>
    
    <p>Testing with real users who rely on assistive technologies is invaluable for understanding the actual user experience and identifying areas for improvement.</p>`,
    excerpt: 'Discover essential accessibility practices that will make your web applications usable by everyone, regardless of their abilities.',
    featuredImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
    author: dummyUsers[2]._id,
    categories: [dummyCategories[3]._id, dummyCategories[2]._id],
    status: 'published',
    isPublished: true,
    publishedAt: new Date('2024-01-17T09:15:00.000Z'),
    createdAt: new Date('2024-01-17T09:15:00.000Z'),
    updatedAt: new Date('2024-01-17T09:15:00.000Z'),
    likes: [],
    viewCount: 1560
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'Building Scalable Microservices Architecture',
    slug: 'building-scalable-microservices-architecture',
    content: `<p>Microservices architecture has become the preferred approach for building large-scale, distributed applications. This architectural pattern offers numerous benefits but also introduces new challenges.</p>
    
    <h2>Benefits of Microservices</h2>
    <p>Independent deployment, technology diversity, and fault isolation are among the key advantages of microservices. Each service can be developed, deployed, and scaled independently.</p>
    
    <p>This approach also enables teams to work autonomously, reducing coordination overhead and accelerating development cycles.</p>
    
    <h2>Implementation Challenges</h2>
    <p>Service discovery, data consistency, and distributed tracing are common challenges in microservices architectures. Understanding these challenges and implementing appropriate solutions is crucial for success.</p>
    
    <p>API gateways, message queues, and distributed databases are essential components that help address these challenges.</p>`,
    excerpt: 'Learn how to design and implement a robust microservices architecture that can scale with your business needs.',
    featuredImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
    author: dummyUsers[3]._id,
    categories: [dummyCategories[1]._id, dummyCategories[4]._id],
    status: 'published',
    isPublished: true,
    publishedAt: new Date('2024-01-18T16:45:00.000Z'),
    createdAt: new Date('2024-01-18T16:45:00.000Z'),
    updatedAt: new Date('2024-01-18T16:45:00.000Z'),
    likes: [],
    viewCount: 2100
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'The Art of Remote Work: Productivity Tips',
    slug: 'art-remote-work-productivity-tips',
    content: `<p>Remote work has become the new normal for many professionals. While it offers flexibility and work-life balance, it also presents unique challenges that require intentional strategies to overcome.</p>
    
    <h2>Creating a Productive Environment</h2>
    <p>Setting up a dedicated workspace, establishing clear boundaries between work and personal life, and maintaining a consistent routine are essential for remote work success.</p>
    
    <p>Investing in quality equipment, such as ergonomic furniture and reliable technology, can significantly improve your productivity and well-being.</p>
    
    <h2>Communication and Collaboration</h2>
    <p>Effective communication becomes even more critical in remote environments. Regular check-ins, clear documentation, and appropriate use of communication tools help maintain team cohesion.</p>
    
    <p>Building relationships with colleagues through virtual coffee chats and team-building activities helps maintain a positive work culture.</p>`,
    excerpt: 'Discover proven strategies for maintaining productivity and work-life balance in a remote work environment.',
    featuredImage: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
    author: dummyUsers[4]._id,
    categories: [dummyCategories[5]._id, dummyCategories[4]._id],
    status: 'published',
    isPublished: true,
    publishedAt: new Date('2024-01-19T11:30:00.000Z'),
    createdAt: new Date('2024-01-19T11:30:00.000Z'),
    updatedAt: new Date('2024-01-19T11:30:00.000Z'),
    likes: [],
    viewCount: 980
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'Exploring Hidden Gems: Travel Destinations Off the Beaten Path',
    slug: 'exploring-hidden-gems-travel-destinations',
    content: `<p>While popular tourist destinations have their appeal, there's something magical about discovering places that haven't been overrun by crowds. These hidden gems offer authentic experiences and unique perspectives on local culture.</p>
    
    <h2>Why Choose Lesser-Known Destinations</h2>
    <p>Smaller crowds, lower prices, and more authentic experiences are just a few reasons to venture off the beaten path. You'll often find that locals are more welcoming when they're not overwhelmed by tourism.</p>
    
    <p>These destinations also tend to be more sustainable, as they haven't been overdeveloped to accommodate mass tourism.</p>
    
    <h2>Planning Your Adventure</h2>
    <p>Research is key when visiting lesser-known destinations. Local blogs, travel forums, and social media can provide valuable insights that guidebooks might miss.</p>
    
    <p>Learning a few phrases in the local language and understanding cultural customs can greatly enhance your experience and show respect for the local community.</p>`,
    excerpt: 'Discover amazing travel destinations that most tourists never see, and learn how to plan authentic adventures.',
    featuredImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
    author: dummyUsers[0]._id,
    categories: [dummyCategories[6]._id],
    status: 'published',
    isPublished: true,
    publishedAt: new Date('2024-01-20T13:20:00.000Z'),
    createdAt: new Date('2024-01-20T13:20:00.000Z'),
    updatedAt: new Date('2024-01-20T13:20:00.000Z'),
    likes: [],
    viewCount: 750
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'Modern JavaScript: ES2024 Features You Need to Know',
    slug: 'modern-javascript-es2024-features',
    content: `<p>JavaScript continues to evolve rapidly, with new features being added regularly. Staying up-to-date with the latest language features can significantly improve your code quality and development experience.</p>
    
    <h2>New Language Features</h2>
    <p>ES2024 introduces several exciting new features, including improved array methods, better error handling, and enhanced module system capabilities.</p>
    
    <p>Optional chaining and nullish coalescing operators have become essential tools for writing more robust code that handles edge cases gracefully.</p>
    
    <h2>Performance Improvements</h2>
    <p>Modern JavaScript engines have made significant performance improvements. Understanding how to leverage these optimizations can help you write faster, more efficient code.</p>
    
    <p>Async/await patterns and modern iteration methods provide cleaner, more readable code compared to traditional callback-based approaches.</p>`,
    excerpt: 'Stay ahead of the curve by learning the latest JavaScript features and how they can improve your development workflow.',
    featuredImage: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop',
    author: dummyUsers[1]._id,
    categories: [dummyCategories[1]._id, dummyCategories[2]._id],
    status: 'published',
    isPublished: true,
    publishedAt: new Date('2024-01-21T15:10:00.000Z'),
    createdAt: new Date('2024-01-21T15:10:00.000Z'),
    updatedAt: new Date('2024-01-21T15:10:00.000Z'),
    likes: [],
    viewCount: 1120
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'The Psychology of User Experience Design',
    slug: 'psychology-user-experience-design',
    content: `<p>Great user experience design goes beyond aesthetics and functionality. Understanding human psychology and behavior patterns is crucial for creating interfaces that users love to interact with.</p>
    
    <h2>Cognitive Load and User Interface</h2>
    <p>Human cognitive capacity is limited, so designing interfaces that minimize cognitive load is essential. Simple, clear layouts and intuitive navigation help users accomplish their goals efficiently.</p>
    
    <p>Visual hierarchy, consistent design patterns, and progressive disclosure are techniques that help manage cognitive load effectively.</p>
    
    <h2>Emotional Design</h2>
    <p>Emotions play a significant role in user decision-making. Designing for emotional responses can create more engaging and memorable experiences.</p>
    
    <p>Color psychology, typography choices, and micro-interactions all contribute to the emotional impact of a design.</p>`,
    excerpt: 'Learn how understanding human psychology can help you create more engaging and effective user experiences.',
    featuredImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    author: dummyUsers[2]._id,
    categories: [dummyCategories[3]._id],
    status: 'published',
    isPublished: true,
    publishedAt: new Date('2024-01-22T10:45:00.000Z'),
    createdAt: new Date('2024-01-22T10:45:00.000Z'),
    updatedAt: new Date('2024-01-22T10:45:00.000Z'),
    likes: [],
    viewCount: 890
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'Cloud Computing: Choosing the Right Platform',
    slug: 'cloud-computing-choosing-right-platform',
    content: `<p>The cloud computing landscape is vast and complex, with numerous providers offering different services and pricing models. Choosing the right platform for your project can significantly impact its success and cost-effectiveness.</p>
    
    <h2>Major Cloud Providers</h2>
    <p>AWS, Azure, and Google Cloud Platform are the three major players in the cloud computing space. Each has its strengths and specializations, making them suitable for different types of projects.</p>
    
    <p>Understanding the unique features and pricing models of each platform is essential for making an informed decision.</p>
    
    <h2>Cost Optimization Strategies</h2>
    <p>Cloud costs can quickly spiral out of control without proper management. Implementing cost monitoring, using reserved instances, and optimizing resource usage are crucial for maintaining cost-effectiveness.</p>
    
    <p>Multi-cloud strategies and hybrid cloud approaches can provide additional flexibility and cost optimization opportunities.</p>`,
    excerpt: 'Navigate the complex world of cloud computing and learn how to choose the best platform for your specific needs.',
    featuredImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
    author: dummyUsers[3]._id,
    categories: [dummyCategories[0]._id, dummyCategories[4]._id],
    status: 'published',
    isPublished: true,
    publishedAt: new Date('2024-01-23T14:30:00.000Z'),
    createdAt: new Date('2024-01-23T14:30:00.000Z'),
    updatedAt: new Date('2024-01-23T14:30:00.000Z'),
    likes: [],
    viewCount: 1340
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'Sustainable Living: Small Changes, Big Impact',
    slug: 'sustainable-living-small-changes-big-impact',
    content: `<p>Sustainability isn't about making drastic lifestyle changes overnight. It's about making small, consistent choices that collectively create a significant positive impact on our environment.</p>
    
    <h2>Everyday Sustainable Choices</h2>
    <p>Simple actions like reducing single-use plastics, choosing energy-efficient appliances, and supporting local businesses can make a real difference.</p>
    
    <p>Mindful consumption, including buying second-hand items and repairing instead of replacing, helps reduce waste and conserve resources.</p>
    
    <h2>Digital Sustainability</h2>
    <p>Even our digital habits have environmental impacts. Optimizing code for efficiency, using green hosting providers, and reducing unnecessary data storage are ways developers can contribute to sustainability.</p>
    
    <p>Remote work and digital collaboration tools can reduce carbon emissions from commuting and business travel.</p>`,
    excerpt: 'Discover practical ways to live more sustainably and reduce your environmental impact through everyday choices.',
    featuredImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    author: dummyUsers[4]._id,
    categories: [dummyCategories[5]._id],
    status: 'published',
    isPublished: true,
    publishedAt: new Date('2024-01-24T12:15:00.000Z'),
    createdAt: new Date('2024-01-24T12:15:00.000Z'),
    updatedAt: new Date('2024-01-24T12:15:00.000Z'),
    likes: [],
    viewCount: 670
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'React Performance Optimization Techniques',
    slug: 'react-performance-optimization-techniques',
    content: `<p>Performance is crucial for providing a great user experience in React applications. Understanding and implementing optimization techniques can significantly improve your app's speed and responsiveness.</p>
    
    <h2>Component Optimization</h2>
    <p>React.memo, useMemo, and useCallback are powerful tools for preventing unnecessary re-renders. Understanding when and how to use these optimizations is key to building performant applications.</p>
    
    <p>Code splitting and lazy loading help reduce initial bundle size, improving load times and user experience.</p>
    
    <h2>State Management</h2>
    <p>Efficient state management is essential for performance. Using appropriate state management solutions and avoiding unnecessary state updates can have a significant impact on performance.</p>
    
    <p>Context optimization and avoiding prop drilling are important considerations for larger applications.</p>`,
    excerpt: 'Learn advanced React optimization techniques to build faster, more responsive applications.',
    featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop',
    author: dummyUsers[0]._id,
    categories: [dummyCategories[1]._id, dummyCategories[2]._id],
    status: 'published',
    isPublished: true,
    publishedAt: new Date('2024-01-25T09:20:00.000Z'),
    createdAt: new Date('2024-01-25T09:20:00.000Z'),
    updatedAt: new Date('2024-01-25T09:20:00.000Z'),
    likes: [],
    viewCount: 1450
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'The Rise of AI in Software Development',
    slug: 'rise-ai-software-development',
    content: `<p>Artificial Intelligence is transforming the software development landscape, from code generation to testing and deployment. Understanding these tools and their implications is essential for modern developers.</p>
    
    <h2>AI-Powered Development Tools</h2>
    <p>GitHub Copilot, ChatGPT, and other AI coding assistants are revolutionizing how developers write code. These tools can significantly improve productivity and code quality.</p>
    
    <p>However, it's important to understand the limitations and ethical considerations of using AI in development.</p>
    
    <h2>Future Implications</h2>
    <p>AI is likely to automate many routine development tasks, allowing developers to focus on more creative and complex problem-solving.</p>
    
    <p>Understanding how to work effectively with AI tools will become an essential skill for developers.</p>`,
    excerpt: 'Explore how AI is changing software development and what it means for the future of the industry.',
    featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
    author: dummyUsers[1]._id,
    categories: [dummyCategories[0]._id, dummyCategories[1]._id],
    status: 'published',
    isPublished: true,
    publishedAt: new Date('2024-01-26T11:45:00.000Z'),
    createdAt: new Date('2024-01-26T11:45:00.000Z'),
    updatedAt: new Date('2024-01-26T11:45:00.000Z'),
    likes: [],
    viewCount: 1890
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'Building RESTful APIs with Node.js',
    slug: 'building-restful-apis-nodejs',
    content: `<p>RESTful APIs are the backbone of modern web applications. Building robust, scalable APIs with Node.js requires understanding best practices and common patterns.</p>
    
    <h2>API Design Principles</h2>
    <p>RESTful design principles, proper HTTP status codes, and consistent response formats are essential for building APIs that are easy to use and maintain.</p>
    
    <p>Authentication, authorization, and rate limiting are crucial security considerations for any API.</p>
    
    <h2>Performance and Scalability</h2>
    <p>Caching strategies, database optimization, and load balancing are important considerations for building scalable APIs.</p>
    
    <p>Monitoring, logging, and error handling are essential for maintaining reliable APIs in production.</p>`,
    excerpt: 'Learn how to build robust, scalable RESTful APIs using Node.js and best practices.',
    featuredImage: 'https://images.unsplash.com/photo-1555066932-4b6f5716687a?w=800&h=600&fit=crop',
    author: dummyUsers[2]._id,
    categories: [dummyCategories[1]._id, dummyCategories[2]._id],
    status: 'published',
    isPublished: true,
    publishedAt: new Date('2024-01-27T16:30:00.000Z'),
    createdAt: new Date('2024-01-27T16:30:00.000Z'),
    updatedAt: new Date('2024-01-27T16:30:00.000Z'),
    likes: [],
    viewCount: 1120
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'CSS Grid vs Flexbox: When to Use Each',
    slug: 'css-grid-vs-flexbox-when-to-use',
    content: `<p>CSS Grid and Flexbox are powerful layout tools, but understanding when to use each can significantly improve your CSS skills and create better layouts.</p>
    
    <h2>Understanding the Differences</h2>
    <p>Flexbox is designed for one-dimensional layouts (rows or columns), while CSS Grid is designed for two-dimensional layouts (rows and columns).</p>
    
    <p>Understanding these fundamental differences helps you choose the right tool for each layout challenge.</p>
    
    <h2>Best Practices</h2>
    <p>Often, the best approach is to combine both tools. Use Flexbox for component-level layouts and CSS Grid for page-level layouts.</p>
    
    <p>Browser support and fallback strategies are important considerations when choosing layout methods.</p>`,
    excerpt: 'Master CSS layout techniques by understanding when to use Grid vs Flexbox for optimal results.',
    featuredImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    author: dummyUsers[3]._id,
    categories: [dummyCategories[2]._id, dummyCategories[3]._id],
    status: 'published',
    isPublished: true,
    publishedAt: new Date('2024-01-28T13:15:00.000Z'),
    createdAt: new Date('2024-01-28T13:15:00.000Z'),
    updatedAt: new Date('2024-01-28T13:15:00.000Z'),
    likes: [],
    viewCount: 980
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'Database Design Best Practices',
    slug: 'database-design-best-practices',
    content: `<p>Good database design is the foundation of any successful application. Understanding database design principles and best practices is essential for building scalable, maintainable systems.</p>
    
    <h2>Normalization and Performance</h2>
    <p>Database normalization helps eliminate data redundancy and maintain data integrity. However, over-normalization can impact performance.</p>
    
    <p>Finding the right balance between normalization and performance is crucial for optimal database design.</p>
    
    <h2>Indexing Strategies</h2>
    <p>Proper indexing is essential for query performance. Understanding different types of indexes and when to use them can significantly improve database performance.</p>
    
    <p>Regular monitoring and optimization of database performance is important for maintaining system health.</p>`,
    excerpt: 'Learn essential database design principles and best practices for building robust applications.',
    featuredImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=600&fit=crop',
    author: dummyUsers[4]._id,
    categories: [dummyCategories[1]._id, dummyCategories[4]._id],
    status: 'published',
    isPublished: true,
    publishedAt: new Date('2024-01-29T10:45:00.000Z'),
    createdAt: new Date('2024-01-29T10:45:00.000Z'),
    updatedAt: new Date('2024-01-29T10:45:00.000Z'),
    likes: [],
    viewCount: 1340
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'Mobile-First Design Principles',
    slug: 'mobile-first-design-principles',
    content: `<p>With mobile devices accounting for the majority of web traffic, designing for mobile first has become essential. This approach ensures your applications work well on all devices.</p>
    
    <h2>Why Mobile-First?</h2>
    <p>Mobile-first design forces you to focus on essential content and functionality. This often results in better user experiences across all devices.</p>
    
    <p>Performance considerations are also more critical on mobile devices, leading to better overall application performance.</p>
    
    <h2>Implementation Strategies</h2>
    <p>Responsive design, touch-friendly interfaces, and optimized images are essential for mobile-first design.</p>
    
    <p>Testing on real devices and understanding mobile user behavior patterns are crucial for success.</p>`,
    excerpt: 'Master mobile-first design principles to create better user experiences across all devices.',
    featuredImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
    author: dummyUsers[0]._id,
    categories: [dummyCategories[3]._id, dummyCategories[2]._id],
    status: 'published',
    isPublished: true,
    publishedAt: new Date('2024-01-30T14:20:00.000Z'),
    createdAt: new Date('2024-01-30T14:20:00.000Z'),
    updatedAt: new Date('2024-01-30T14:20:00.000Z'),
    likes: [],
    viewCount: 890
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'Cybersecurity for Web Developers',
    slug: 'cybersecurity-web-developers',
    content: `<p>Security should be a top priority for every web developer. Understanding common vulnerabilities and implementing proper security measures is essential for protecting users and applications.</p>
    
    <h2>Common Vulnerabilities</h2>
    <p>SQL injection, XSS attacks, and CSRF attacks are among the most common security vulnerabilities in web applications.</p>
    
    <p>Understanding these vulnerabilities and implementing proper defenses is crucial for building secure applications.</p>
    
    <h2>Security Best Practices</h2>
    <p>Input validation, output encoding, and proper authentication are fundamental security practices.</p>
    
    <p>Regular security audits and staying updated with security best practices are essential for maintaining secure applications.</p>`,
    excerpt: 'Learn essential cybersecurity practices to protect your web applications and users.',
    featuredImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop',
    author: dummyUsers[1]._id,
    categories: [dummyCategories[0]._id, dummyCategories[1]._id],
    status: 'published',
    isPublished: true,
    publishedAt: new Date('2024-01-31T12:30:00.000Z'),
    createdAt: new Date('2024-01-31T12:30:00.000Z'),
    updatedAt: new Date('2024-01-31T12:30:00.000Z'),
    likes: [],
    viewCount: 1670
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'The Future of E-commerce: Trends to Watch',
    slug: 'future-ecommerce-trends-watch',
    content: `<p>E-commerce is constantly evolving with new technologies and changing consumer behaviors. Understanding emerging trends can help businesses stay competitive and provide better customer experiences.</p>
    
    <h2>Emerging Technologies</h2>
    <p>Augmented reality, voice commerce, and AI-powered personalization are transforming the e-commerce landscape.</p>
    
    <p>Understanding these technologies and their potential impact is essential for e-commerce businesses.</p>
    
    <h2>Consumer Behavior Changes</h2>
    <p>Mobile shopping, social commerce, and sustainability concerns are driving changes in consumer behavior.</p>
    
    <p>Adapting to these changes and implementing appropriate strategies is crucial for success.</p>`,
    excerpt: 'Discover the latest e-commerce trends and technologies that are shaping the future of online shopping.',
    featuredImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    author: dummyUsers[2]._id,
    categories: [dummyCategories[4]._id, dummyCategories[0]._id],
    status: 'published',
    isPublished: true,
    publishedAt: new Date('2024-02-01T15:45:00.000Z'),
    createdAt: new Date('2024-02-01T15:45:00.000Z'),
    updatedAt: new Date('2024-02-01T15:45:00.000Z'),
    likes: [],
    viewCount: 1450
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'Building a Personal Brand as a Developer',
    slug: 'building-personal-brand-developer',
    content: `<p>In today's competitive tech industry, building a strong personal brand can significantly impact your career opportunities and professional growth.</p>
    
    <h2>Why Personal Branding Matters</h2>
    <p>A strong personal brand helps you stand out in a crowded market, attract better opportunities, and build valuable professional relationships.</p>
    
    <p>It also provides a platform for sharing knowledge and contributing to the developer community.</p>
    
    <h2>Building Your Brand</h2>
    <p>Consistent content creation, active participation in the community, and authentic communication are key to building a strong personal brand.</p>
    
    <p>Leveraging social media, blogging, and speaking opportunities can help expand your reach and influence.</p>`,
    excerpt: 'Learn how to build a strong personal brand that can advance your career and open new opportunities.',
    featuredImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    author: dummyUsers[3]._id,
    categories: [dummyCategories[4]._id, dummyCategories[5]._id],
    status: 'published',
    isPublished: true,
    publishedAt: new Date('2024-02-02T11:20:00.000Z'),
    createdAt: new Date('2024-02-02T11:20:00.000Z'),
    updatedAt: new Date('2024-02-02T11:20:00.000Z'),
    likes: [],
    viewCount: 980
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'Testing Strategies for Modern Web Applications',
    slug: 'testing-strategies-modern-web-applications',
    content: `<p>Comprehensive testing is essential for building reliable, maintainable web applications. Understanding different testing strategies and when to use them is crucial for modern development.</p>
    
    <h2>Types of Testing</h2>
    <p>Unit testing, integration testing, and end-to-end testing each serve different purposes in the testing strategy.</p>
    
    <p>Understanding when and how to implement each type of testing is essential for building robust applications.</p>
    
    <h2>Testing Tools and Frameworks</h2>
    <p>Jest, Cypress, and Playwright are popular testing tools that can help you implement comprehensive testing strategies.</p>
    
    <p>Automated testing and continuous integration help ensure code quality and prevent regressions.</p>`,
    excerpt: 'Master modern testing strategies to build more reliable and maintainable web applications.',
    featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    author: dummyUsers[4]._id,
    categories: [dummyCategories[1]._id, dummyCategories[2]._id],
    status: 'published',
    isPublished: true,
    publishedAt: new Date('2024-02-03T13:10:00.000Z'),
    createdAt: new Date('2024-02-03T13:10:00.000Z'),
    updatedAt: new Date('2024-02-03T13:10:00.000Z'),
    likes: [],
    viewCount: 1120
  }
];

async function seedPosts() {
  try {
    console.log('🌱 Starting to seed posts...');
    
    // Clear existing data
    await Post.deleteMany({});
    await User.deleteMany({});
    await Category.deleteMany({});
    
    console.log('🗑️ Cleared existing data');
    
    // Insert users
    const createdUsers = await User.insertMany(dummyUsers);
    console.log(`👥 Created ${createdUsers.length} users`);
    
    // Insert categories
    const createdCategories = await Category.insertMany(dummyCategories);
    console.log(`📂 Created ${createdCategories.length} categories`);
    
    // Insert posts
    const createdPosts = await Post.insertMany(dummyPosts);
    console.log(`📝 Created ${createdPosts.length} posts`);
    
    console.log('✅ Seeding completed successfully!');
    console.log(`📊 Summary: ${createdUsers.length} users, ${createdCategories.length} categories, ${createdPosts.length} posts`);
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

module.exports = { seedPosts }; 