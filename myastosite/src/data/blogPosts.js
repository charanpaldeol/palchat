// Validation function to ensure blog post content is safe
function validateBlogPost(post) {
  // Check for dangerous HTML patterns
  const dangerousPatterns = /<script|<iframe|<object|<embed|javascript:|on\w+\s*=/i;
  
  if (dangerousPatterns.test(post.content) || 
      dangerousPatterns.test(post.title) || 
      dangerousPatterns.test(post.excerpt)) {
    throw new Error('Blog post contains potentially dangerous content');
  }
  
  // Validate required fields
  if (!post.id || !post.title || !post.content) {
    throw new Error('Blog post missing required fields');
  }
  
  // Validate content length
  if (post.title.length > 200) {
    throw new Error('Blog post title too long');
  }
  
  if (post.content.length > 50000) {
    throw new Error('Blog post content too long');
  }
  
  return post;
}

const blogPostsData = [
  {
    id: 1,
    title: "Why Privacy-First Communication Matters",
    excerpt: "In a world where every app wants your data, we're building something different...",
    content: `
      <p>Privacy isn't just a feature—it's the foundation of trust. When we built PalChat, we started with a simple question: what if you could communicate freely without the burden of profiles, passwords, or personal data collection?</p>
      
      <h2>The Problem with Modern Communication</h2>
      <p>Every time you open a messaging app, you're being asked to give up something: your phone number, your email, your personal information. But what if the best conversations happen when there are no barriers?</p>
      
      <p>Think about it: when you're talking to someone face-to-face, you don't need to create an account. You don't need to verify your identity. You just... talk. That's the kind of communication we want to enable online.</p>
      
      <h2>Building for Moments, Not Memories</h2>
      <p>Not every conversation needs to be saved forever. Some of the most meaningful exchanges happen in the moment, without the pressure of creating a permanent digital footprint. When you know something will disappear, you're more likely to be honest, vulnerable, and authentic.</p>
      
      <p>This isn't about hiding—it's about creating a space where people can be themselves without fear of judgment or consequences.</p>
      
      <h2>The Technical Approach</h2>
      <p>We've built PalChat with privacy at its core:</p>
      <ul>
        <li><strong>No accounts required:</strong> Just start chatting immediately</li>
        <li><strong>No personal data collection:</strong> We don't store your information</li>
        <li><strong>End-to-end encryption:</strong> Your messages are secure</li>
        <li><strong>Temporary by design:</strong> Messages disappear after a set time</li>
      </ul>
      
      <p>This approach isn't just about privacy—it's about creating a more human way to communicate online.</p>
      
      <h2>Looking Forward</h2>
      <p>As we continue to build PalChat, we're guided by one principle: technology should serve people, not the other way around. When you remove the barriers to communication, you create space for genuine human connection.</p>
      
      <p>That's what privacy-first communication is really about: creating a digital space where people can be themselves, without the burden of digital identity or the pressure of permanent records.</p>
    `,
    author: "Anonymous",
    authorId: "anon_1",
    date: "2025-01-19",
    likes: 42,
    comments: 8,
    tags: ["privacy", "communication", "technology"],
    category: "privacy",
    readTime: "3 min read",
    wordCount: 450,
    expiresAt: null,
    isAnonymous: true,
    shareCount: 15
  },
  {
    id: 2,
    title: "The Problem with Account-Based Platforms",
    excerpt: "Why requiring accounts creates barriers to genuine communication...",
    content: `
      <p>Every time you're asked to create an account, you're being asked to give up something: your time, your data, your privacy. But what if the best conversations happen when there are no barriers?</p>
      
      <h2>The Account Barrier</h2>
      <p>Think about the last time you wanted to try a new app or service. How many times have you been stopped by the "Create Account" screen? You just wanted to see what it was like, but suddenly you're being asked for your email, phone number, and personal details.</p>
      
      <p>This creates an immediate barrier to entry. It says: "You can't participate unless you give us your information first."</p>
      
      <h2>What We Lose</h2>
      <p>When we require accounts for everything, we lose:</p>
      <ul>
        <li><strong>Spontaneity:</strong> You can't just jump into a conversation</li>
        <li><strong>Anonymity:</strong> Every interaction is tied to your identity</li>
        <li><strong>Honesty:</strong> People are less likely to be vulnerable when everything is permanent</li>
        <li><strong>Accessibility:</strong> Not everyone wants to create accounts for everything</li>
      </ul>
      
      <h2>The Alternative</h2>
      <p>What if you could just... start talking? No forms to fill out, no verification emails, no password requirements. Just immediate, direct communication.</p>
      
      <p>This isn't about avoiding responsibility—it's about creating a space where communication can happen naturally, without artificial barriers.</p>
      
      <h2>Building for Real People</h2>
      <p>When we designed PalChat, we asked ourselves: "What would communication look like if we removed all the barriers?" The answer was simple: more human, more honest, more meaningful.</p>
      
      <p>By removing the account requirement, we're not just making it easier to use—we're creating a fundamentally different kind of digital space.</p>
    `,
    author: "Anonymous",
    authorId: "anon_2",
    date: "2025-01-18",
    likes: 28,
    comments: 12,
    tags: ["accounts", "barriers", "communication"],
    category: "technology",
    readTime: "5 min read",
    wordCount: 750,
    expiresAt: "2025-02-18",
    isAnonymous: true,
    shareCount: 8
  },
  {
    id: 3,
    title: "Built for Moments, Not Memories",
    excerpt: "Some conversations are meant to be temporary, and that's perfectly okay...",
    content: `
      <p>Not every conversation needs to be saved forever. Some of the most meaningful exchanges happen in the moment, without the pressure of creating a permanent digital footprint.</p>
      
      <h2>The Pressure of Permanence</h2>
      <p>When you know that every message you send will be stored forever, it changes how you communicate. You become more careful, more calculated, less authentic. You start thinking about how your words might look to someone reading them years later.</p>
      
      <p>This isn't natural. In real life, most conversations are ephemeral. They happen, they matter, and then they fade. And that's okay.</p>
      
      <h2>Why Temporary Matters</h2>
      <p>Temporary communication allows for:</p>
      <ul>
        <li><strong>Honesty:</strong> You can be more vulnerable when you know it won't last forever</li>
        <li><strong>Spontaneity:</strong> You can say what you're thinking without overthinking it</li>
        <li><strong>Authenticity:</strong> You can be yourself without worrying about your digital legacy</li>
        <li><strong>Focus:</strong> You pay more attention to the present moment</li>
      </ul>
      
      <h2>The Beauty of Ephemeral</h2>
      <p>There's something beautiful about conversations that exist only in the moment. They're like sandcastles—temporary, but meaningful while they last. You build them together, enjoy them, and then let them go.</p>
      
      <p>This doesn't make them less valuable. In fact, it might make them more valuable because they exist only in the present.</p>
      
      <h2>Designing for the Moment</h2>
      <p>When we built PalChat, we embraced the temporary nature of real conversations. Messages disappear after a set time, not because we want to hide anything, but because we want to create space for genuine, in-the-moment communication.</p>
      
      <p>It's about creating digital spaces that feel more like real conversations and less like permanent records.</p>
    `,
    author: "Anonymous",
    authorId: "anon_3",
    date: "2025-01-17",
    likes: 35,
    comments: 6,
    tags: ["moments", "temporary", "conversations"],
    category: "communication",
    readTime: "4 min read",
    wordCount: 600,
    expiresAt: "2025-01-24",
    isAnonymous: true,
    shareCount: 22
  },
  {
    id: 4,
    title: "The Art of Anonymous Expression",
    excerpt: "How anonymity can lead to more authentic and honest communication...",
    content: `
      <p>When we remove the pressure of identity, something remarkable happens. People feel free to express their true thoughts, share honest opinions, and engage in genuine dialogue without fear of judgment or consequences.</p>
      
      <h2>The Power of Anonymity</h2>
      <p>Anonymity isn't about hiding—it's about creating space for authentic expression. When you're not tied to your name, your job, your social status, or your digital reputation, you can speak from the heart.</p>
      
      <p>Think about it: when you're talking to a stranger on a train, you might share things you wouldn't tell your closest friends. Why? Because there are no consequences, no judgments, no expectations.</p>
      
      <h2>Breaking Down Barriers</h2>
      <p>Identity creates barriers. When you know someone's name, job, and background, you start making assumptions. You categorize them, judge them, and filter what you say based on who you think they are.</p>
      
      <p>Anonymity removes these barriers. It allows people to connect as human beings, not as representatives of their social categories.</p>
      
      <h2>The Research</h2>
      <p>Studies have shown that anonymous communication can lead to:</p>
      <ul>
        <li><strong>More honest feedback:</strong> People are more likely to share their true opinions</li>
        <li><strong>Greater vulnerability:</strong> People feel safe to share personal experiences</li>
        <li><strong>Better problem-solving:</strong> Ideas are judged on merit, not source</li>
        <li><strong>Reduced bias:</strong> People focus on content rather than identity</li>
      </ul>
      
      <h2>Designing for Authenticity</h2>
      <p>When we built PalChat, we made anonymity the default. Not because we want to encourage bad behavior, but because we want to create space for genuine human connection.</p>
      
      <p>We believe that when people can communicate without the burden of identity, they're more likely to be honest, vulnerable, and authentic.</p>
      
      <h2>The Future of Communication</h2>
      <p>As we move forward, we're not just building a messaging app—we're exploring what communication could look like when we remove the artificial barriers that identity creates.</p>
      
      <p>It's about creating digital spaces where people can be themselves, speak their truth, and connect on a human level.</p>
    `,
    author: "Anonymous",
    authorId: "anon_1",
    date: "2025-01-16",
    likes: 51,
    comments: 14,
    tags: ["anonymity", "expression", "authenticity"],
    category: "privacy",
    readTime: "6 min read",
    wordCount: 900,
    expiresAt: null,
    isAnonymous: true,
    shareCount: 31
  }
];

// Validate all blog posts and export as blogPosts
export const blogPosts = blogPostsData.map(post => validateBlogPost(post)); 