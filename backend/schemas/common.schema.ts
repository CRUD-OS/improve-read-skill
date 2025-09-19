export const typeDefs = `
  type User {
    id: ID!
    name: String!
    token:String
  }

  type AuthPayload{
   user: User!
  token: String!
  }

  type Book {
    id: ID!
    title: String!
    chapters: Int!
    author: String!
    categories: [String!]!
    content:[String!]!
    image: [String!]!
    audio_url: [String!]!
  }

type Chapter {
bookId:ID!
title:String
content:[String]
audio_url:String
}

type Content {
  id: ID!
  chapterId: ID!
  chapter: Chapter!
}

type Question {
  id: ID!
  bookId: ID
  chapterId: ID
  question: String!
  answer: String!
  option: QuestionOptions
  createdAt: String!
  updatedAt: String!
}

type Answer {
  id: ID!
  bookId: ID!
  chapterId: ID!
  questionId: ID!
  userId: String!
  answer: String!
  isCorrect: Boolean!
  createdAt: String!
  updatedAt: String!
}

type GeneratedQuestions {
  questions: [String!]!
  bookId: ID
  chapterId: ID
  content: String!
  difficulty: String!
  numberOfQuestions: Int!
}

type QuestionOptions {
  options: [String!]!
  explanation: String!
}

type AnswerResult {
  id: ID!
  questionId: ID!
  userAnswer: String!
  correctAnswer: String!
  isCorrect: Boolean!
  options: QuestionOptions
  explanation: String
}

type UserScore {
  userId: ID!
  bookId: ID
  chapterId: ID
  totalQuestions: Int!
  correctAnswers: Int!
  score: Int!
  percentage: Int!
}
 type Transcription {
  id: ID!
  text: String!
  userId: ID!
  bookId: ID!
  isCorrect: Boolean!
  score: Int!
  createdAt: String!
  wordCount: Int!
  duration: Int
}


  type Query {
    getUsers: [User!]!
    getQuestionsForBook(bookId: ID, chapterId: ID): [Question!]!
    getUserAnswers(userId: ID!, bookId: ID, chapterId: ID): [Answer!]!
    getUserScore(userId: ID!, bookId: ID, chapterId: ID): UserScore!
    getBooks: [Book!]!

    getBookById(bookId:ID!): Book!
    getUserProgress(userId:ID!): [UserProgressResponse]
    getUserById(userId:ID!) : User!

    getTranscriptions(userId: ID!): [Transcription]!
    getTranscription(id: ID!): Transcription
  }

 type UserProgressResponse {
  questionId: ID
  question: String
  answer: String
  isCorrect: Boolean
  timeDuration: Float
  userName: String
  completed: Boolean
  score: Int
  explanation: String
  success: Boolean

}
  

  type Mutation {
    createUser(name: String!): AuthPayload!
    addBook(title: String!, chapters: Int, author: String, categories: [String], content: String, image: [String], audio_url: [String]): Book!
    addContent(bookId:ID!, title:String, content:[String], audio_url:String): Chapter!
    generateQuestions(chapter: String!): [String!]!
    generateQuestionsWithContent(content: String!, bookId: ID, chapterId: ID, difficulty: String, numberOfQuestions: Int): GeneratedQuestions!
    generateMCQQuestions(content: String!, bookId: ID, chapterId: ID, difficulty: String, numberOfQuestions: Int, language: String): [Question!]!
    submitAnswer(questionId: ID!, userAnswer: String!, bookId: ID, chapterId: ID): AnswerResult!

    userProgress(userId: ID, bookId: ID, chapterId: ID, questionId: ID!, answer: String!, timeDuration: Int!):UserProgressResponse
    loginUser(name: String!): AuthPayload!
    generateQuestionsWithContent(
      content: String!
      bookId: ID
      chapterId: ID
      difficulty: String
      numberOfQuestions: Int
    ): GeneratedQuestions!
    generateMCQQuestions(
      content: String!
      bookId: ID
      chapterId: ID
      difficulty: String
      numberOfQuestions: Int
      language: String
    ): [Question!]!
    submitAnswer(
      questionId: ID!
      userAnswer: String!
      bookId: ID
      chapterId: ID
    ): AnswerResult!
     transcribeAudio(userId: ID!, bookId: ID!, audioBase64: String!): Transcription!
  }
`;
