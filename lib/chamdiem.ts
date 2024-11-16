// chamdiem.ts

interface Question {
    stt: number;
    selectedAnswer: string;
    correctAnswer: string;
  }
  
  function chamDiem(questions: Question[]): number {
    let caudung = 0;
  
    for (const question of questions) {
      if (question.selectedAnswer === question.correctAnswer) {
        caudung += 1;
      }
    }

    const score = (caudung / questions.length) * 10;
    return Math.round(score * 10) / 10;
    }

  export function socaudung (questions: Question[]):number {  
    let socaudung: number = questions.filter((question) => question.selectedAnswer === question.correctAnswer).length;
    return socaudung
  }
  export default chamDiem;
  