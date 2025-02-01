"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ChevronRight, ChevronLeft, Check, CircleX } from "lucide-react"

export default function QuizApp({ data }: {
  data: {
    title: string;
    description: string;
    questions: {
      description: string;
      options: {
        id: number;
        description: string;
        is_correct: boolean;
      }[];
    }[];
  };
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string[]>(new Array(data.questions.length).fill(""))
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([])

  const handleNext = () => {
    if (currentQuestion < data.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowFeedback(false)
    } else {
      setQuizCompleted(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setShowFeedback(false)
    }
  }

  const handleSubmit = () => {
    if (!selectedAnswer || answeredQuestions.includes(currentQuestion)) return

    const question = data.questions[currentQuestion]
    const isCorrect = question.options.find((opt) => opt.id.toString() === selectedAnswer[currentQuestion])?.is_correct

    if (isCorrect) {
      setScore(score + 4)
    } else {
      setScore(score - 1)
    }

    setShowFeedback(true)
    setAnsweredQuestions([...answeredQuestions, currentQuestion])
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(new Array(data.questions.length).fill(""))
    setShowFeedback(false)
    setScore(0)
    setQuizCompleted(false)
    setAnsweredQuestions([])
  }

  const question = data.questions[currentQuestion]
  const isCorrect = selectedAnswer && question.options.find((opt) => opt.id.toString() === selectedAnswer[currentQuestion])?.is_correct

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Quiz Completed!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-4xl font-bold mb-4">Your Score: {score}</p>
            <p className="mb-4">
              You answered {answeredQuestions.length} questions.
            </p>
            <Button onClick={resetQuiz}>Play Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">{data.title}</CardTitle>
          <CardDescription className="text-center">{data.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Question {currentQuestion + 1}</h2>
          <p className="mb-4">{question.description}</p>
          <RadioGroup value={selectedAnswer[currentQuestion] || ""} onValueChange={(value) => setSelectedAnswer([...selectedAnswer.slice(0, currentQuestion), value, ...selectedAnswer.slice(currentQuestion + 1)])}>
            {question.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2 mb-2">
              {answeredQuestions.includes(currentQuestion) && option.is_correct && <Check className="text-green-500" />}
              {answeredQuestions.includes(currentQuestion) && !option.is_correct && <CircleX className="text-red-500" />}
                <RadioGroupItem value={option.id.toString()} id={option.id.toString()}
                  disabled={showFeedback || answeredQuestions.includes(currentQuestion)}
                />
                <Label htmlFor={option.id.toString()}>{option.description}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button onClick={handlePrevious} disabled={currentQuestion === 0} variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <div className="text-center">
            <p className="font-semibold mb-2">Score: {score}</p>
            {showFeedback && (
              <p className={`font-semibold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                {isCorrect ? "+4 points" : "-1 point"}
              </p>
            )}
          </div>
          {answeredQuestions.includes(currentQuestion) ? (
            <Button onClick={handleNext}>
              {currentQuestion === data.questions.length - 1 ? "Finish" : "Next"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!selectedAnswer || answeredQuestions.includes(currentQuestion)}>
              Submit
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}


